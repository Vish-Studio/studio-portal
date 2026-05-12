import Avatar from '../../common/avatar/avatar';
import Modal from '../../common/modal/modal';
import Tabs from '../../common/tabs/tabs';
import type { ChatConversation, ChatConversationType } from '@/src/store/chat';
import { getConversationFor, type ChatParticipant } from './chat-types';

interface NewChatModalProps {
  section: ChatConversationType;
  participants: ChatParticipant[];
  conversations: ChatConversation[];
  onSectionChange: (section: ChatConversationType) => void;
  onSelectParticipant: (participant: ChatParticipant) => void;
  onClose: () => void;
}

export default function NewChatModal({
  section,
  participants,
  conversations,
  onSectionChange,
  onSelectParticipant,
  onClose,
}: NewChatModalProps) {
  return (
    <Modal
      title="Start new chat"
      description="Choose a client or team member to open a conversation."
      size="md"
      onClose={onClose}
      bodyClassName="p-4"
    >
      <Tabs
        items={[
          { key: 'client', label: 'Clients' },
          { key: 'team', label: 'Team' },
        ]}
        value={section}
        onChange={(value) => onSectionChange(value as ChatConversationType)}
        mobileMode="scroll"
        className="mb-4"
        listClassName="w-full"
        equalWidth
        ariaLabel="New chat sections"
      />

      <div className="chat-scrollbar max-h-[55vh] space-y-2 overflow-y-auto pr-1">
        {participants.map(participant => {
          const conversation = getConversationFor(conversations, participant);
          const hasMessages = Boolean(conversation?.messages.length);

          return (
            <button
              key={`new-${participant.type}-${participant.id}`}
              type="button"
              onClick={() => onSelectParticipant(participant)}
              className="flex w-full min-w-0 items-center gap-3 rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
            >
              <Avatar name={participant.name} id={participant.id} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-(--color-ink)">{participant.name}</p>
                <p className="mt-0.5 truncate text-xs font-semibold text-gray-400">{participant.meta}</p>
              </div>
              <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-gray-400">
                {hasMessages ? 'Open' : 'New'}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
