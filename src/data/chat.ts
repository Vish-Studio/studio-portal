import type { ChatConversation } from '../store/chat';

const minutesAgo = (minutes: number) => Date.now() - minutes * 60_000;

export const DEMO_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'chat_c1',
    type: 'client',
    participantId: 'c1',
    clientId: 'c1',
    lastReadByAdminAt: minutesAgo(25),
    lastReadByClientAt: minutesAgo(8),
    messages: [
      {
        id: 'msg_c1_1',
        conversationId: 'chat_c1',
        senderRole: 'admin',
        senderName: 'Studio Admin',
        body: 'Hi Sarah, I added the latest brand direction to the project documents.',
        createdAt: minutesAgo(90),
      },
      {
        id: 'msg_c1_2',
        conversationId: 'chat_c1',
        senderRole: 'client',
        senderName: 'Sarah Mitchell',
        body: 'Thanks. I reviewed it and left notes on the typography section.',
        createdAt: minutesAgo(38),
      },
      {
        id: 'msg_c1_3',
        conversationId: 'chat_c1',
        senderRole: 'admin',
        senderName: 'Studio Admin',
        body: 'Perfect. I will fold those notes into the next revision before the review call.',
        createdAt: minutesAgo(12),
      },
    ],
  },
  {
    id: 'chat_c2',
    type: 'client',
    participantId: 'c2',
    clientId: 'c2',
    lastReadByAdminAt: minutesAgo(180),
    lastReadByClientAt: minutesAgo(320),
    messages: [
      {
        id: 'msg_c2_1',
        conversationId: 'chat_c2',
        senderRole: 'client',
        senderName: 'James Lee',
        body: 'Can we move the product page review to Friday morning?',
        createdAt: minutesAgo(210),
      },
    ],
  },
  {
    id: 'chat_c5',
    type: 'client',
    participantId: 'c5',
    clientId: 'c5',
    lastReadByAdminAt: minutesAgo(420),
    lastReadByClientAt: minutesAgo(420),
    messages: [
      {
        id: 'msg_c5_1',
        conversationId: 'chat_c5',
        senderRole: 'admin',
        senderName: 'Studio Admin',
        body: 'We have started the dashboard planning pass. I will share the first flow once the scope is locked.',
        createdAt: minutesAgo(480),
      },
    ],
  },
  ...Array.from({ length: 15 }, (_, index): ChatConversation => {
    const clientNumber = index + 6;
    const conversationId = `chat_c${clientNumber}`;
    const clientNames = [
      'Marcus Webb',
      'Nora Kim',
      'Owen Brooks',
      'Maya Chen',
      'Leo Martin',
      'Ava Stone',
      'Rafael Costa',
      'Ivy Morgan',
      'Ethan Price',
      'Sofia Rossi',
      'Daniel Park',
      'Grace Miller',
      'Amir Haddad',
      'Hannah Reed',
      'Noah Singh',
    ];
    const prompts = [
      'Can you confirm the next review date?',
      'I uploaded a new brief with a few comments.',
      'The team approved the first design direction.',
      'Can we add the launch checklist to the project?',
      'Please send the invoice when ready.',
      'I have a question about the onboarding steps.',
      'The contract details look good from our side.',
      'Can we discuss the revision request this week?',
      'The staging link is working for our team.',
      'Please check the latest assets in the folder.',
      'Can we pause this until next Monday?',
      'The proposal is approved.',
      'We need to invite one more stakeholder.',
      'The monthly report looks good.',
      'Can you share a timeline update?',
    ];

    return {
      id: conversationId,
      type: 'client',
      participantId: `c${clientNumber}`,
      clientId: `c${clientNumber}`,
      lastReadByAdminAt: index % 3 === 0 ? minutesAgo(900) : minutesAgo(30 + index * 12),
      lastReadByClientAt: minutesAgo(45 + index * 15),
      messages: [
        {
          id: `msg_c${clientNumber}_1`,
          conversationId,
          senderRole: index % 2 === 0 ? 'client' : 'admin',
          senderName: index % 2 === 0 ? clientNames[index] : 'Studio Admin',
          body: prompts[index],
          createdAt: minutesAgo(720 - index * 22),
        },
        {
          id: `msg_c${clientNumber}_2`,
          conversationId,
          senderRole: index % 2 === 0 ? 'admin' : 'client',
          senderName: index % 2 === 0 ? 'Studio Admin' : clientNames[index],
          body: index % 2 === 0
            ? 'Thanks, I will check this and update the project notes.'
            : 'Thanks, I will review and get back to you.',
          createdAt: minutesAgo(660 - index * 22),
        },
      ],
    };
  }),
  ...[
    {
      memberId: 'm1',
      name: 'Aisha Patel',
      body: 'Can you review the client feedback before the afternoon standup?',
      minutes: 54,
    },
    {
      memberId: 'm2',
      name: 'Jordan Clarke',
      body: 'I pushed the proposal notes and need your input on scope.',
      minutes: 96,
    },
    {
      memberId: 'm3',
      name: 'Mei Lin',
      body: 'The design QA pass is ready for review.',
      minutes: 180,
    },
    {
      memberId: 'm4',
      name: 'Samuel Osei',
      body: 'I found two issues in staging and added them to tasks.',
      minutes: 320,
    },
  ].map(({ memberId, name, body, minutes }): ChatConversation => {
    const conversationId = `chat_team_${memberId}`;
    return {
      id: conversationId,
      type: 'team',
      participantId: memberId,
      teamMemberId: memberId,
      lastReadByAdminAt: minutesAgo(minutes + 45),
      lastReadByTeamAt: minutesAgo(minutes + 10),
      messages: [
        {
          id: `msg_${memberId}_1`,
          conversationId,
          senderRole: 'team',
          senderName: name,
          body,
          createdAt: minutesAgo(minutes),
        },
      ],
    };
  }),
  ...[
    {
      projectId: 'p1',
      name: 'Social Media Kit',
      body: 'Project thread opened for phase notes, reviews, and launch coordination.',
      minutes: 140,
    },
    {
      projectId: 'p2',
      name: 'Logo & Brand Kit',
      body: 'Use this thread for proposal feedback and asset handoff questions.',
      minutes: 260,
    },
    {
      projectId: 'p3',
      name: 'Dashboard Analytics',
      body: 'Development planning notes can stay in this project thread.',
      minutes: 520,
    },
  ].map(({ projectId, name, body, minutes }): ChatConversation => {
    const conversationId = `chat_project_${projectId}`;
    return {
      id: conversationId,
      type: 'project',
      participantId: projectId,
      projectId,
      lastReadByAdminAt: minutesAgo(minutes + 40),
      messages: [
        {
          id: `msg_${projectId}_1`,
          conversationId,
          senderRole: 'admin',
          senderName: 'Studio Admin',
          body,
          createdAt: minutesAgo(minutes),
        },
      ],
    };
  }),
];
