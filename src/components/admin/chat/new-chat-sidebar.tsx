import Avatar from '../../common/avatar/avatar';
import FormSidebar from '../../common/form-sidebar/form-sidebar';
import SearchBar from '../../common/search-bar/search-bar';
import Tabs from '../../common/tabs/tabs';
import MaterialIcon from '../../common/material-icon/material-icon';
import type { ChatConversation, ChatConversationType } from '@/src/store/chat';
import { getConversationFor, type ChatParticipant } from './chat-types';

interface NewChatSidebarProps {
  section: ChatConversationType;
  search: string;
  participants: ChatParticipant[];
  conversations: ChatConversation[];
  onSectionChange: (section: ChatConversationType) => void;
  onSearchChange: (value: string) => void;
  onSelectParticipant: (participant: ChatParticipant) => void;
  onClose: () => void;
}

const sectionDescription: Record<ChatConversationType, string> = {
  team: 'Start an internal team thread.',
  client: 'Message a client directly.',
  project: 'Keep project decisions and updates together.',
};

export default function NewChatSidebar({
  section,
  search,
  participants,
  conversations,
  onSectionChange,
  onSearchChange,
  onSelectParticipant,
  onClose,
}: NewChatSidebarProps) {
  return (
    <FormSidebar
      isOpen
      onClose={onClose}
      title="Start new chat"
      description={sectionDescription[section]}
      width="md"
    >
      <div className="new-chat-sidebar flex min-h-0 flex-1 flex-col">
        <div className="new-chat-sidebar-header border-b border-gray-100 px-5 py-4">
          <Tabs
            items={[
              { key: 'team', label: 'Team chat' },
              { key: 'client', label: 'Client chat' },
              { key: 'project', label: 'Project chat' },
            ]}
            value={section}
            onChange={(value) => {
              onSectionChange(value as ChatConversationType);
              onSearchChange('');
            }}
            mobileMode="scroll"
            listClassName="w-full"
            equalWidth
            ariaLabel="New chat categories"
          />

          <SearchBar
            className="mt-4 w-full!"
            placeholder={`Search ${section} chats...`}
            value={search}
            onChange={onSearchChange}
            autoFocus
          />
        </div>

        <div className="new-chat-sidebar-list chat-scrollbar flex-1 overflow-y-auto px-5 py-4">
          {participants.length === 0 ? (
            <div className="new-chat-sidebar-empty rounded-[18px] border border-dashed border-gray-200 bg-(--color-surface-alt) p-6 text-center">
              <MaterialIcon name="search_off" size={26} className="mx-auto text-gray-300" />
              <p className="type-card-title mt-2 text-(--color-ink)">No matches found</p>
              <p className="type-muted mt-1 text-gray-400">Try another name, company, role, or project.</p>
            </div>
          ) : (
            <div className="new-chat-sidebar-items divide-y divide-gray-100">
              {participants.map(participant => {
                const conversation = getConversationFor(conversations, participant);
                const hasMessages = Boolean(conversation?.messages.length);

                return (
                  <button
                    key={`new-${participant.type}-${participant.id}`}
                    type="button"
                    onClick={() => onSelectParticipant(participant)}
                    className="new-chat-sidebar-item flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-(--color-surface-alt)"
                  >
                    <Avatar name={participant.name} id={participant.id} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="type-card-title truncate text-(--color-ink)">{participant.name}</p>
                      <p className="type-muted mt-0.5 truncate text-gray-400">{participant.meta}</p>
                    </div>
                    <span className="type-count shrink-0 rounded-md bg-(--color-surface-alt) px-2 py-1 text-gray-500">
                      {hasMessages ? 'Open' : 'New'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </FormSidebar>
  );
}
