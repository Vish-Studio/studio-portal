export type ScheduleCategory = "team" | "project" | "client";

export type EventType =
  | "team-weekly"
  | "team-project-brief"
  | "team-issues"
  | "team-client-feedback"
  | "client-requirements"
  | "client-feedback"
  | "client-revisions"
  | "client-monthly"
  | "client-onboarding"
  | "client-issues"
  | "project-discovery"
  | "project-proposal"
  | "project-requirements"
  | "project-contract"
  | "project-quotation"
  | "project-invoice"
  | "project-design"
  | "project-revision"
  | "project-development"
  | "project-review"
  | "project-launch"
  // Legacy values kept so existing demo/store data does not break.
  | "revision"
  | "brief"
  | "onboarding"
  | "design-review"
  | "qa-test"
  | "launch"
  | "discovery"
  | "team-meeting"
  | "phase-call"
  | "client-meeting"
  | "admin-focus"
  | "admin-task"
  | "personal";

export interface ScheduleEvent {
  id: string;
  category?: ScheduleCategory;
  type: EventType;
  title: string;
  time: string;
  date?: Date;
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
  callLink?: string;
  description?: string;
  createdById?: string;
  createdByName?: string;
  createdByRole?: string;
  invitees?: string[];
  /** Link to a project from the projects store (optional) */
  projectId?: string;
  /** Link to a phase within the selected project (optional) */
  phaseId?: string;
  /** Link to a client from the clients store (optional) */
  clientId?: string;
  /** IDs of team members assigned to this event (optional) */
  memberIds?: string[];
}

export interface EventTypeConfig {
  label: string;
  shortLabel: string;
  icon: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
  iconBgClass: string;
}

export interface ScheduleCategoryConfig {
  label: string;
  description: string;
  icon: string;
}

const makeConfig = (
  label: string,
  shortLabel: string,
  icon: string,
  tone: "ink" | "sky" | "emerald" | "amber" | "violet" | "rose" | "orange" | "teal" | "indigo" | "blue" | "cyan" | "lime" | "gray" | "stone" | "fuchsia",
): EventTypeConfig => {
  const tones: Record<typeof tone, Omit<EventTypeConfig, "label" | "shortLabel" | "icon">> = {
    ink: { bgClass: "bg-gray-950", textClass: "text-gray-950", dotClass: "bg-gray-950", iconBgClass: "bg-gray-100" },
    sky: { bgClass: "bg-sky-50", textClass: "text-sky-600", dotClass: "bg-sky-400", iconBgClass: "bg-sky-100" },
    emerald: { bgClass: "bg-emerald-50", textClass: "text-emerald-600", dotClass: "bg-emerald-400", iconBgClass: "bg-emerald-100" },
    amber: { bgClass: "bg-amber-50", textClass: "text-amber-600", dotClass: "bg-amber-400", iconBgClass: "bg-amber-100" },
    violet: { bgClass: "bg-violet-50", textClass: "text-violet-600", dotClass: "bg-violet-400", iconBgClass: "bg-violet-100" },
    rose: { bgClass: "bg-rose-50", textClass: "text-rose-600", dotClass: "bg-rose-400", iconBgClass: "bg-rose-100" },
    orange: { bgClass: "bg-orange-50", textClass: "text-orange-600", dotClass: "bg-orange-400", iconBgClass: "bg-orange-100" },
    teal: { bgClass: "bg-teal-50", textClass: "text-teal-600", dotClass: "bg-teal-400", iconBgClass: "bg-teal-100" },
    indigo: { bgClass: "bg-indigo-50", textClass: "text-indigo-600", dotClass: "bg-indigo-400", iconBgClass: "bg-indigo-100" },
    blue: { bgClass: "bg-blue-50", textClass: "text-blue-600", dotClass: "bg-blue-400", iconBgClass: "bg-blue-100" },
    cyan: { bgClass: "bg-cyan-50", textClass: "text-cyan-700", dotClass: "bg-cyan-400", iconBgClass: "bg-cyan-100" },
    lime: { bgClass: "bg-lime-50", textClass: "text-lime-700", dotClass: "bg-lime-400", iconBgClass: "bg-lime-100" },
    gray: { bgClass: "bg-gray-100", textClass: "text-gray-700", dotClass: "bg-gray-500", iconBgClass: "bg-gray-200" },
    stone: { bgClass: "bg-stone-100", textClass: "text-stone-700", dotClass: "bg-stone-500", iconBgClass: "bg-stone-200" },
    fuchsia: { bgClass: "bg-fuchsia-50", textClass: "text-fuchsia-700", dotClass: "bg-fuchsia-400", iconBgClass: "bg-fuchsia-100" },
  };

  return { label, shortLabel, icon, ...tones[tone] };
};

export const SCHEDULE_CATEGORY_CONFIG: Record<ScheduleCategory, ScheduleCategoryConfig> = {
  team: {
    label: "Team",
    description: "Internal planning, team syncs, blockers, and feedback handoff.",
    icon: "groups",
  },
  project: {
    label: "Project",
    description: "Process milestones such as discovery, proposal, contract, design, and launch.",
    icon: "workspaces",
  },
  client: {
    label: "Client",
    description: "Client meetings, requirements, feedback, revisions, onboarding, and issues.",
    icon: "person",
  },
};

export const EVENT_TYPES_BY_CATEGORY: Record<ScheduleCategory, EventType[]> = {
  team: [
    "team-weekly",
    "team-project-brief",
    "team-issues",
    "team-client-feedback",
  ],
  project: [
    "project-discovery",
    "project-proposal",
    "project-requirements",
    "project-contract",
    "project-quotation",
    "project-invoice",
    "project-design",
    "project-revision",
    "project-development",
    "project-review",
    "project-launch",
  ],
  client: [
    "client-requirements",
    "client-feedback",
    "client-revisions",
    "client-monthly",
    "client-onboarding",
    "client-issues",
  ],
};

const LEGACY_CATEGORY_BY_TYPE: Partial<Record<EventType, ScheduleCategory>> = {
  revision: "project",
  brief: "project",
  onboarding: "client",
  "design-review": "project",
  "qa-test": "project",
  launch: "project",
  discovery: "project",
  "team-meeting": "team",
  "phase-call": "project",
  "client-meeting": "client",
  "admin-focus": "team",
  "admin-task": "team",
  personal: "team",
};

export const getEventCategory = (type: EventType): ScheduleCategory =>
  (Object.entries(EVENT_TYPES_BY_CATEGORY).find(([, types]) => types.includes(type))?.[0] as ScheduleCategory | undefined) ??
  LEGACY_CATEGORY_BY_TYPE[type] ??
  "project";

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  "team-weekly": makeConfig("Weekly Meeting", "Weekly", "groups", "indigo"),
  "team-project-brief": makeConfig("Project Brief", "Brief", "description", "sky"),
  "team-issues": makeConfig("Issues", "Issues", "warning", "rose"),
  "team-client-feedback": makeConfig("Client Feedback", "Feedback", "feedback", "blue"),
  "client-requirements": makeConfig("Requirements", "Reqs", "fact_check", "teal"),
  "client-feedback": makeConfig("Feedback", "Feedback", "feedback", "blue"),
  "client-revisions": makeConfig("Revisions", "Revision", "rate_review", "amber"),
  "client-monthly": makeConfig("Monthly Meeting", "Monthly", "event_repeat", "cyan"),
  "client-onboarding": makeConfig("Onboarding", "Onboard", "person_add", "emerald"),
  "client-issues": makeConfig("Issues", "Issues", "report_problem", "rose"),
  "project-discovery": makeConfig("Discovery", "Discovery", "explore", "teal"),
  "project-proposal": makeConfig("Proposal", "Proposal", "request_quote", "sky"),
  "project-requirements": makeConfig("Requirements", "Reqs", "fact_check", "blue"),
  "project-contract": makeConfig("Contract", "Contract", "contract", "stone"),
  "project-quotation": makeConfig("Quotation", "Quote", "receipt_long", "amber"),
  "project-invoice": makeConfig("Invoice", "Invoice", "payments", "lime"),
  "project-design": makeConfig("Design", "Design", "design_services", "violet"),
  "project-revision": makeConfig("Revision", "Revision", "rate_review", "amber"),
  "project-development": makeConfig("Development", "Dev", "code", "indigo"),
  "project-review": makeConfig("Review", "Review", "task_alt", "emerald"),
  "project-launch": makeConfig("Launch", "Launch", "rocket_launch", "orange"),

  revision: makeConfig("Revision", "Revision", "rate_review", "amber"),
  brief: makeConfig("Brief", "Brief", "description", "sky"),
  onboarding: makeConfig("Onboarding", "Onboard", "person_add", "emerald"),
  "design-review": makeConfig("Design Review", "Design", "design_services", "violet"),
  "qa-test": makeConfig("QA Test", "QA Test", "bug_report", "rose"),
  launch: makeConfig("Launch", "Launch", "rocket_launch", "orange"),
  discovery: makeConfig("Discovery", "Discovery", "explore", "teal"),
  "team-meeting": makeConfig("Team Meeting", "Team", "groups", "indigo"),
  "phase-call": makeConfig("Phase Call", "Phase", "route", "lime"),
  "client-meeting": makeConfig("Client Meeting", "Client", "video_call", "cyan"),
  "admin-focus": makeConfig("Focus Block", "Focus", "timer", "gray"),
  "admin-task": makeConfig("Admin Task", "Admin", "checklist", "stone"),
  personal: makeConfig("Personal", "Personal", "self_improvement", "fuchsia"),
};

export const ALL_EVENT_TYPES = Object.keys(EVENT_TYPE_CONFIG) as EventType[];
