export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DAY_NAMES_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export interface MockEventSeed {
  modulo: number;
  index: number;
  type: string;
  title: string;
  time: string;
}

export const MOCK_EVENT_SEEDS: MockEventSeed[] = [
  { modulo: 7, index: 0, type: "brief", title: "Strategy Sync", time: "10:00 AM" },
  { modulo: 13, index: 1, type: "brief", title: "Strategy Sync", time: "10:00 AM" },
  { modulo: 5, index: 2, type: "design-review", title: "Product Review", time: "1:00 PM" },
  { modulo: 8, index: 3, type: "launch", title: "Web App Launch", time: "All Day" },
  { modulo: 19, index: 4, type: "client-feedback", title: "Client Feedback", time: "3:00 PM" },
];

export const TODAY_DEFAULT_EVENTS = [
  { idSuffix: "today-0", type: "onboarding", title: "Acme Corp Kickoff", time: "10:00 AM - 11:00 AM" },
  { idSuffix: "today-1", type: "design-review", title: "Design Review", time: "01:30 PM - 02:00 PM" },
];
