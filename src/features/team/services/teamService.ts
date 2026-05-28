import {
  collection,
  deleteField,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type FirestoreError,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
import { userProvisioningService } from '@/src/features/auth/services/userProvisioningService';
import { userDocToTeamMember } from '@/src/firebase/firestoreTransformers';
import type { TeamAccessRole, TeamMember, TeamSalaryType, TeamWorkStatus } from '../types';

export interface TeamMemberInput {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
  phone?: string;
  isOnline?: boolean;
  lastOnlineAt?: string;
  salaryAmount?: number;
  salaryType?: TeamSalaryType;
  status?: TeamWorkStatus;
  assignedProjectId?: string | null;
  temporaryPassword?: string;
}

export interface TeamMemberCreateResult {
  id: string;
  email: string;
  temporaryPassword: string;
}

const usersCollection = () => collection(requireFirebase().db, 'users');

const syncSalaryExpense = async (
  memberId: string,
  memberName: string,
  salaryAmount?: number,
  salaryType: TeamSalaryType = 'monthly',
) => {
  const { db } = requireFirebase();
  const salaryRef = doc(db, 'expenses', `team_salary_${memberId}`);

  if (!salaryAmount || salaryAmount <= 0) {
    await deleteDoc(salaryRef).catch(() => undefined);
    return;
  }

  await setDoc(salaryRef, {
    type: 'expense',
    category: 'team-salary',
    status: 'scheduled',
    amount: salaryAmount,
    title: `${memberName} salary`,
    description: salaryType === 'monthly' ? 'Monthly team salary' : 'Per-project team payout',
    vendor: memberName,
    memberId,
    date: new Date().toISOString().slice(0, 10),
    source: 'team-profile',
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
};

export const teamService = {
  subscribeToMembers(
    onMembers: (members: TeamMember[]) => void,
    onError: (error: FirestoreError) => void,
  ): Unsubscribe {
    return onSnapshot(
      query(usersCollection(), where('role', 'in', ['superadmin', 'admin', 'freelancer', 'team'])),
      snapshot => onMembers(snapshot.docs.map(userDocToTeamMember)),
      onError,
    );
  },

  async createMember(input: TeamMemberInput): Promise<TeamMemberCreateResult> {
    const { db } = requireFirebase();
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    const position = input.role.trim();
    const role = input.accessRole === 'team' ? 'freelancer' : input.accessRole;
    const phone = input.phone?.trim() ?? '';
    const status = input.status ?? 'working';
    const salaryAmount = Number(input.salaryAmount ?? 0);
    const salaryType = input.salaryType ?? 'monthly';
    const temporaryPassword = input.temporaryPassword?.trim();

    if (!name) throw new Error('Team member name is required.');
    if (!position) throw new Error('Team member role is required.');
    if (!temporaryPassword) throw new Error('Temporary password is required to create a team member login.');

    const user = await userProvisioningService.createUser({
      email,
      password: temporaryPassword,
      displayName: name,
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      fullName: name,
      email,
      role,
      needsPasswordChange: true,
      jobTitle: position,
      phoneNumber: phone,
      isOnline: input.isOnline === true,
      lastOnlineAt: input.lastOnlineAt || '',
      salaryAmount,
      salaryType,
      assignedProjectId: input.assignedProjectId ?? null,
      status,
      workStatus: status,
      isActive: status === 'working',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'team', user.uid), {
      id: user.uid,
      position,
      phoneNumber: phone,
      salaryAmount,
      salaryType,
      status,
      assignedProjectId: input.assignedProjectId ?? null,
    });
    await syncSalaryExpense(user.uid, name, salaryAmount, salaryType);

    return { id: user.uid, email, temporaryPassword };
  },

  async updateMember(id: string, input: Partial<TeamMemberInput>): Promise<void> {
    const { db } = requireFirebase();
    const userRef = doc(db, 'users', id);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('Team member profile was not found.');
    }

    const existing = userSnapshot.data();
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const position = input.role?.trim();
    const phone = input.phone?.trim();
    const salaryAmount = input.salaryAmount !== undefined ? Number(input.salaryAmount) : Number(existing.salaryAmount ?? existing.salary_amount ?? 0);
    const salaryType = input.salaryType ?? (existing.salaryType === 'per-project' || existing.salary_type === 'per-project' ? 'per-project' : 'monthly');
    const nextWorkStatus = input.status ?? (existing.workStatus === 'fired' || existing.status === 'fired'
      ? 'fired'
      : existing.workStatus === 'on-leave' || existing.status === 'on-leave'
        ? 'on-leave'
        : 'working');
    const role = input.accessRole
      ? input.accessRole === 'team' ? 'freelancer' : input.accessRole
      : String(existing.role ?? 'freelancer');
    const nextName = name || String(existing.fullName ?? existing.name ?? existing.full_name ?? 'Unnamed member');
    const nextEmail = email || String(existing.email ?? '');
    const nextPosition = position !== undefined
      ? position
      : String(existing.jobTitle ?? existing.job_title ?? 'Team member');
    await setDoc(
      userRef,
      {
        uid: typeof existing.uid === 'string' ? existing.uid : id,
        fullName: nextName,
        email: nextEmail,
        role,
        needsPasswordChange: typeof existing.needsPasswordChange === 'boolean' ? existing.needsPasswordChange : false,
        jobTitle: nextPosition,
        phoneNumber: phone !== undefined ? phone : String(existing.phoneNumber ?? existing.phone_number ?? ''),
        isOnline: input.isOnline !== undefined ? input.isOnline : existing.isOnline === true,
        lastOnlineAt: input.lastOnlineAt !== undefined ? input.lastOnlineAt : String(existing.lastOnlineAt ?? existing.last_online_at ?? ''),
        salaryAmount,
        salaryType,
        status: nextWorkStatus,
        workStatus: nextWorkStatus,
        isActive: nextWorkStatus === 'working',
        createdAt: existing.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: deleteField(),
        name: deleteField(),
        full_name: deleteField(),
        job_title: deleteField(),
        phone_number: deleteField(),
        salary_amount: deleteField(),
        salary_type: deleteField(),
        is_online: deleteField(),
        last_online_at: deleteField(),
        is_active: deleteField(),
        created_at: deleteField(),
        updated_at: deleteField(),
      },
      { merge: true },
    );

    await setDoc(doc(db, 'team', id), {
      id,
      position: nextPosition,
      phoneNumber: phone !== undefined ? phone : String(existing.phoneNumber ?? existing.phone_number ?? ''),
      salaryAmount,
      salaryType,
      status: nextWorkStatus,
    }, { merge: true });
    await syncSalaryExpense(id, nextName, salaryAmount, salaryType);
  },

  async deleteMember(id: string): Promise<void> {
    const { db } = requireFirebase();
    await deleteDoc(doc(db, 'users', id));
    await deleteDoc(doc(db, 'team', id));
  },

  async assignMember(memberId: string, projectId: string | null): Promise<void> {
    const { db } = requireFirebase();
    const userSnapshot = await getDoc(doc(db, 'users', memberId));
    const userData = userSnapshot.exists() ? userSnapshot.data() : {};
    const position = String(userData.jobTitle ?? userData.job_title ?? 'Team member');

    await setDoc(
      doc(db, 'users', memberId),
      {
        assignedProjectId: projectId,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await setDoc(
      doc(db, 'team', memberId),
      {
        id: memberId,
        position,
        assignedProjectId: projectId,
      },
      { merge: true },
    );
  },
};
