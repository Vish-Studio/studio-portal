import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updateProfile as firebaseUpdateProfile,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  type User,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { requireFirebase } from "./firebase-service";
import type {
  AuthProfile,
  AuthProfileUpdateInput,
  AuthRole,
  StaffRole,
} from "@/src/types/auth";

const fallbackSuperAdminEmails = [
  "vishstudio.ltd@gmail.com",
  "vishseenarain@gmail.com",
];

const envAdminEmails = String(import.meta.env.VITE_FIREBASE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const superAdminEmails = new Set(fallbackSuperAdminEmails);
const adminEmails = new Set([...envAdminEmails]);

const normalizeEmail = (email?: string | null) => (email ?? "").trim().toLowerCase();

const fullNameFromEmail = (email: string) =>
  email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ") || "User";

const inferRole = (email: string): AuthRole | null => {
  const normalizedEmail = normalizeEmail(email);
  if (superAdminEmails.has(normalizedEmail)) return "superadmin";
  if (adminEmails.has(normalizedEmail)) return "admin";
  return null;
};

const normalizeRole = (role: unknown, email: string): AuthRole => {
  if (superAdminEmails.has(normalizeEmail(email))) return "superadmin";
  if (role === "user") return "client";
  if (
    role === "client" ||
    role === "superadmin" ||
    role === "admin" ||
    role === "freelancer"
  ) {
    return role;
  }

  return inferRole(email) ?? "client";
};

const isStaffRole = (role: AuthRole): role is StaffRole => role !== "client";

const removeUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<T>;

const profileFromUserDocument = (
  user: User,
  data: Partial<AuthProfile> & { displayName?: string },
): AuthProfile => {
  const email = normalizeEmail(user.email || data.email);
  const role = normalizeRole(data.role, email);

  return {
    uid: user.uid,
    email: data.email ?? email,
    fullName:
      data.fullName ??
      data.displayName ??
      user.displayName ??
      fullNameFromEmail(email),
    role,
    staffRole: isStaffRole(role)
      ? role === "superadmin"
        ? "superadmin"
        : data.staffRole ?? role
      : undefined,
    status: data.status ?? "active",
    teamMemberId: data.teamMemberId,
    teamId: data.teamId ?? data.teamMemberId,
    clientId: data.clientId,
    phone: data.phone,
    jobTitle: data.jobTitle,
    company: data.company,
    recoveryEmail: data.recoveryEmail,
    newsletterPreferences: data.newsletterPreferences,
    createdAt: data.createdAt as Timestamp | undefined,
    updatedAt: data.updatedAt as Timestamp | undefined,
  };
};

const syncLinkedProfile = async (
  user: User,
  profile: AuthProfile,
): Promise<AuthProfile> => {
  const { db } = requireFirebase();

  if (profile.role === "client") {
    const clientId = profile.clientId ?? user.uid;
    const clientRef = doc(db, "clients", clientId);

    await setDoc(
      clientRef,
      { userId: user.uid, updatedAt: serverTimestamp() },
      { merge: true },
    );

    await setDoc(
      clientRef,
      removeUndefined({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        updatedAt: serverTimestamp(),
      }),
      { merge: true },
    );

    if (profile.clientId !== clientId) {
      await setDoc(
        doc(db, "users", user.uid),
        { clientId, updatedAt: serverTimestamp() },
        { merge: true },
      );
    }

    return { ...profile, role: "client", clientId };
  }

  const teamId = profile.teamId ?? profile.teamMemberId ?? user.uid;
  const accessRole = profile.staffRole ?? profile.role;

  const teamRef = doc(db, "team", teamId);
  const teamSnapshot = await getDoc(teamRef);
  const teamPayload = removeUndefined({
      userId: user.uid,
      name: profile.fullName,
      role: profile.jobTitle || accessRole,
      accessRole,
      email: profile.email,
      assignedProjectId: null,
      updatedAt: serverTimestamp(),
    });

  if (teamSnapshot.exists()) {
    await updateDoc(
      teamRef,
      profile.role === "superadmin"
        ? teamPayload
        : { userId: user.uid, updatedAt: serverTimestamp() },
    );
  } else {
    await setDoc(teamRef, {
      ...teamPayload,
      createdAt: serverTimestamp(),
    });
  }

  if (profile.teamId !== teamId || profile.staffRole !== accessRole) {
    await setDoc(
      doc(db, "users", user.uid),
      {
        staffRole: accessRole,
        teamId,
        teamMemberId: profile.teamMemberId ?? teamId,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  return {
    ...profile,
    staffRole: accessRole,
    teamId,
    teamMemberId: profile.teamMemberId ?? teamId,
  };
};

export const authService = {
  async signIn(email: string, password: string) {
    const { auth } = requireFirebase();
    return signInWithEmailAndPassword(auth, normalizeEmail(email), password);
  },

  async signInOrCreateAllowedUser(email: string, password: string) {
    const { auth } = requireFirebase();
    const normalizedEmail = normalizeEmail(email);
    return signInWithEmailAndPassword(auth, normalizedEmail, password);
  },

  async signOut() {
    const { auth } = requireFirebase();
    await signOut(auth);
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    const { auth } = requireFirebase();
    return onAuthStateChanged(auth, callback);
  },

  async sendPasswordReset(email: string) {
    const { auth } = requireFirebase();
    await sendPasswordResetEmail(auth, normalizeEmail(email), {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    });
  },

  async verifyPasswordReset(code: string) {
    const { auth } = requireFirebase();
    return firebaseVerifyPasswordResetCode(auth, code);
  },

  async confirmPasswordReset(code: string, password: string) {
    const { auth } = requireFirebase();
    await firebaseConfirmPasswordReset(auth, code, password);
  },

  async upsertProfile(user: User): Promise<AuthProfile> {
    const { db } = requireFirebase();
    const email = normalizeEmail(user.email);
    const ref = doc(db, "users", user.uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const profile = profileFromUserDocument(
        user,
        snapshot.data() as Partial<AuthProfile>,
      );

      await setDoc(
        ref,
        removeUndefined({
          email: profile.email,
          fullName: profile.fullName,
          role: profile.role,
          staffRole: profile.staffRole,
          teamId: profile.teamId,
          teamMemberId: profile.teamMemberId,
          clientId: profile.clientId,
          updatedAt: serverTimestamp(),
        }),
        { merge: true },
      );

      return syncLinkedProfile(user, profile);
    }

    const stagedRef = doc(db, "users", email);
    const stagedSnapshot = await getDoc(stagedRef);
    const fallbackRole = inferRole(email);

    if (!stagedSnapshot.exists() && !fallbackRole) {
      throw new Error("No app profile exists for this email. Ask an admin to create the user first.");
    }

    const stagedData = stagedSnapshot.exists()
      ? stagedSnapshot.data() as Partial<AuthProfile>
      : {};
    const role = normalizeRole(stagedData.role, email);
    const fullName = user.displayName ?? stagedData.fullName ?? fullNameFromEmail(email);
    const profile: AuthProfile = {
      uid: user.uid,
      email,
      fullName,
      role,
      staffRole: isStaffRole(role) ? stagedData.staffRole ?? role : undefined,
      teamId: stagedData.teamId ?? stagedData.teamMemberId,
      teamMemberId: stagedData.teamMemberId,
      clientId: stagedData.clientId,
      phone: stagedData.phone,
      jobTitle: stagedData.jobTitle,
      company: stagedData.company,
      status: stagedData.status ?? "active",
    };

    await setDoc(
      ref,
      removeUndefined({
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    );

    if (stagedSnapshot.exists()) {
      await deleteDoc(stagedRef);
    }

    return syncLinkedProfile(user, profile);
  },

  async updateCurrentProfile(input: AuthProfileUpdateInput): Promise<AuthProfile> {
    const { auth, db } = requireFirebase();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You need to be signed in to update your profile.");
    }

    const normalizedInput = removeUndefined({
      ...input,
      email: input.email?.trim().toLowerCase(),
      fullName: input.fullName?.trim(),
      phone: input.phone?.trim(),
      jobTitle: input.jobTitle?.trim(),
      company: input.company?.trim(),
      recoveryEmail: input.recoveryEmail?.trim().toLowerCase(),
      updatedAt: serverTimestamp(),
    });

    if (typeof normalizedInput.fullName === "string" && normalizedInput.fullName) {
      await firebaseUpdateProfile(user, { displayName: normalizedInput.fullName });
    }

    if (
      typeof normalizedInput.email === "string" &&
      normalizedInput.email &&
      normalizedInput.email !== normalizeEmail(user.email)
    ) {
      await updateEmail(user, normalizedInput.email);
    }

    const ref = doc(db, "users", user.uid);
    await setDoc(ref, normalizedInput, { merge: true });

    const snapshot = await getDoc(ref);
    const profile = profileFromUserDocument(
      user,
      snapshot.data() as Partial<AuthProfile>,
    );

    return syncLinkedProfile(user, profile);
  },
};
