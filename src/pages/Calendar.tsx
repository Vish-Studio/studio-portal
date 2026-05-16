import { useMemo, useState } from 'react';
import Layout from '../components/common/layout/layout';
import CalendarWidget from '../components/admin/calendar/calendar';
import StatCard from '../components/common/stat-card/stat-card';
import { CalendarCheck, CalendarDays } from 'lucide-react';
import ScheduleList from '../components/admin/calendar/schedule-list';
import { useCalendarStore } from '../store/calendar';

const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getWeekRange = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const customEvents = useCalendarStore((state) => state.customEvents);
  const today = new Date();

  const todayItems = customEvents[dateKey(today)]?.length ?? 0;
  const weekItems = useMemo(() => {
    const { start, end } = getWeekRange(today);

    return Object.entries(customEvents).reduce((count, [key, events]) => {
      const [year, month, day] = key.split('-').map(Number);
      const eventDate = new Date(year, month, day);
      return eventDate >= start && eventDate <= end ? count + events.length : count;
    }, 0);
  }, [customEvents, today]);
  const monthItems = useMemo(() => (
    Object.entries(customEvents).reduce((count, [key, events]) => {
      const [year, month] = key.split('-').map(Number);
      return year === selectedDate.getFullYear() && month === selectedDate.getMonth()
        ? count + events.length
        : count;
    }, 0)
  ), [customEvents, selectedDate]);
  const selectedItems = customEvents[dateKey(selectedDate)]?.length ?? 0;

  return (
    <Layout title="Calendar">
      <div className="flex flex-col gap-4 md:gap-6 pt-6 pb-10">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            variant="lime"
            icon={<CalendarCheck size={16} />}
            label="Today"
            value={String(todayItems)}
            badge="planned"
            badgeLabel="Items today"
          />
          <StatCard
            variant="surface"
            icon={<CalendarDays size={16} />}
            label="This Week"
            value={String(weekItems)}
            badge="week"
            badgeLabel="Items scheduled"
          />
          <StatCard
            variant="white"
            icon={<CalendarDays size={16} />}
            label="This Month"
            value={String(monthItems)}
            badge={selectedDate.toLocaleDateString('en-GB', { month: 'short' })}
            badgeLabel="Items scheduled"
          />
          <StatCard
            variant="dark"
            icon={<CalendarDays size={16} />}
            label="Selected Day"
            value={String(selectedItems)}
            badge={isSameDate(selectedDate, today) ? 'today' : 'selected'}
            badgeLabel={selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <CalendarWidget
            variant="dashboard"
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            className="aspect-square"
          />
          <div className="lg:col-span-2">
            <ScheduleList date={selectedDate} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
