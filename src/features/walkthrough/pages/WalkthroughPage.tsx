import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, MessageSquare, PanelTop } from 'lucide-react';
import { defaultRouteForRole, isStaffRole } from '@/src/auth/roleAccess';
import { Button } from '@/src/shared/components';
import { useAuthStore } from '@/src/features/auth/stores/authStore';
import { markWalkthroughComplete } from '../walkthroughStorage';

const steps = [
  {
    eyebrow: 'Step 1 of 3',
    title: 'Everything for your project, in one place.',
    body: 'Your dashboard gives you a single view of the project: what is happening, what needs your attention, and what comes next.',
    points: ['See the latest project update', 'Find open tasks and documents', 'Keep messages with the work'],
    image: '/assets/walkthrough/agency-collaboration.png',
  },
  {
    eyebrow: 'Step 2 of 3',
    title: 'We move through each phase together.',
    body: 'The studio keeps each phase current so you always know where the work stands, from discovery through launch.',
    points: ['The studio posts progress updates', 'You see the current phase at a glance', 'The next action is kept clear'],
  },
  {
    eyebrow: 'Step 3 of 3',
    title: 'Review, respond, and keep work moving.',
    body: 'When something is ready, you can leave feedback, complete a task, or approve it directly in the portal.',
    points: ['Review work in context', 'Ask for a change or approve it', 'Keep decisions and files organized'],
  },
];

function StepArtwork({ activeIndex }: { activeIndex: number }) {
  if (activeIndex === 0) {
    return (
      <div className="overflow-hidden rounded-[18px] bg-(--color-surface-alt)">
        <img
          src={steps[0].image}
          alt="Client and studio collaborating in the project portal"
          className="h-52 w-full object-cover sm:h-64 lg:h-full lg:min-h-[360px]"
        />
      </div>
    );
  }

  if (activeIndex === 1) {
    return (
      <div className="flex min-h-52 flex-col justify-center rounded-[18px] bg-(--color-surface-alt) p-6 sm:min-h-64 lg:min-h-[360px] lg:p-9">
        <p className="text-sm font-bold text-(--color-ink)">Project progress</p>
        <div className="mt-7 flex items-center gap-2">
          {['Discovery', 'Design', 'Build', 'Review', 'Launch'].map((phase, index) => (
            <div key={phase} className="min-w-0 flex-1">
              <div className={`h-2 rounded-full ${index < 3 ? 'bg-(--color-accent-lime)' : 'bg-white'}`} />
              <p className="mt-2 truncate text-[11px] font-bold text-gray-400">{phase}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm font-medium leading-6 text-gray-500">The active phase and the next action stay visible on your project.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-52 flex-col justify-center rounded-[18px] bg-(--color-sidebar-bg) p-6 text-white sm:min-h-64 lg:min-h-[360px] lg:p-9">
      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-(--color-accent-lime) text-(--color-ink)">
        <MessageSquare size={20} />
      </div>
      <p className="mt-6 text-lg font-bold">Review ready</p>
      <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-white/60">A clear review request keeps feedback, decisions, and the next step together.</p>
      <div className="mt-7 flex items-center gap-2 text-sm font-bold text-(--color-accent-lime)">
        <CheckCircle2 size={16} />
        Ready for your response
      </div>
    </div>
  );
}

export default function WalkthroughPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useAuthStore(state => state.profile);
  const ready = useAuthStore(state => state.ready);
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultPath = defaultRouteForRole(profile?.role);
  const fromPath = useMemo(() => {
    if (typeof location.state === 'object' && location.state && 'from' in location.state) {
      const value = String(location.state.from);
      if (value !== '/walkthrough') return value;
    }
    return defaultPath;
  }, [defaultPath, location.state]);

  if (!ready) return null;
  if (!profile) return <Navigate to="/sign-in" replace state={{ from: '/walkthrough' }} />;

  const activeStep = steps[activeIndex];
  const isLast = activeIndex === steps.length - 1;
  const destination = isStaffRole(profile.role) || fromPath.startsWith('/admin') ? '/admin' : '/user';
  const targetPath = fromPath.startsWith(destination) ? fromPath : defaultPath;

  const finish = () => {
    markWalkthroughComplete(profile);
    navigate(targetPath, { replace: true });
  };

  return (
    <main className="walkthrough min-h-screen bg-white font-sans text-(--color-ink)">
      <header className="flex items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-(--color-sidebar-bg)">
            <img src="/assets/logo-white-trans.png" alt="Studio Portal logo" width={27} height={27} />
          </div>
          <span className="text-base font-bold">studio portal</span>
        </div>
        <Button variant="ghost" size="sm" onClick={finish}>Skip</Button>
      </header>

      <section className="px-4 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8 lg:pt-10">
        <div className="w-full">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <p className="type-label text-gray-400">Getting started</p>
            <p className="text-xs font-bold text-gray-400">{activeStep.eyebrow}</p>
          </div>

          <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)] lg:items-center lg:gap-14 lg:py-14">
            <div className="max-w-2xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-(--color-accent-lime)">
                <PanelTop size={20} />
              </div>
              <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{activeStep.title}</h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-gray-500">{activeStep.body}</p>

              <ul className="mt-7 space-y-3">
                {activeStep.points.map(point => (
                  <li key={point} className="flex items-center gap-3 text-sm font-bold text-(--color-ink)">
                    <CheckCircle2 size={17} className="shrink-0 text-(--color-accent-green)" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <StepArtwork activeIndex={activeIndex} />
          </div>

          <footer className="flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2" aria-label="Onboarding progress">
              {steps.map((step, index) => (
                <span key={step.title} className={`h-1.5 rounded-full ${index === activeIndex ? 'w-8 bg-(--color-ink)' : 'w-1.5 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              {activeIndex > 0 && (
                <Button variant="secondary" size="sm" iconLeft={<ChevronLeft size={15} />} onClick={() => setActiveIndex(index => index - 1)}>
                  Back
                </Button>
              )}
              <Button
                size="sm"
                iconRight={isLast ? <ArrowRight size={15} /> : <ChevronRight size={15} />}
                onClick={() => (isLast ? finish() : setActiveIndex(index => index + 1))}
              >
                {isLast ? 'Open portal' : 'Continue'}
              </Button>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
