import type { FormEvent } from 'react';
import { ArrowLeft, MessageCircle, Plus, Send, UserRound } from 'lucide-react';
import Avatar from '../../common/avatar/avatar';
import Button from '../../common/button/button';
import MaterialIcon from '../../common/material-icon/material-icon';
import type { ChatMessage, ChatSenderRole } from '@/src/store/chat';
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
        'min-h-[640px] flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white',
        isVisible ? 'flex' : 'hidden lg:flex',
      )}
    >
      {participant ? (
        <>
          <div className="border-b border-gray-100 bg-white px-4 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {mode === 'admin' && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 lg:hidden"
                    aria-label="Back to chats"
                  >
                    <ArrowLeft size={17} />
                  </button>
                )}
                <Avatar name={mode === 'admin' ? participant.name : ADMIN_NAME} id={participant.id} size="md" />
                <div className="min-w-0">
                  <h2 className="truncate text-md font-bold text-(--color-ink)">
                    {mode === 'admin' ? participant.name : ADMIN_NAME}
                  </h2>
                  <p className="truncate text-xs font-semibold text-gray-400">
                    {mode === 'admin' ? participant.meta : 'Direct support for your project work'}
                  </p>
                </div>
              </div>
              <div className="hidden rounded-2xl bg-(--color-surface-alt) px-3 py-2 text-xs font-bold text-gray-500 sm:flex sm:items-center sm:gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active thread
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-(--color-surface-alt) px-4 py-5 md:px-6">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-[18px] border border-dashed border-gray-200 bg-white p-8 text-center">
                <MessageCircle size={34} className="text-gray-300" />
                <p className="mt-3 text-sm font-bold text-(--color-ink)">Start the conversation</p>
                <p className="mt-1 max-w-sm text-xs font-medium leading-5 text-gray-400">
                  Use this thread for quick approvals, project questions, files to review, and follow-ups.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => {
                  const isOwn = message.senderRole === senderRole;
                  return (
                    <div key={message.id} className={cn('flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
                      {!isOwn && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm">
                          {message.senderRole === 'admin' ? <MaterialIcon name="support_agent" size={16} /> : <UserRound size={15} />}
                        </div>
                      )}
                      <div className={cn('max-w-[78%] md:max-w-[62%]', isOwn && 'items-end')}>
                        <div
                          className={cn(
                            'rounded-[20px] px-4 py-3 text-sm font-medium leading-6 shadow-sm',
                            isOwn
                              ? 'rounded-br-md bg-(--color-ink) text-white shadow-[0_12px_30px_rgba(17,17,20,0.16)]'
                              : 'rounded-bl-md border border-gray-100 bg-white text-gray-700 shadow-[0_10px_28px_rgba(15,23,42,0.06)]',
                          )}
                        >
                          {message.body}
                        </div>
                        <p className={cn('mt-1 text-[11px] font-semibold text-gray-400', isOwn ? 'text-right' : 'text-left')}>
                          {message.senderName} · {formatChatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-gray-100 bg-white p-4 md:p-5">
            <div className="flex items-end gap-3 rounded-[18px] border border-gray-200 bg-white p-2 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
              <textarea
                value={draft}
                onChange={event => onDraftChange(event.target.value)}
                rows={1}
                placeholder={mode === 'admin' ? `Message ${participant.name}...` : 'Message the studio...'}
                className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-transparent bg-(--color-surface) px-4 py-3 text-base font-medium text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100 md:text-sm"
              />
              <Button type="submit" disabled={!draft.trim()} className="h-11 shrink-0 rounded-xl px-4" iconLeft={<Send size={15} />}>
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
