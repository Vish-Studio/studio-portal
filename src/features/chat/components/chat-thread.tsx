import type { FormEvent } from 'react';
import { ArrowLeft, MessageCircle, Plus, Send, UserRound } from 'lucide-react';
import { Avatar, MaterialIcon } from '@/src/shared/components';
import Button from '@/src/shared/components/button/button';
import type { ChatMessage, ChatSenderRole } from '../stores/chatStore';
import { cn } from '@/src/lib/utils';
import { formatChatTime, type ChatParticipant } from './chat-types';

interface ChatThreadProps {
  mode: 'admin' | 'client';
  isVisible: boolean;
  participant: ChatParticipant | null;
  messages: ChatMessage[];
  senderRole: ChatSenderRole;
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onBack: () => void;
  onStartChat: () => void;
}

const ADMIN_NAME = 'Studio Admin';

export default function ChatThread({
  mode,
  isVisible,
  participant,
  messages,
  senderRole,
  draft,
  onDraftChange,
  onSubmit,
  onBack,
  onStartChat,
}: ChatThreadProps) {
  return (
    <section
      className={cn(
        'chat-thread min-h-[calc(100svh-190px)] flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white lg:min-h-0',
        isVisible ? 'flex' : 'hidden lg:flex',
      )}
    >
      {participant ? (
        <>
          <div className="chat-thread-header border-b border-gray-100 bg-white px-4 py-4 md:px-5">
            <div className="chat-thread-header-row flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {mode === 'admin' && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-alt) text-gray-600 transition-colors hover:bg-gray-200 lg:hidden"
                    aria-label="Back to chats"
                  >
                    <ArrowLeft size={17} />
                  </button>
                )}
                <Avatar name={mode === 'admin' ? participant.name : ADMIN_NAME} id={participant.id} size="lg" />
                <div className="min-w-0">
                  <h2 className="type-card-title truncate text-(--color-ink)">
                    {mode === 'admin' ? participant.name : ADMIN_NAME}
                  </h2>
                  <p className="type-muted truncate text-gray-400">
                    {mode === 'admin' ? participant.meta : 'Direct support for your project work'}
                  </p>
                </div>
              </div>
              <div className="type-label hidden rounded-full bg-(--color-surface-alt) px-3 py-2 text-gray-500 sm:flex sm:items-center sm:gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active thread
              </div>
            </div>
          </div>

          <div className="chat-thread-body chat-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,var(--color-surface-alt)_0%,#fff_100%)] px-4 py-5 md:px-6">
            {messages.length === 0 ? (
              <div className="chat-thread-empty flex h-full min-h-80 flex-col items-center justify-center rounded-[18px] border border-dashed border-gray-200 bg-white/85 p-8 text-center">
                <MessageCircle size={34} className="text-gray-300" />
                <p className="type-card-title mt-3 text-(--color-ink)">Start the conversation</p>
                <p className="type-muted mt-1 max-w-sm text-gray-400">
                  Use this thread for quick approvals, project questions, files to review, and follow-ups.
                </p>
              </div>
            ) : (
              <div className="chat-thread-messages mx-auto flex max-w-4xl flex-col gap-4">
                {messages.map(message => {
                  const isOwn = message.senderRole === senderRole;
                  return (
                    <div key={message.id} className={cn('chat-thread-message flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
                      {!isOwn && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                          {message.senderRole === 'admin' ? <MaterialIcon name="support_agent" size={16} /> : <UserRound size={15} />}
                        </div>
                      )}
                      <div className={cn('max-w-[84%] md:max-w-[64%]', isOwn && 'items-end')}>
                        <div
                          className={cn(
                            'type-body rounded-[18px] px-4 py-3 shadow-sm',
                            isOwn
                              ? 'rounded-br-md bg-(--color-ink) text-white shadow-[0_12px_30px_rgba(17,17,20,0.14)]'
                              : 'rounded-bl-md border border-gray-100 bg-white text-gray-700 shadow-[0_10px_28px_rgba(15,23,42,0.05)]',
                          )}
                        >
                          {message.body}
                        </div>
                        <p className={cn('type-meta mt-1 text-gray-400', isOwn ? 'text-right' : 'text-left')}>
                          {message.senderName} · {formatChatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="chat-thread-composer border-t border-gray-100 bg-white p-3 md:p-4">
            <div className="chat-thread-composer-inner flex items-end gap-2 rounded-[18px] bg-(--color-surface-alt) p-2">
              <textarea
                value={draft}
                onChange={event => onDraftChange(event.target.value)}
                rows={1}
                placeholder={mode === 'admin' ? `Message ${participant.name}...` : 'Message the studio...'}
                className="type-body max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-transparent bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-200 focus:ring-4 focus:ring-gray-100"
              />
              <Button type="submit" disabled={!draft.trim()} className="h-11 shrink-0 rounded-xl px-4" iconLeft={<Send size={15} />}>
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="chat-thread-placeholder flex flex-1 flex-col items-center justify-center bg-[linear-gradient(180deg,#fff_0%,var(--color-surface-alt)_100%)] p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
            <MessageCircle size={30} className="text-gray-300" />
          </div>
          <p className="type-section-title mt-4 text-(--color-ink)">Select a conversation</p>
          <p className="type-body mt-1 max-w-xs text-gray-400">
            Choose a team, client, or project chat to view messages, reply, and keep communication in one place.
          </p>
          {mode === 'admin' && (
            <Button className="mt-5" iconLeft={<Plus size={15} />} onClick={onStartChat}>
              Start new chat
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
