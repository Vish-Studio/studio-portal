import Layout from '../components/common/layout/layout';
import CalendarWidget from '../components/admin/calendar/calendar';
import StatCard from '../components/common/stat-card/stat-card';
import { CalendarCheck, CalendarDays } from 'lucide-react';

const CalendarPage = () => {
  return (
    <Layout title="Calendar">
      <div className="flex flex-col gap-4 md:gap-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            variant="lime"
            icon={<CalendarCheck size={16} />}
            label="Today"
            value="2"
            badge="planned"
            badgeLabel="Items today"
          />
          <StatCard
            variant="surface"
            icon={<CalendarDays size={16} />}
            label="This Week"
            value="8"
            badge="week"
            badgeLabel="Items scheduled"
          />
          <div className="md:col-span-1">
            <CalendarWidget />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
