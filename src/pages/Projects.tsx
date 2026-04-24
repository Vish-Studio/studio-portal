import { useState, useMemo } from 'react';
import { Briefcase, CheckCircle, TrendingUp, Layers } from 'lucide-react';
import Layout from '../components/layout/layout';
import StatCard from '../components/stat-card/stat-card';
import TableTab, { type TabItem } from '../components/table-tab/table-tab';
import MaterialIcon from '../components/ui/material-icon';
import ProjectCard, { ProjectCardMini } from '../components/project-card/project-card';
import { DEMO_PROJECTS } from '../data/projects';
import { useUIStore } from '../store/ui';

// ─── Projects Page ────────────────────────────────────────────────────────────

const Projects = () => {
  const { searchQuery } = useUIStore();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const isMobile = window.innerWidth < 768;
  if (isMobile && viewMode !== 'grid') {
    setViewMode('grid');
  }

  const tabCounts = useMemo(() => ({
    all: DEMO_PROJECTS.length,
    active: DEMO_PROJECTS.filter(p => p.status === 'active').length,
    paused: DEMO_PROJECTS.filter(p => p.status === 'paused').length,
    completed: DEMO_PROJECTS.filter(p => p.status === 'completed').length,
  }), []);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'active', label: 'Active', count: tabCounts.active },
    { key: 'paused', label: 'Paused', count: tabCounts.paused },
    { key: 'completed', label: 'Completed', count: tabCounts.completed },
  ];

  const filtered = useMemo(() => {
    let list = DEMO_PROJECTS;
    if (activeTab !== 'all') list = list.filter(p => p.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        (p.package ?? '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeTab, searchQuery]);

  const totalBudget = DEMO_PROJECTS.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid = DEMO_PROJECTS.reduce((s, p) => s + p.paidPayment, 0);
  const avgProgress = Math.round(
    DEMO_PROJECTS.reduce((s, p) => {
      const done = p.stages.filter(st => st.status === 'completed').length;
      return s + (done / 8) * 100;
    }, 0) / DEMO_PROJECTS.length,
  );

  return (
    <Layout title="Projects">
      <div className="flex flex-col gap-6 md:gap-8 pb-10">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            variant="lime"
            icon={<Briefcase size={16} />}
            label="Total Projects"
            value={DEMO_PROJECTS.length}
            badge={`${tabCounts.active} active`}
            badgeLabel="in progress"
          />
          <StatCard
            variant="surface"
            icon={<CheckCircle size={16} />}
            label="Completed"
            value={tabCounts.completed}
            badge={`${tabCounts.paused} paused`}
            badgeLabel="on hold"
          />
          <StatCard
            variant="dark"
            icon={<TrendingUp size={16} />}
            label="Total Value"
            value={`$${(totalBudget / 1000).toFixed(0)}k`}
            badge={`$${(totalPaid / 1000).toFixed(0)}k collected`}
            badgeLabel="to date"
          />
          <StatCard
            variant="white"
            icon={<Layers size={16} />}
            label="Avg. Progress"
            value={`${avgProgress}%`}
            badge={`${DEMO_PROJECTS.length} projects`}
            badgeLabel="tracked"
          />
        </div>

        <div className="flex flex-col gap-3">
          {/* ── Toolbar: tabs + view toggle ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <TableTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* View toggle */}
            <div className="ml-auto hidden md:flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 shrink-0">
              {([
                { mode: 'list', icon: 'view_list' },
                { mode: 'grid', icon: 'grid_view' },
              ] as const).map(({ mode, icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-label={`${mode} view`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === mode
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <MaterialIcon name={icon} size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Content ── */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[18px] py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-(--color-surface) flex items-center justify-center">
                <Briefcase size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No projects found</p>
              {searchQuery && (
                <p className="text-xs text-gray-400">No results for &ldquo;{searchQuery}&rdquo;</p>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map(p => (
                <ProjectCardMini key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Projects;
