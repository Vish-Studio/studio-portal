import { useEffect, useMemo, useState } from 'react';
import Fab from '../../common/button-fab/button-fab';
import {
  useChatStore,
  type ChatConversationType,
  type ChatSenderRole,
} from '@/src/store/chat';
import { useClientsStore } from '@/src/store/clients';
import { useTeamStore } from '@/src/store/team';
import { useUIStore } from '@/src/store/ui';
import ChatBox from './chat-box';
import ChatThread from './chat-thread';
import NewChatModal from './new-chat-modal';
import { getConversationFor, type ChatParticipant } from './chat-types';

interface ChatWorkspaceProps {
  mode: 'admin' | 'client';
  currentClientId?: string;
}

const ADMIN_NAME = 'Studio Admin';

export default function ChatWorkspace({ mode, currentClientId = 'c1' }: ChatWorkspaceProps) {
  const clients = useClientsStore(state => state.clients);
  const teamMembers = useTeamStore(state => state.members);
  const conversations = useChatStore(state => state.conversations);
  const sendConversationMessage = useChatStore(state => state.sendConversationMessage);
  const markConversationRead = useChatStore(state => state.markConversationRead);
  const searchQuery = useUIStore(state => state.searchQuery);
  const [draft, setDraft] = useState('');
  const [activeSection, setActiveSection] = useState<ChatConversationType>('client');
  const [newChatSection, setNewChatSection] = useState<ChatConversationType>('client');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
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

  const newChatParticipants = newChatSection === 'client' ? clientParticipants : teamParticipants;

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
  const senderRole: ChatSenderRole = mode === 'admin' ? 'admin' : 'client';
  const senderName = mode === 'admin' ? ADMIN_NAME : activeParticipant?.name ?? 'Client';
  const showInbox = mode === 'admin' && (!isCompact || !isMobileThreadOpen);
  const showThread = mode === 'client' || !isCompact || isMobileThreadOpen;

  useEffect(() => {
    if (activeParticipant && showThread) {
      markConversationRead(activeParticipant.type, activeParticipant.id, senderRole);
    }
  }, [activeParticipant?.id, activeParticipant?.type, markConversationRead, senderRole, showThread]);

  const openNewChat = () => {
    setNewChatSection(activeSection);
    setIsNewChatOpen(true);
  };

  const handleSectionChange = (section: ChatConversationType) => {
    setActiveSection(section);
    setSelectedParticipant(null);
    setIsMobileThreadOpen(false);
  };

  const selectParticipant = (participant: ChatParticipant) => {
    setActiveSection(participant.type);
    setSelectedParticipant({ id: participant.id, type: participant.type });
    setIsMobileThreadOpen(true);
    setIsNewChatOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeParticipant || !draft.trim()) return;
    sendConversationMessage(activeParticipant.type, activeParticipant.id, senderRole, senderName, draft);
    setDraft('');
  };

  return (
    <div className="grid w-full gap-4 lg:h-full lg:min-h-[560px] lg:overflow-hidden lg:grid-cols-[380px_minmax(0,1fr)]">
      <ChatBox
        mode={mode}
        isVisible={showInbox}
        activeSection={activeSection}
        clientCount={clientParticipants.length}
        teamCount={teamParticipants.length}
        participants={visibleParticipants}
        activeParticipant={activeParticipant}
        conversations={conversations}
        senderRole={senderRole}
        onSectionChange={handleSectionChange}
        onSelectParticipant={selectParticipant}
        onStartChat={openNewChat}
      />

      <ChatThread
        mode={mode}
        isVisible={showThread}
        participant={activeParticipant}
        messages={activeConversation?.messages ?? []}
        senderRole={senderRole}
        draft={draft}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
        onBack={() => setIsMobileThreadOpen(false)}
        onStartChat={openNewChat}
      />

      {isNewChatOpen && mode === 'admin' && (
        <NewChatModal
          section={newChatSection}
          participants={newChatParticipants}
          conversations={conversations}
          onSectionChange={setNewChatSection}
          onSelectParticipant={selectParticipant}
          onClose={() => setIsNewChatOpen(false)}
        />
      )}

      {mode === 'admin' && showInbox && (
        <Fab ariaLabel="Start new chat" onClick={openNewChat} />
      )}
    </div>
  );
}
