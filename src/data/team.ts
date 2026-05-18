export {
  AVATAR_COLORS,
  getMemberColors,
  type TeamAccessRole,
  type TeamMember,
  type TeamProject,
} from '@/src/features/team/types';

// Demo data lives in seed.ts — re-exported here for Storybook compatibility
// Note: DEMO_PROJECTS here refers to TeamProject[], not ClientProject[]
export { DEMO_MEMBERS, DEMO_TEAM_PROJECTS as DEMO_PROJECTS } from './seed';
