import { useMemo, useState } from 'react';
import { Copy, KeyRound, RotateCcw, ShieldCheck, Users } from 'lucide-react';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import { Button, CardContent, SearchBar, StatusBadge, StatCard } from '@/src/shared/components';
import { useUIStore } from '@/src/app/stores/uiStore';
import { useUsersStore } from '../stores/userStore';
import type { ManagedUser, ManagedUserAccountStatus } from '../types';
import type { StatusVariant } from '@/src/shared/components/status-badge/status-badge';

const ACCOUNT_STATUS_VARIANT: Record<ManagedUserAccountStatus, StatusVariant> = {
  active: 'green',
  working: 'green',
  inactive: 'amber',
  'on-leave': 'amber',
  lost: 'red',
  fired: 'red',
};

const PASSWORD_STATUS_VARIANT: Record<ManagedUser['passwordStatus'], StatusVariant> = {
  temporary: 'amber',
  changed: 'green',
};

const formatKind = (kind: ManagedUser['kind']) => (kind === 'client' ? 'Client' : 'Team');
const formatPasswordStatus = (status: ManagedUser['passwordStatus']) => (
  status === 'temporary' ? 'Temporary password' : 'Password changed'
);

export default function UsersPage() {
  const users = useUsersStore(state => state.users);
  const resetPassword = useUsersStore(state => state.resetPassword);
  const showToast = useUIStore(state => state.showToast);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users
      .filter(user => !query || [user.name, user.email, user.roleLabel, user.kind].some(value => value.toLowerCase().includes(query)))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [users, searchQuery]);

  const temporaryCount = users.filter(user => user.passwordStatus === 'temporary').length;
  const changedCount = users.filter(user => user.passwordStatus === 'changed').length;
  const activeCount = users.filter(user => ['active', 'working'].includes(user.accountStatus)).length;

  const copyAccess = async (user: ManagedUser) => {
    await navigator.clipboard?.writeText(`${user.email}\n${user.temporaryPassword}`);
    showToast({ title: 'Access copied', message: 'User access copied.', status: 'success' });
  };

  const handleResetPassword = (user: ManagedUser) => {
    const temporaryPassword = resetPassword(user.id);
    navigator.clipboard?.writeText(`${user.email}\n${temporaryPassword}`);
    showToast({ title: 'Password reset', message: 'Temporary password reset and copied.', status: 'success' });
  };

  return (
    <DashboardLayout title="Users">
      <div className="users-page space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard size="sm" variant="lime" icon={<Users size={16} />} label="Managed Users" value={users.length} badge={`${activeCount} active`} badgeLabel="local accounts" />
          <StatCard size="sm" variant="surface" icon={<KeyRound size={16} />} label="Temporary" value={temporaryCount} badge="Needs change" badgeLabel="password status" />
          <StatCard size="sm" variant="white" icon={<ShieldCheck size={16} />} label="Changed" value={changedCount} badge="Confirmed" badgeLabel="password status" />
        </div>

        <CardContent
          iconName="manage_accounts"
          title="Local User Access"
          action={
            <SearchBar
              className="w-56 md:w-72"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search users..."
            />
          }
          bodyClassName="p-0"
        >
          {filteredUsers.length === 0 ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center p-8 text-center">
              <p className="text-sm font-semibold text-(--color-ink)">No users yet</p>
              <p className="mt-2 max-w-md text-sm font-medium text-gray-500">
                Create a client or team member with a temporary password and they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="users-row grid gap-3 px-4 py-3 transition-colors hover:bg-(--color-surface-alt) md:grid-cols-[minmax(0,1fr)_minmax(170px,0.6fr)_auto] md:items-center md:px-5"
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="type-label rounded-[8px] bg-(--color-surface-alt) px-2 py-0.5 text-gray-500">
                        {formatKind(user.kind)}
                      </span>
                      <StatusBadge label={user.accountStatus} variant={ACCOUNT_STATUS_VARIANT[user.accountStatus]} />
                    </div>
                    <p className="truncate text-sm font-semibold text-(--color-ink)">{user.name}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-gray-400">{user.email} - {user.roleLabel}</p>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1">
                      <StatusBadge label={formatPasswordStatus(user.passwordStatus)} variant={PASSWORD_STATUS_VARIANT[user.passwordStatus]} />
                    </div>
                    <p className="break-all font-mono text-xs font-bold text-(--color-ink)">{user.temporaryPassword}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Button size="sm" variant="secondary" iconLeft={<Copy size={14} />} onClick={() => copyAccess(user)}>
                      Copy
                    </Button>
                    <Button size="sm" variant="ghost" iconLeft={<RotateCcw size={14} />} onClick={() => handleResetPassword(user)}>
                      Reset
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </DashboardLayout>
  );
}
