import React from 'react';
import {
  MoreVertical,
  BarChart2,
  Command,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import Layout from '../components/layout/layout';
import Calendar from '../components/calendar/calendar';
import ProjectTimeline from '../components/project-timeline/project-timeline';

export default function Dashboard() {
  return (
    <Layout>
      {/* Dashboard Grid Content */}
      <div className="flex-1 flex flex-col gap-8">
        <Calendar />

        {/* Top 3 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Client Overview Card */}
          <div className="bg-(--color-surface-alt) shadow-sm rounded-[32px] p-6 flex flex-col items-start gap-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                <Users size={16} /> Client Overview
              </div>
              <MoreVertical size={16} className="text-gray-400" />
            </div>
            <div className="mt-2">
              <span className="text-[42px] font-bold tracking-tight text-(--color-ink) leading-none">24</span>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex items-center gap-1 text-[12px] font-bold text-gray-900 bg-white px-2 py-1 rounded-[6px] shadow-sm">
                <TrendingUp size={14} className="text-green-600" /> +12%
              </div>
              <span className="text-sm font-medium text-gray-500">Active this month</span>
            </div>
          </div>

          {/* Ongoing Project Overview Card */}
          <div className="bg-(--color-accent-lime) shadow-sm rounded-[32px] p-6 flex flex-col items-start gap-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-2 text-gray-800 font-medium text-sm">
                <Command size={16} /> Ongoing Projects
              </div>
              <MoreVertical size={16} className="text-gray-600" />
            </div>
            <div className="mt-2">
              <span className="text-[42px] font-bold tracking-tight text-(--color-ink) leading-none">12</span>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex items-center gap-1 text-[12px] font-bold text-gray-900 bg-white/60 px-2 py-1 rounded-[6px]">
                68% capacity
              </div>
              <span className="text-sm font-medium text-gray-700">Projects in progress</span>
            </div>
          </div>

          {/* Expense Overview Card */}
          <div className="bg-(--color-ink) shadow-sm rounded-[32px] p-6 flex flex-col items-start gap-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                <BarChart2 size={16} /> Expense Overview
              </div>
              <MoreVertical size={16} className="text-gray-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[42px] font-bold tracking-tight text-white leading-none">$4,250</span>
              <span className="text-sm font-medium text-gray-400">/ $5,000</span>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex items-center gap-1 text-[12px] font-bold text-white bg-white/10 px-2 py-1 rounded-[6px]">
                <TrendingDown size={14} className="text-red-400" /> -5%
              </div>
              <span className="text-sm font-medium text-gray-400">Versus budget</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
