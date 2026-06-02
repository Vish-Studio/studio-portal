import { Avatar } from '@/src/shared/components';
import ButtonIcon from '@/src/shared/components/button-icon/button-icon';
import Tabs from '@/src/shared/components/tabs/tabs';
import type { ChatConversation, ChatConversationType, ChatSenderRole } from '../stores/chatStore';
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
  projectCount: number;
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
  projectCount,
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
        'chat-box relative flex min-w-0 flex-col overflow-hidden rounded-[18px] md:border md:border-gray-200 md:bg-white lg:min-h-0',
        mode === 'client' && 'hidden lg:block',
        !isVisible && 'hidden lg:block',
      )}
    >
      <div className="chat-box-header hidden md:block border-b border-gray-100 p-4">
        <div className="chat-box-header-row flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="type-section-title text-(--color-ink)">Messages</h2>
            <p className="type-muted mt-0.5 text-gray-400">
              Team, client, and project conversations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="type-count rounded-full bg-(--color-accent-lime) px-2.5 py-1 text-(--color-ink)">
              {participants.length}
            </span>
            {mode === 'admin' && (
              <ButtonIcon
                iconName="add"
                label="Start new chat"
                className="h-10 w-10 rounded-full bg-(--color-ink)! text-white hover:bg-black hover:text-white"
                clickHandler={onStartChat}
              />
            )}
          </div>
        </div>
      </div>

      <div className="chat-box-tabs sticky top-0 z-20 bg-white py-4 md:static md:p-4">
        {mode === 'admin' && (
          <Tabs
            items={[
              { key: 'team', label: 'Team', count: teamCount },
              { key: 'client', label: 'Client', count: clientCount },
              { key: 'project', label: 'Projects', count: projectCount },
            ]}
            value={activeSection}
            onChange={(section) => onSectionChange(section as ChatConversationType)}
            mobileMode="scroll"
            className="mb-3"
            listClassName="w-full"
            equalWidth
            ariaLabel="Chat sections"
          />
        )}
      </div>

      <div className="chat-box-list chat-scrollbar overflow-visible md:px-4 pb-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {participants.length === 0 && (
          <div className="chat-box-empty rounded-2xl border border-dashed border-gray-200 bg-(--color-surface-alt) p-6 text-center">
            <p className="type-card-title text-(--color-ink)">No conversations found</p>
            <p className="type-muted mt-1 text-gray-400">
              Try another search or start a new chat.
            </p>
          </div>
        )}

        <div className="chat-box-items divide-y divide-gray-100">
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
                  'chat-box-item group my-1 flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition-all',
                  active
                    ? 'bg-(--color-ink) text-white'
                    : 'bg-white hover:bg-(--color-surface-alt)',
                )}
              >
                <div className="relative shrink-0">
                  <Avatar name={participant.name} id={participant.id} color={participant.avatarColor} size="lg" />
                  {unread > 0 && (
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-(--color-accent-lime)" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn('type-card-title truncate', active ? 'text-white' : 'text-(--color-ink)')}>
                      {participant.name}
                    </p>
                    {last && (
                      <span className={cn('type-meta shrink-0', active ? 'text-white/50' : 'text-gray-400')}>
                        {formatChatDay(last.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className={cn('type-muted mt-0.5 truncate', active ? 'text-white/55' : 'text-gray-400')}>
                    {participant.meta}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <p className={cn('type-muted min-w-0 flex-1 truncate', active ? 'text-white/70' : 'text-gray-500')}>
                      {getChatPreview(conversation)}
                    </p>
                    {unread > 0 && (
                      <span className="type-count flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-(--color-accent-lime) px-1.5 text-(--color-ink)">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
