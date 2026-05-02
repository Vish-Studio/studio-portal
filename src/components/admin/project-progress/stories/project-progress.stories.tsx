import type { Meta, StoryObj } from '@storybook/react';
import { PhaseTrack, ProjectProgressBar } from '../project-progress';
import { DEMO_PROJECTS, getProjectAccent } from '@/src/data/projects';

const earlyProject = DEMO_PROJECTS[1]; // 1 phase done
const midProject   = DEMO_PROJECTS[0]; // 4 phases done
const lateProject  = DEMO_PROJECTS[2]; // 6 phases done
const doneProject  = DEMO_PROJECTS[3]; // all 9 done

const meta = {
  title: 'Admin/ProjectProgress',
  tags: ['autodocs'],
  parameters: { layout: 'padded', backgrounds: { default: 'white' } },
} satisfies Meta;

export default meta;

// ─── PhaseTrack ───────────────────────────────────────────────────────────────

export const PhaseTrackEarly: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <p className="text-xs text-gray-400 mb-3">Early — 1 phase done</p>
      <PhaseTrack phases={earlyProject.phases} accent={getProjectAccent(earlyProject.service)} size="md" />
    </div>
  ),
};

export const PhaseTrackMid: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <p className="text-xs text-gray-400 mb-3">Mid — 4 phases done</p>
      <PhaseTrack phases={midProject.phases} accent={getProjectAccent(midProject.service, midProject.package)} size="md" />
    </div>
  ),
};

export const PhaseTrackComplete: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <p className="text-xs text-gray-400 mb-3">All phases complete</p>
      <PhaseTrack phases={doneProject.phases} accent={getProjectAccent(doneProject.service)} size="md" />
    </div>
  ),
};

export const PhaseTrackSmall: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <p className="text-xs text-gray-400 mb-3">Card size (sm) — horizontal pills</p>
      <PhaseTrack phases={midProject.phases} accent={getProjectAccent(midProject.service)} size="sm" />
    </div>
  ),
};

export const PhaseTrackMobileCollapse: StoryObj = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div className="max-w-sm p-4">
      <p className="text-xs text-gray-400 mb-3">Mobile: collapsed bar → tap to expand vertical list</p>
      <PhaseTrack phases={midProject.phases} accent={getProjectAccent(midProject.service)} size="sm" />
    </div>
  ),
};

// ─── ProjectProgressBar ───────────────────────────────────────────────────────

export const ProgressBars: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-sm">
      {[earlyProject, midProject, lateProject, doneProject].map(p => {
        const accent = getProjectAccent(p.service, p.package);
        return (
          <div key={p.id}>
            <p className="text-xs font-semibold text-gray-500 mb-2">{p.name}</p>
            <ProjectProgressBar project={p} barClassName={accent.bar} />
          </div>
        );
      })}
    </div>
  ),
};
