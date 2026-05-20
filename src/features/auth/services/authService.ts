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
  collection,
  deleteField,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { requireFirebase } from "@/src/firebase/requireFirebase";
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

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] ?? "",
    last_name: parts.slice(1).join(" "),
  };
};

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

const legacyUserFieldDeletes = () => ({
  fullName: deleteField(),
  phone: deleteField(),
  jobTitle: deleteField(),
  company: deleteField(),
  recoveryEmail: deleteField(),
  newsletter: deleteField(),
  staffRole: deleteField(),
  teamId: deleteField(),
  teamMemberId: deleteField(),
  clientId: deleteField(),
  createdAt: deleteField(),
  updatedAt: deleteField(),
});

const findLinkedDocumentId = async (
  collectionName: "clients" | "team",
  email: string,
  uid: string,
) => {
  const { db } = requireFirebase();
  const byUserId = await getDocs(
    query(collection(db, collectionName), where("user_id", "==", uid), limit(1)),
  );
  if (!byUserId.empty) return byUserId.docs[0].id;

  const byLegacyUserId = await getDocs(
    query(collection(db, collectionName), where("userId", "==", uid), limit(1)),
  );
  if (!byLegacyUserId.empty) return byLegacyUserId.docs[0].id;

  const byEmail = await getDocs(
    query(collection(db, collectionName), where("email", "==", email), limit(1)),
  );
  return byEmail.empty ? null : byEmail.docs[0].id;
};

const profileFromUserDocument = (
  user: User,
  data: Partial<AuthProfile> & { displayName?: string; newsletter?: boolean },
): AuthProfile => {
  const email = normalizeEmail(user.email || data.email);
  const role = normalizeRole(data.role, email);
  const fullName =
    data.full_name ??
    data.fullName ??
    data.displayName ??
    user.displayName ??
    fullNameFromEmail(email);
  const nameParts = splitName(fullName);
  const isActive = data.is_active ?? (data.status !== "inactive" && data.status !== "lost");

  return {
    id: user.uid,
    uid: user.uid,
    email: data.email ?? email,
    full_name: fullName,
    first_name: data.first_name ?? nameParts.first_name,
    last_name: data.last_name ?? nameParts.last_name,
    recovery_email: data.recovery_email ?? data.recoveryEmail,
    gender: data.gender ?? "",
    phone_number: data.phone_number ?? data.phone,
    company_name: data.company_name ?? data.company,
    created_at: data.created_at ?? data.createdAt as Timestamp | undefined,
    updated_at: data.updated_at ?? data.updatedAt as Timestamp | undefined,
    fullName,
    role,
    feature_access: data.feature_access ?? {},
    is_active: isActive,
    staffRole: isStaffRole(role)
      ? role === "superadmin"
        ? "superadmin"
        : data.staffRole ?? role
      : undefined,
    status: data.status ?? (isActive ? "active" : "inactive"),
    teamMemberId: data.teamMemberId,
    teamId: data.teamId ?? data.teamMemberId,
    clientId: data.clientId,
    phone: data.phone_number ?? data.phone,
    job_title: data.job_title ?? data.jobTitle,
    jobTitle: data.job_title ?? data.jobTitle,
    company: data.company_name ?? data.company,
    recoveryEmail: data.recovery_email ?? data.recoveryEmail,
    newsletterPreferences: data.newsletterPreferences ?? data.newsletter ?? false,
    createdAt: data.created_at ?? data.createdAt as Timestamp | undefined,
    updatedAt: data.updated_at ?? data.updatedAt as Timestamp | undefined,
  };
};

const syncLinkedProfile = async (
  user: User,
  profile: AuthProfile,
): Promise<AuthProfile> => {
  const { db } = requireFirebase();

  if (profile.role === "client") {
    const clientId = profile.clientId ?? user.uid;
    const linkedClientId =
      await findLinkedDocumentId("clients", profile.email, user.uid) ?? clientId;
    const clientRef = doc(db, "clients", linkedClientId);

    await setDoc(
      clientRef,
      { userId: user.uid, user_id: user.uid, updatedAt: serverTimestamp(), updated_at: serverTimestamp() },
      { merge: true },
    );

    await setDoc(
      clientRef,
      removeUndefined({
        fullName: profile.fullName,
        full_name: profile.full_name,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        phone_number: profile.phone_number,
        companyName: profile.company_name,
        company_name: profile.company_name,
        status: profile.status,
        is_active: profile.is_active,
        updatedAt: serverTimestamp(),
        updated_at: serverTimestamp(),
      }),
      { merge: true },
    );

    return { ...profile, role: "client", clientId: linkedClientId };
  }

  const teamId =
    await findLinkedDocumentId("team", profile.email, user.uid) ??
    profile.teamId ??
    profile.teamMemberId ??
    user.uid;
  const accessRole = profile.staffRole ?? profile.role;

  const teamRef = doc(db, "team", teamId);
  const teamSnapshot = await getDoc(teamRef);
  const teamPayload = removeUndefined({
      userId: user.uid,
      user_id: user.uid,
      name: profile.fullName,
      full_name: profile.full_name,
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.jobTitle || accessRole,
      job_title: profile.jobTitle || accessRole,
      accessRole,
      email: profile.email,
      assignedProjectId: null,
      status: profile.status,
      is_active: profile.is_active,
      updatedAt: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

  if (teamSnapshot.exists()) {
    await updateDoc(
      teamRef,
      profile.role === "superadmin"
        ? teamPayload
        : { userId: user.uid, user_id: user.uid, updatedAt: serverTimestamp(), updated_at: serverTimestamp() },
    );
  } else {
    await setDoc(teamRef, {
      ...teamPayload,
      createdAt: serverTimestamp(),
      created_at: serverTimestamp(),
    });
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
          ...legacyUserFieldDeletes(),
          id: user.uid,
          email: profile.email,
          full_name: profile.full_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          recovery_email: profile.recovery_email,
          gender: profile.gender,
          phone_number: profile.phone_number,
          company_name: profile.company_name,
          role: profile.role,
          feature_access: profile.feature_access,
          is_active: profile.is_active,
          status: profile.status,
          job_title: profile.jobTitle,
          newsletterPreferences: profile.newsletterPreferences,
          updated_at: serverTimestamp(),
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
      ? stagedSnapshot.data() as Partial<AuthProfile> & { newsletter?: boolean }
      : {};
    const role = normalizeRole(stagedData.role, email);
    const fullName = user.displayName ?? stagedData.full_name ?? stagedData.fullName ?? fullNameFromEmail(email);
    const nameParts = splitName(fullName);
    const profile: AuthProfile = {
      id: user.uid,
      uid: user.uid,
      email,
      full_name: fullName,
      first_name: stagedData.first_name ?? nameParts.first_name,
      last_name: stagedData.last_name ?? nameParts.last_name,
      recovery_email: stagedData.recovery_email ?? stagedData.recoveryEmail,
      gender: stagedData.gender ?? "",
      phone_number: stagedData.phone_number ?? stagedData.phone,
      company_name: stagedData.company_name ?? stagedData.company,
      fullName,
      role,
      feature_access: stagedData.feature_access ?? {},
      is_active: stagedData.is_active ?? true,
      staffRole: isStaffRole(role) ? stagedData.staffRole ?? role : undefined,
      teamId: stagedData.teamId ?? stagedData.teamMemberId,
      teamMemberId: stagedData.teamMemberId,
      clientId: stagedData.clientId,
      phone: stagedData.phone_number ?? stagedData.phone,
      job_title: stagedData.job_title ?? stagedData.jobTitle,
      jobTitle: stagedData.job_title ?? stagedData.jobTitle,
      company: stagedData.company_name ?? stagedData.company,
      recoveryEmail: stagedData.recovery_email ?? stagedData.recoveryEmail,
      status: stagedData.status ?? "active",
      newsletterPreferences: stagedData.newsletterPreferences ?? stagedData.newsletter ?? false,
    };

    await setDoc(
      ref,
      removeUndefined({
        ...legacyUserFieldDeletes(),
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        first_name: profile.first_name,
        last_name: profile.last_name,
        recovery_email: profile.recovery_email,
        gender: profile.gender,
        phone_number: profile.phone_number,
        company_name: profile.company_name,
        role: profile.role,
        feature_access: profile.feature_access,
        is_active: profile.is_active,
        status: profile.status,
        job_title: profile.job_title,
        newsletterPreferences: profile.newsletterPreferences,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
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
      ...legacyUserFieldDeletes(),
      email: input.email?.trim().toLowerCase(),
      full_name: (input.full_name ?? input.fullName)?.trim(),
      first_name: input.first_name?.trim(),
      last_name: input.last_name?.trim(),
      recovery_email: (input.recovery_email ?? input.recoveryEmail)?.trim().toLowerCase(),
      gender: input.gender,
      phone_number: (input.phone_number ?? input.phone)?.trim(),
      company_name: (input.company_name ?? input.company)?.trim(),
      feature_access: input.feature_access,
      is_active: input.is_active,
      status: input.status,
      job_title: (input.job_title ?? input.jobTitle)?.trim(),
      newsletterPreferences: input.newsletterPreferences,
      updated_at: serverTimestamp(),
    });

    if (typeof normalizedInput.full_name === "string" && normalizedInput.full_name) {
      await firebaseUpdateProfile(user, { displayName: normalizedInput.full_name });
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
