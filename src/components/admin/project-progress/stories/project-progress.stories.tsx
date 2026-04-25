import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PhaseTrack, PhaseSelector, ProjectProgressBar } from '../project-progress';
import { DEMO_PROJECTS, getProjectAccent } from '@/src/data/projects';

const earlyProject  = DEMO_PROJECTS[1]; // 1 stage done
const midProject    = DEMO_PROJECTS[0]; // 4 stages done
const lateProject   = DEMO_PROJECTS[2]; // 6 stages done
const doneProject   = DEMO_PROJECTS[3]; // all 8 done

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
      <p className="text-xs text-gray-400 mb-3">Early stage — 1/8 complete</p>
      <PhaseTrack stages={earlyProject.stages} accent={getProjectAccent(earlyProject.service)} size="md" />
    </div>
  ),
};

export const PhaseTrackMid: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <p className="text-xs text-gray-400 mb-3">Mid stage — 4/8 complete</p>
      <PhaseTrack stages={midProject.stages} accent={getProjectAccent(midProject.service, midProject.package)} size="md" />
    </div>
  ),
};

export const PhaseTrackComplete: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <p className="text-xs text-gray-400 mb-3">All stages complete — 8/8</p>
      <PhaseTrack stages={doneProject.stages} accent={getProjectAccent(doneProject.service)} size="md" />
    </div>
  ),
};

export const PhaseTrackSmall: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <p className="text-xs text-gray-400 mb-3">Card size (sm) — horizontal pills</p>
      <PhaseTrack stages={midProject.stages} accent={getProjectAccent(midProject.service)} size="sm" />
    </div>
  ),
};

export const PhaseTrackMobileCollapse: StoryObj = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div className="max-w-sm p-4">
      <p className="text-xs text-gray-400 mb-3">Mobile: collapsed bar → tap to expand vertical list</p>
      <PhaseTrack stages={midProject.stages} accent={getProjectAccent(midProject.service)} size="sm" />
    </div>
  ),
};

// ─── PhaseSelector (form input) ───────────────────────────────────────────────

export const PhaseSelectorInteractive: StoryObj = {
  render: () => {
    const [idx, setIdx] = useState(3);
    return (
      <div className="max-w-sm flex flex-col gap-3">
        <p className="text-xs text-gray-400">Selected index: <strong>{idx}</strong></p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 overflow-x-auto">
          <PhaseSelector selectedIndex={idx} onChange={setIdx} />
        </div>
      </div>
    );
  },
};

export const PhaseSelectorAllDone: StoryObj = {
  render: () => {
    const [idx, setIdx] = useState(8);
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 overflow-x-auto max-w-sm">
        <PhaseSelector selectedIndex={idx} onChange={setIdx} />
      </div>
    );
  },
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
