import type { ChatConversation, ChatConversationType, ChatSenderRole } from '@/src/store/chat';

export interface ChatParticipant {
  id: string;
  type: ChatConversationType;
  name: string;
  meta: string;
  email?: string;
}

export const formatChatTime = (timestamp: number) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(timestamp);

export const formatChatDay = (timestamp: number) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(timestamp);

export const getChatPreview = (conversation?: ChatConversation) => {
  const last = conversation?.messages.at(-1);
  return last?.body ?? 'No messages yet.';
};

export const getConversationParticipantId = (conversation: ChatConversation) =>
  conversation.participantId ?? conversation.clientId ?? conversation.teamMemberId;

export const getConversationType = (conversation: ChatConversation): ChatConversationType =>
  conversation.type ?? 'client';

export const getConversationFor = (
  conversations: ChatConversation[],
  participant: Pick<ChatParticipant, 'id' | 'type'> | null,
) => conversations.find(
  conversation =>
    participant &&
    getConversationType(conversation) === participant.type &&
    getConversationParticipantId(conversation) === participant.id,
);

export const getUnreadCount = (conversation: ChatConversation | undefined, role: ChatSenderRole) => {
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
