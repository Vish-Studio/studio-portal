import React, { useEffect, useState } from 'react';
import { Command, Users, BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import Layout from '../components/layout/layout';
import Calendar from '../components/calendar/calendar';
import StatCard from '../components/stat-card/stat-card';

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex-1 flex flex-col gap-8">

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            variant="lime"
            icon={<Command size={16} />}
            label="Ongoing Projects"
            value="12"
            badge="68% capacity"
            badgeLabel="Projects in progress"
            onAction={() => { }}
          />

          <StatCard
            variant="surface"
            icon={<Users size={16} />}
            label="Client Overview"
            value="24"
            badge={<><TrendingUp size={14} className="text-green-600" /> +12%</>}
            badgeLabel="Active this month"
            onAction={() => { }}
          />

          <StatCard
            variant="dark"
            icon={<BarChart2 size={16} />}
            label="Expense Overview"
            value="$4,250"
            valueSubLabel="/ $5,000"
            badge={<><TrendingDown size={14} className="text-red-400" /> -5%</>}
            badgeLabel="Versus budget"
            onAction={() => { }}
          />

        </div>

        <Calendar />

      </div>
    </Layout>
  );
}

export function MauritiusTimeDisplay() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Indian/Mauritius',
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-2">
      <span className="text-[42px] font-bold tracking-tight text-(--color-ink) leading-none">{time}</span>
    </div>
  );
}
