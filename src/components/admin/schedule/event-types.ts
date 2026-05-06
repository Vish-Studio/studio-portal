export type EventType =
  | "revision"
  | "brief"
  | "onboarding"
  | "design-review"
  | "qa-test"
  | "launch"
  | "client-feedback"
  | "discovery"
  | "phase-call"
  | "client-meeting"
  | "admin-focus"
  | "admin-task"
  | "personal";

export interface ScheduleEvent {
  id: string;
  type: EventType;
  title: string;
  time: string;
  callLink?: string;
  description?: string;
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

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  revision: {
    label: "Revision",
    shortLabel: "Revision",
    icon: "rate_review",
    bgClass: "bg-amber-50",
    textClass: "text-amber-600",
    dotClass: "bg-amber-400",
    iconBgClass: "bg-amber-100",
  },
  brief: {
    label: "Brief",
    shortLabel: "Brief",
    icon: "description",
    bgClass: "bg-sky-50",
    textClass: "text-sky-600",
    dotClass: "bg-sky-400",
    iconBgClass: "bg-sky-100",
  },
  onboarding: {
    label: "Onboarding",
    shortLabel: "Onboard",
    icon: "person_add",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-600",
    dotClass: "bg-emerald-400",
    iconBgClass: "bg-emerald-100",
  },
  "design-review": {
    label: "Design Review",
    shortLabel: "Design",
    icon: "design_services",
    bgClass: "bg-violet-50",
    textClass: "text-violet-600",
    dotClass: "bg-violet-400",
    iconBgClass: "bg-violet-100",
  },
  "qa-test": {
    label: "QA Test",
    shortLabel: "QA Test",
    icon: "bug_report",
    bgClass: "bg-rose-50",
    textClass: "text-rose-600",
    dotClass: "bg-rose-400",
    iconBgClass: "bg-rose-100",
  },
  launch: {
    label: "Launch",
    shortLabel: "Launch",
    icon: "rocket_launch",
    bgClass: "bg-orange-50",
    textClass: "text-orange-600",
    dotClass: "bg-orange-400",
    iconBgClass: "bg-orange-100",
  },
  "client-feedback": {
    label: "Client Feedback",
    shortLabel: "Feedback",
    icon: "feedback",
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
    dotClass: "bg-blue-400",
    iconBgClass: "bg-blue-100",
  },
  discovery: {
    label: "Discovery",
    shortLabel: "Discovery",
    icon: "explore",
    bgClass: "bg-teal-50",
    textClass: "text-teal-600",
    dotClass: "bg-teal-400",
    iconBgClass: "bg-teal-100",
  },
  "phase-call": {
    label: "Phase Call",
    shortLabel: "Phase",
    icon: "route",
    bgClass: "bg-lime-50",
    textClass: "text-lime-700",
    dotClass: "bg-lime-400",
    iconBgClass: "bg-lime-100",
  },
  "client-meeting": {
    label: "Client Meeting",
    shortLabel: "Client",
    icon: "video_call",
    bgClass: "bg-cyan-50",
    textClass: "text-cyan-700",
    dotClass: "bg-cyan-400",
    iconBgClass: "bg-cyan-100",
  },
  "admin-focus": {
    label: "Focus Block",
    shortLabel: "Focus",
    icon: "timer",
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
    dotClass: "bg-gray-500",
    iconBgClass: "bg-gray-200",
  },
  "admin-task": {
    label: "Admin Task",
    shortLabel: "Admin",
    icon: "checklist",
    bgClass: "bg-stone-100",
    textClass: "text-stone-700",
    dotClass: "bg-stone-500",
    iconBgClass: "bg-stone-200",
  },
  personal: {
    label: "Personal",
    shortLabel: "Personal",
    icon: "self_improvement",
    bgClass: "bg-fuchsia-50",
    textClass: "text-fuchsia-700",
    dotClass: "bg-fuchsia-400",
    iconBgClass: "bg-fuchsia-100",
  },
};

export const ALL_EVENT_TYPES = Object.keys(EVENT_TYPE_CONFIG) as EventType[];
