import Avatar from '../../common/avatar/avatar';
import ButtonIcon from '../../common/button-icon/button-icon';
import Tabs from '../../common/tabs/tabs';
import type { ChatConversation, ChatConversationType, ChatSenderRole } from '@/src/store/chat';
import { cn } from '@/src/lib/utils';
import {
  formatChatDay,
  getChatPreview,
  getConversationFor,
  getUnreadCount,
  type ChatParticipant,
} from './chat-types';

interface ChatBoxProps {
  mode: 'admin' | 'client';
  isVisible: boolean;
  activeSection: ChatConversationType;
  clientCount: number;
  teamCount: number;
  participants: ChatParticipant[];
  activeParticipant: ChatParticipant | null;
  conversations: ChatConversation[];
  senderRole: ChatSenderRole;
  onSectionChange: (section: ChatConversationType) => void;
  onSelectParticipant: (participant: ChatParticipant) => void;
  onStartChat: () => void;
}

export default function ChatBox({
  mode,
  isVisible,
  activeSection,
  clientCount,
  teamCount,
  participants,
  activeParticipant,
  conversations,
  senderRole,
  onSectionChange,
  onSelectParticipant,
  onStartChat,
}: ChatBoxProps) {
  return (
    <section
      aria-label="Chat conversations"
      className={cn(
        'flex min-w-0 flex-col rounded-[18px] border border-gray-200 bg-white p-4 lg:min-h-0 lg:overflow-hidden',
        mode === 'client' && 'hidden lg:block',
        !isVisible && 'hidden lg:block',
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="mt-1 text-xl font-bold text-(--color-ink)">Messages</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-(--color-accent-lime) px-2.5 py-1 text-xs font-bold text-(--color-ink)">
            {participants.length}
          </span>
          {mode === 'admin' && (
            <ButtonIcon
              iconName="add"
              label="Start new chat"
              className="h-9 w-9 rounded-lg"
              clickHandler={onStartChat}
            />
          )}
        </div>
      </div>

      {mode === 'admin' && (
        <Tabs
          items={[
            { key: 'client', label: 'Clients', count: clientCount },
            { key: 'team', label: 'Team', count: teamCount },
          ]}
          value={activeSection}
          onChange={(section) => onSectionChange(section as ChatConversationType)}
          mobileMode="scroll"
          className="mb-4"
          listClassName="w-full"
          equalWidth
          ariaLabel="Chat sections"
        />
      )}

      <div className="chat-scrollbar overflow-visible rounded-xl pr-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {participants.map(participant => {
          const conversation = getConversationFor(conversations, participant);
          const last = conversation?.messages.at(-1);
          const unread = getUnreadCount(conversation, senderRole);
          const active = participant.id === activeParticipant?.id && participant.type === activeParticipant.type;

          return (
            <button
              key={`${participant.type}-${participant.id}`}
              type="button"
              onClick={() => onSelectParticipant(participant)}
              className={cn(
                'flex w-full min-w-0 items-start gap-3 overflow-hidden border-b border-gray-100 p-3 text-left transition-colors last:border-b-0',
                active
                  ? 'my-1 rounded-lg border-b-transparent bg-(--color-ink) text-white'
                  : 'bg-white hover:bg-gray-50',
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
                      {formatChatDay(last.createdAt)}
                    </span>
                  )}
                </div>
                <p className={cn('mt-0.5 truncate text-xs font-semibold', active ? 'text-white/45' : 'text-gray-400')}>
                  {participant.meta}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <p className={cn('min-w-0 flex-1 truncate text-xs font-medium', active ? 'text-white/60' : 'text-gray-500')}>
                    {getChatPreview(conversation)}
                  </p>
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
    </section>
  );
}
