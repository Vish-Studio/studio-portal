import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageCircle, Send, UserRound, UsersRound } from 'lucide-react';
import Avatar from '../../common/avatar/avatar';
import Button from '../../common/button/button';
import MaterialIcon from '../../common/material-icon/material-icon';
import {
  useChatStore,
  type ChatConversation,
  type ChatConversationType,
  type ChatSenderRole,
} from '@/src/store/chat';
import { useClientsStore } from '@/src/store/clients';
import { useTeamStore } from '@/src/store/team';
import { useUIStore } from '@/src/store/ui';
import { cn } from '@/src/lib/utils';

interface ChatWorkspaceProps {
  mode: 'admin' | 'client';
  currentClientId?: string;
}

interface ChatParticipant {
  id: string;
  type: ChatConversationType;
  name: string;
  meta: string;
  email?: string;
}

const ADMIN_NAME = 'Studio Admin';

const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(timestamp);

const formatDay = (timestamp: number) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(timestamp);

const getPreview = (conversation?: ChatConversation) => {
  const last = conversation?.messages.at(-1);
  return last?.body ?? 'No messages yet.';
};

const getConversationParticipantId = (conversation: ChatConversation) =>
  conversation.participantId ?? conversation.clientId ?? conversation.teamMemberId;

const getConversationType = (conversation: ChatConversation): ChatConversationType =>
  conversation.type ?? 'client';

const getConversationFor = (
  conversations: ChatConversation[],
  participant: Pick<ChatParticipant, 'id' | 'type'> | null,
) => conversations.find(
  conversation =>
    participant &&
    getConversationType(conversation) === participant.type &&
    getConversationParticipantId(conversation) === participant.id,
);

const getUnreadCount = (conversation: ChatConversation | undefined, role: ChatSenderRole) => {
  if (!conversation) return 0;
  const lastReadAt =
    role === 'admin'
      ? conversation.lastReadByAdminAt
      : role === 'team'
        ? conversation.lastReadByTeamAt
        : conversation.lastReadByClientAt;

  return conversation.messages.filter(
    message => message.senderRole !== role && message.createdAt > (lastReadAt ?? 0),
  ).length;
};

export default function ChatWorkspace({ mode, currentClientId = 'c1' }: ChatWorkspaceProps) {
  const clients = useClientsStore(state => state.clients);
  const teamMembers = useTeamStore(state => state.members);
  const conversations = useChatStore(state => state.conversations);
  const sendConversationMessage = useChatStore(state => state.sendConversationMessage);
  const markConversationRead = useChatStore(state => state.markConversationRead);
  const searchQuery = useUIStore(state => state.searchQuery);
  const [draft, setDraft] = useState('');
  const [activeSection, setActiveSection] = useState<ChatConversationType>('client');
  const [selectedParticipant, setSelectedParticipant] = useState<Pick<ChatParticipant, 'id' | 'type'> | null>(
    mode === 'client' ? { id: currentClientId, type: 'client' } : null,
  );
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(mode === 'client');
  const [isCompact, setIsCompact] = useState(false);

  const clientParticipants = useMemo<ChatParticipant[]>(
    () => clients.map(client => ({
      id: client.id,
      type: 'client',
      name: client.displayName,
      meta: client.companyName || client.email,
      email: client.email,
    })),
    [clients],
  );

  const teamParticipants = useMemo<ChatParticipant[]>(
    () => teamMembers.map(member => ({
      id: member.id,
      type: 'team',
      name: member.name,
      meta: member.role,
      email: member.email,
    })),
    [teamMembers],
  );

  const visibleParticipants = useMemo(() => {
    const source = mode === 'admin'
      ? activeSection === 'client' ? clientParticipants : teamParticipants
      : clientParticipants.filter(client => client.id === currentClientId);

    if (!searchQuery.trim()) return source;
    const query = searchQuery.toLowerCase();
    return source.filter(participant =>
      participant.name.toLowerCase().includes(query) ||
      participant.meta.toLowerCase().includes(query) ||
      (participant.email ?? '').toLowerCase().includes(query),
    );
  }, [activeSection, clientParticipants, currentClientId, mode, searchQuery, teamParticipants]);

  useEffect(() => {
    if (mode === 'client') {
      setSelectedParticipant({ id: currentClientId, type: 'client' });
      setIsMobileThreadOpen(true);
    }
  }, [currentClientId, mode]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const activeParticipant = useMemo(() => {
    if (!selectedParticipant) return null;
    const source = selectedParticipant.type === 'client' ? clientParticipants : teamParticipants;
    return source.find(participant => participant.id === selectedParticipant.id) ?? null;
  }, [clientParticipants, selectedParticipant, teamParticipants]);

  const activeConversation = getConversationFor(conversations, activeParticipant);
  const activeMessages = activeConversation?.messages ?? [];
  const senderRole: ChatSenderRole = mode === 'admin' ? 'admin' : 'client';
  const senderName = mode === 'admin' ? ADMIN_NAME : activeParticipant?.name ?? 'Client';
  const showInbox = mode === 'admin' && (!isCompact || !isMobileThreadOpen);
  const showThread = mode === 'client' || !isCompact || isMobileThreadOpen;

  useEffect(() => {
    if (activeParticipant && showThread) {
      markConversationRead(activeParticipant.type, activeParticipant.id, senderRole);
    }
  }, [activeParticipant?.id, activeParticipant?.type, markConversationRead, senderRole, showThread]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeParticipant || !draft.trim()) return;
    sendConversationMessage(activeParticipant.type, activeParticipant.id, senderRole, senderName, draft);
    setDraft('');
  };

  const selectParticipant = (participant: ChatParticipant) => {
    setSelectedParticipant({ id: participant.id, type: participant.type });
    setIsMobileThreadOpen(true);
  };

  return (
    <div className="grid w-full gap-4 lg:h-full lg:min-h-[560px] lg:overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside
        className={cn(
          'flex min-w-0 flex-col rounded-[18px] border border-gray-200 bg-white p-4 lg:min-h-0 lg:overflow-hidden',
          mode === 'client' && 'hidden lg:block',
          !showInbox && 'hidden lg:block',
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="mt-1 text-xl font-bold text-(--color-ink)">Messages</h2>
          </div>
          <span className="rounded-full bg-(--color-accent-lime) px-2.5 py-1 text-xs font-bold text-(--color-ink)">
            {visibleParticipants.length}
          </span>
        </div>

        {mode === 'admin' && (
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-[18px] bg-(--color-surface-alt) p-1">
            {(['client', 'team'] as ChatConversationType[]).map(section => {
              const count = section === 'client' ? clientParticipants.length : teamParticipants.length;
              const active = activeSection === section;
              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => {
                    setActiveSection(section);
                    setSelectedParticipant(null);
                    setIsMobileThreadOpen(false);
                  }}
                  className={cn(
                    'flex h-10 items-center justify-center gap-2 rounded-[14px] text-sm font-bold transition-colors',
                    active ? 'bg-white text-(--color-ink) shadow-sm' : 'text-gray-400 hover:text-(--color-ink)',
                  )}
                >
                  {section === 'client' ? <UserRound size={15} /> : <UsersRound size={15} />}
                  {section === 'client' ? 'Clients' : 'Team'}
                  <span className={cn('text-xs', active ? 'text-gray-400' : 'text-gray-300')}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="chat-scrollbar space-y-2 overflow-visible pr-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {visibleParticipants.map(participant => {
            const conversation = getConversationFor(conversations, participant);
            const last = conversation?.messages.at(-1);
            const unread = getUnreadCount(conversation, senderRole);
            const active = participant.id === activeParticipant?.id && participant.type === activeParticipant.type;

            return (
              <button
                key={`${participant.type}-${participant.id}`}
                type="button"
                onClick={() => selectParticipant(participant)}
                className={cn(
                  'flex w-full min-w-0 items-start gap-3 overflow-hidden rounded-lg p-3 text-left transition-colors',
                  active ? 'bg-(--color-ink) text-white' : 'bg-gray-100 hover:bg-gray-200',
                )}
              >
                <Avatar name={participant.name} id={participant.id} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn('truncate text-sm font-bold', active ? 'text-white' : 'text-(--color-ink)')}>
                      {participant.name}
                    </p>
                    {last && (
                      <span className={cn('shrink-0 text-[10px] font-bold', active ? 'text-white/45' : 'text-gray-400')}>
                        {formatDay(last.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className={cn('mt-0.5 truncate text-xs font-semibold', active ? 'text-white/45' : 'text-gray-400')}>
                    {participant.meta}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {/* <p className={cn('min-w-0 flex-1 truncate text-xs font-medium', active ? 'text-white/60' : 'text-gray-500')}>
                      {getPreview(conversation)}
                    </p> */}
                    {unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-(--color-accent-lime) px-1.5 text-[10px] font-bold text-(--color-ink)">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section
        className={cn(
          'min-h-[640px] flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white',
          showThread ? 'flex' : 'hidden lg:flex',
        )}
      >
        {activeParticipant ? (
          <>
            <div className="border-b border-gray-100 bg-white px-4 py-4 md:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {mode === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setIsMobileThreadOpen(false)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 lg:hidden"
                      aria-label="Back to chats"
                    >
                      <ArrowLeft size={17} />
                    </button>
                  )}
                  <Avatar name={mode === 'admin' ? activeParticipant.name : ADMIN_NAME} id={activeParticipant.id} size="md" />
                  <div className="min-w-0">
                    <h2 className="truncate text-md font-bold text-(--color-ink)">
                      {mode === 'admin' ? activeParticipant.name : ADMIN_NAME}
                    </h2>
                    <p className="truncate text-xs font-semibold text-gray-400">
                      {mode === 'admin'
                        ? `${activeParticipant.meta}`
                        : 'Direct support for your project work'}
                    </p>
                  </div>
                </div>
                <div className="hidden rounded-2xl bg-(--color-surface-alt) px-3 py-2 text-xs font-bold text-gray-500 sm:flex sm:items-center sm:gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Active thread
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white px-4 py-5 md:px-6">
              {activeMessages.length === 0 ? (
                <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-[22px] border border-dashed border-gray-200 bg-white/70 p-8 text-center">
                  <MessageCircle size={34} className="text-gray-300" />
                  <p className="mt-3 text-sm font-bold text-(--color-ink)">Start the conversation</p>
                  <p className="mt-1 max-w-sm text-xs font-medium leading-5 text-gray-400">
                    Use this thread for quick approvals, project questions, files to review, and follow-ups.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeMessages.map(message => {
                    const isOwn = message.senderRole === senderRole;
                    return (
                      <div key={message.id} className={cn('flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
                        {!isOwn && (
                          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500">
                            {message.senderRole === 'admin' ? <MaterialIcon name="support_agent" size={16} /> : <UserRound size={15} />}
                          </div>
                        )}
                        <div className={cn('max-w-[78%] md:max-w-[62%]', isOwn && 'items-end')}>
                          <div
                            className={cn(
                              'rounded-[20px] px-4 py-3 text-sm font-medium leading-6 shadow-sm',
                              isOwn
                                ? 'rounded-br-md bg-(--color-ink) text-white'
                                : 'rounded-bl-md border border-gray-100 bg-white text-gray-700',
                            )}
                          >
                            {message.body}
                          </div>
                          <p className={cn('mt-1 text-[11px] font-semibold text-gray-400', isOwn ? 'text-right' : 'text-left')}>
                            {message.senderName} · {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-4 md:p-5">
              <div className="flex items-end gap-3 rounded-[22px] bg-(--color-surface-alt) p-2">
                <textarea
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  rows={1}
                  placeholder={mode === 'admin' ? `Message ${activeParticipant.name}...` : 'Message the studio...'}
                  className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-transparent bg-white px-4 py-3 text-base font-medium text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-200 focus:ring-4 focus:ring-gray-100 md:text-sm"
                />
                <Button type="submit" disabled={!draft.trim()} className="h-11 shrink-0 px-4" iconLeft={<Send size={15} />}>
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-(--color-surface-alt)">
              <MessageCircle size={30} className="text-gray-300" />
            </div>
            <p className="mt-4 text-base font-bold text-(--color-ink)">Select a conversation</p>
            <p className="mt-1 max-w-xs text-sm font-medium leading-6 text-gray-400">
              Choose a client or team member to view messages, reply, and keep communication in one place.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
