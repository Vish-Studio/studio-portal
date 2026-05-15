import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
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
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { accessService } from "./access-service";
import { requireFirebase } from "./firebase-service";
import type {
  AuthProfile,
  AuthProfileUpdateInput,
  AuthRole,
  StaffRole,
} from "@/src/types/auth";

const fallbackAdminEmails = [
  "vishstudio.ltd@gmail.com",
  "vishseenarain@gmail.com",
];

const envAdminEmails = String(import.meta.env.VITE_FIREBASE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const adminEmails = new Set([...fallbackAdminEmails, ...envAdminEmails]);

const normalizeEmail = (email?: string | null) => (email ?? "").trim().toLowerCase();

const fullNameFromEmail = (email: string) =>
  email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ") || "User";

const inferRole = (email: string): AuthRole => {
  const normalizedEmail = normalizeEmail(email);
  if (normalizedEmail === "vishstudio.ltd@gmail.com") return "superadmin";
  if (adminEmails.has(normalizedEmail)) return "admin";
  return "client";
};

const normalizeRole = (role: unknown, email: string): AuthRole => {
  if (role === "user") return "client";
  if (
    role === "client" ||
    role === "superadmin" ||
    role === "admin" ||
    role === "freelancer"
  ) {
    return role;
  }

  return inferRole(email);
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
    staffRole: isStaffRole(role) ? data.staffRole ?? role : undefined,
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

    try {
      return await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const canTryCreate =
        message.includes("auth/user-not-found") ||
        message.includes("auth/invalid-credential") ||
        message.includes("auth/wrong-password");

      if (!canTryCreate) throw error;

      const access = await accessService.getAccess(normalizedEmail);
      if (!access || access.status !== "active") {
        throw new Error("No active account invitation exists for this email.");
      }

      try {
        return await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password,
        );
      } catch (createError) {
        const createMessage =
          createError instanceof Error ? createError.message : "";
        if (createMessage.includes("auth/email-already-in-use")) {
          throw new Error("Invalid email or password.");
        }
        throw createError;
      }
    }
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

    const access = await accessService.getAccess(email);
    const role = normalizeRole(access?.profileRole, email);
    const fullName = user.displayName ?? access?.fullName ?? fullNameFromEmail(email);
    const profile: AuthProfile = {
      uid: user.uid,
      email,
      fullName,
      role,
      staffRole: isStaffRole(role) ? access?.staffRole ?? role : undefined,
      teamId: access?.teamId ?? access?.teamMemberId,
      teamMemberId: access?.teamMemberId,
      clientId: access?.clientId,
      status: "active",
    };

    await setDoc(
      ref,
      removeUndefined({
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    );

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
