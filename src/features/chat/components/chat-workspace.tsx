import { useEffect, useMemo, useState } from 'react';
import Fab from '@/src/components/common/button-fab/button-fab';
import {
  useChatStore,
  type ChatConversationType,
  type ChatSenderRole,
} from '../stores/chatStore';
import { useClientsStore } from '@/src/features/clients';
import { useTeamStore } from '@/src/features/team';
import { useUIStore } from '@/src/store/ui';
import { useProjectsStore } from '@/src/features/projects';
import { useAuthStore } from '@/src/store/auth';
import { withoutCurrentTeamMember } from '@/src/lib/team-member-visibility';
import { getProjectAccent } from '@/src/features/projects';
import ChatBox from './chat-box';
import ChatThread from './chat-thread';
import NewChatSidebar from './new-chat-sidebar';
import { getConversationFor, type ChatParticipant } from './chat-types';

interface ChatWorkspaceProps {
  mode: 'admin' | 'client';
  currentClientId?: string;
}

const ADMIN_NAME = 'Studio Admin';

export default function ChatWorkspace({ mode, currentClientId = '' }: ChatWorkspaceProps) {
  const clients = useClientsStore(state => state.clients);
  const subscribeClients = useClientsStore(state => state.subscribeClients);
  const teamMembers = useTeamStore(state => state.members);
  const subscribeMembers = useTeamStore(state => state.subscribeMembers);
  const profile = useAuthStore(state => state.profile);
  const projects = useProjectsStore(state => state.projects);
  const conversations = useChatStore(state => state.conversations);
  const sendConversationMessage = useChatStore(state => state.sendConversationMessage);
  const markConversationRead = useChatStore(state => state.markConversationRead);
  const searchQuery = useUIStore(state => state.searchQuery);
  const [draft, setDraft] = useState('');
  const [activeSection, setActiveSection] = useState<ChatConversationType>('team');
  const [newChatSection, setNewChatSection] = useState<ChatConversationType>('team');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatQuery, setNewChatQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Pick<ChatParticipant, 'id' | 'type'> | null>(
    mode === 'client' && currentClientId ? { id: currentClientId, type: 'client' } : null,
  );
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(mode === 'client');
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const unsubscribeClients = subscribeClients();
    const unsubscribeMembers = subscribeMembers();

    return () => {
      unsubscribeClients();
      unsubscribeMembers();
    };
  }, [subscribeClients, subscribeMembers]);

  const clientParticipants = useMemo<ChatParticipant[]>(
    () => clients.map(client => ({
      id: client.id,
      type: 'client',
      name: client.fullName,
      meta: client.companyName || client.email,
      email: client.email,
    })),
    [clients],
  );

  const teamParticipants = useMemo<ChatParticipant[]>(
    () => withoutCurrentTeamMember(teamMembers, profile).map(member => ({
      id: member.id,
      type: 'team',
      name: member.name,
      meta: member.role,
      email: member.email,
    })),
    [profile, teamMembers],
  );

  const projectParticipants = useMemo<ChatParticipant[]>(
    () => projects.map(project => {
      const client = clients.find(item => item.id === project.clientId);
      const accent = getProjectAccent(project.service, project.package);

      return {
        id: project.id,
        type: 'project',
        name: project.name,
        meta: `${accent.label}${client ? ` · ${client.fullName}` : ''}`,
      };
    }),
    [clients, projects],
  );

  const visibleParticipants = useMemo(() => {
    const source = mode === 'admin'
      ? activeSection === 'client'
        ? clientParticipants
        : activeSection === 'team'
          ? teamParticipants
          : projectParticipants
      : clientParticipants.filter(client => client.id === currentClientId);

    if (!searchQuery.trim()) return source;
    const query = searchQuery.toLowerCase();
    return source.filter(participant =>
      participant.name.toLowerCase().includes(query) ||
      participant.meta.toLowerCase().includes(query) ||
      (participant.email ?? '').toLowerCase().includes(query),
    );
  }, [activeSection, clientParticipants, currentClientId, mode, projectParticipants, searchQuery, teamParticipants]);

  const newChatParticipants = useMemo(() => {
    const source = newChatSection === 'client'
      ? clientParticipants
      : newChatSection === 'team'
        ? teamParticipants
        : projectParticipants;

    if (!newChatQuery.trim()) return source;
    const query = newChatQuery.toLowerCase();
    return source.filter(participant =>
      participant.name.toLowerCase().includes(query) ||
      participant.meta.toLowerCase().includes(query) ||
      (participant.email ?? '').toLowerCase().includes(query),
    );
  }, [clientParticipants, newChatQuery, newChatSection, projectParticipants, teamParticipants]);

  useEffect(() => {
    if (mode === 'client') {
      setSelectedParticipant(currentClientId ? { id: currentClientId, type: 'client' } : null);
      setIsMobileThreadOpen(!!currentClientId);
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
    const source = selectedParticipant.type === 'client'
      ? clientParticipants
      : selectedParticipant.type === 'team'
        ? teamParticipants
        : projectParticipants;
    return source.find(participant => participant.id === selectedParticipant.id) ?? null;
  }, [clientParticipants, projectParticipants, selectedParticipant, teamParticipants]);

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
    setNewChatQuery('');
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
    <div className="chat-workspace grid w-full gap-4 lg:h-full lg:min-h-[560px] lg:overflow-hidden lg:grid-cols-[380px_minmax(0,1fr)]">
      <ChatBox
        mode={mode}
        isVisible={showInbox}
        activeSection={activeSection}
        clientCount={clientParticipants.length}
        teamCount={teamParticipants.length}
        projectCount={projectParticipants.length}
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
        <NewChatSidebar
          section={newChatSection}
          search={newChatQuery}
          participants={newChatParticipants}
          conversations={conversations}
          onSectionChange={setNewChatSection}
          onSearchChange={setNewChatQuery}
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
