import { create } from 'zustand';

export type ChatConversationType = 'client' | 'team';
export type ChatSenderRole = 'admin' | 'client' | 'team';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: ChatSenderRole;
  senderName: string;
  body: string;
  createdAt: number;
}

export interface ChatConversation {
  id: string;
  type?: ChatConversationType;
  participantId?: string;
  clientId?: string;
  teamMemberId?: string;
  lastReadByAdminAt?: number;
  lastReadByClientAt?: number;
  lastReadByTeamAt?: number;
  messages: ChatMessage[];
}

interface ChatState {
  conversations: ChatConversation[];
  setConversations: (conversations: ChatConversation[]) => void;
  sendMessage: (clientId: string, senderRole: ChatSenderRole, senderName: string, body: string) => void;
  sendConversationMessage: (
    conversationType: ChatConversationType,
    participantId: string,
    senderRole: ChatSenderRole,
    senderName: string,
    body: string,
  ) => void;
  markRead: (clientId: string, role: ChatSenderRole) => void;
  markConversationRead: (conversationType: ChatConversationType, participantId: string, role: ChatSenderRole) => void;
}

const conversationIdForClient = (clientId: string) => `chat_${clientId}`;
const conversationIdFor = (conversationType: ChatConversationType, participantId: string) =>
  conversationType === 'client' ? conversationIdForClient(participantId) : `chat_team_${participantId}`;

const matchesConversation = (
  conversation: ChatConversation,
  conversationType: ChatConversationType,
  participantId: string,
) => {
  const storedType = conversation.type ?? 'client';
  const storedParticipantId = conversation.participantId ?? conversation.clientId ?? conversation.teamMemberId;
  return storedType === conversationType && storedParticipantId === participantId;
};

const readPatchForRole = (role: ChatSenderRole, timestamp: number) => {
  if (role === 'admin') return { lastReadByAdminAt: timestamp };
  if (role === 'team') return { lastReadByTeamAt: timestamp };
  return { lastReadByClientAt: timestamp };
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],

  setConversations: (conversations) => set({ conversations }),

  sendConversationMessage: (conversationType, participantId, senderRole, senderName, body) => {
    const trimmed = body.trim();
    if (!trimmed) return;

    const now = Date.now();
    const conversationId = conversationIdFor(conversationType, participantId);
    const message: ChatMessage = {
      id: `msg_${now}`,
      conversationId,
      senderRole,
      senderName,
      body: trimmed,
      createdAt: now,
    };

    set((state) => {
      const existing = state.conversations.find(item => matchesConversation(item, conversationType, participantId));
      if (!existing) {
        return {
          conversations: [
            {
              id: conversationId,
              type: conversationType,
              participantId,
              clientId: conversationType === 'client' ? participantId : undefined,
              teamMemberId: conversationType === 'team' ? participantId : undefined,
              ...readPatchForRole(senderRole, now),
              messages: [message],
            },
            ...state.conversations,
          ],
        };
      }

      return {
        conversations: state.conversations.map(item => {
          if (!matchesConversation(item, conversationType, participantId)) return item;
          return {
            ...item,
            type: item.type ?? conversationType,
            participantId: item.participantId ?? participantId,
            ...readPatchForRole(senderRole, now),
            messages: [...item.messages, message],
          };
        }),
      };
    });
  },

  sendMessage: (clientId, senderRole, senderName, body) => {
    useChatStore.getState().sendConversationMessage('client', clientId, senderRole, senderName, body);
  },

  markConversationRead: (conversationType, participantId, role) => {
    const now = Date.now();
    set((state) => ({
      conversations: state.conversations.map(item => {
        if (!matchesConversation(item, conversationType, participantId)) return item;
        return {
          ...item,
          type: item.type ?? conversationType,
          participantId: item.participantId ?? participantId,
          ...readPatchForRole(role, now),
        };
      }),
    }));
  },

  markRead: (clientId, role) => {
    useChatStore.getState().markConversationRead('client', clientId, role);
  },
}));
