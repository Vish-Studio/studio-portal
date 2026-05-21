import { create } from 'zustand';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { requireFirebase } from '@/src/firebase/requireFirebase';
import { messageDocToChatMessage } from '@/src/firebase/firestoreTransformers';

export type ChatConversationType = 'client' | 'team' | 'project';
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
  projectId?: string;
  lastReadByAdminAt?: number;
  lastReadByClientAt?: number;
  lastReadByTeamAt?: number;
  messages: ChatMessage[];
}

interface ChatState {
  conversations: ChatConversation[];
  loading: { chat: boolean };
  error: { chat: string | null };
  setConversations: (conversations: ChatConversation[]) => void;
  subscribeToChat: (projectId: string) => Unsubscribe;
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
  conversationType === 'client'
    ? conversationIdForClient(participantId)
    : conversationType === 'team'
      ? `chat_team_${participantId}`
      : `chat_project_${participantId}`;

const matchesConversation = (
  conversation: ChatConversation,
  conversationType: ChatConversationType,
  participantId: string,
) => {
  const storedType = conversation.type ?? 'client';
  const storedParticipantId =
    conversation.participantId ?? conversation.clientId ?? conversation.teamMemberId ?? conversation.projectId;
  return storedType === conversationType && storedParticipantId === participantId;
};

const readPatchForRole = (role: ChatSenderRole, timestamp: number) => {
  if (role === 'admin') return { lastReadByAdminAt: timestamp };
  if (role === 'team') return { lastReadByTeamAt: timestamp };
  return { lastReadByClientAt: timestamp };
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  loading: { chat: false },
  error: { chat: null },

  setConversations: (conversations) => set({ conversations }),

  subscribeToChat: (projectId) => {
    set({ loading: { chat: true }, error: { chat: null } });
    return onSnapshot(
      query(collection(requireFirebase().db, 'projects', projectId, 'messages'), orderBy('createdAt', 'asc')),
      snapshot => set(state => {
        const conversation: ChatConversation = {
          id: conversationIdFor('project', projectId),
          type: 'project',
          participantId: projectId,
          projectId,
          messages: snapshot.docs.map(doc => messageDocToChatMessage(projectId, doc)),
        };
        return {
          conversations: [
            conversation,
            ...state.conversations.filter(item => !matchesConversation(item, 'project', projectId)),
          ],
          loading: { chat: false },
          error: { chat: null },
        };
      }),
      error => set({ loading: { chat: false }, error: { chat: error.message } }),
    );
  },

  sendConversationMessage: (conversationType, participantId, senderRole, senderName, body) => {
    const trimmed = body.trim();
    if (!trimmed) return;

    if (conversationType === 'project') {
      void addDoc(collection(requireFirebase().db, 'projects', participantId, 'messages'), {
        senderId: '',
        senderName,
        senderRole,
        text: trimmed,
        createdAt: serverTimestamp(),
      });
      return;
    }

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
              projectId: undefined,
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
