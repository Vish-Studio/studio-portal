import React, { useState } from 'react';
import { ArrowRight, FileText, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const DEMO_PROJECT = {
  name: 'VISH Studio Website Redesign',
  phase: 'Development',
  timeline: 'Q3 2026 - Sprint 4',
  agreedPayment: 15000,
  remainingPayment: 7500,
};

const DEMO_TASKS = [
  { id: '1', title: 'Complete Onboarding Form', completed: true },
  { id: '2', title: 'Upload Brand Assets',      completed: false },
  { id: '3', title: 'Review Initial Mockups',   completed: false },
];

const DEMO_MESSAGES = [
  { id: '1', senderId: 'admin', text: 'Welcome to VISH Studio! Let us know if you need anything.', createdAt: { toMillis: () => Date.now() - 86400000 } },
];

export default function ClientDashboard() {
  const project = DEMO_PROJECT;
  const isWorking = true;

  const [tasks, setTasks]       = useState(DEMO_TASKS);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [newMsg, setNewMsg]     = useState('');

  const toggleTask = (task: { id: string; completed: boolean }) =>
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages([...messages, {
      id: 'local_' + Date.now(),
      senderId: 'client',
      text: newMsg,
      createdAt: { toMillis: () => Date.now() },
    }]);
    setNewMsg('');
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {!isWorking && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-[16px] flex items-start gap-4 mb-4">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-red-900">VISH Studio is currently Out of Office</h3>
            <p className="text-xs font-semibold text-red-700 mt-1">We are not taking active requests right now. Your project is safe with us.</p>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Project: {project.name}</h2>
          <div className="flex gap-4 items-center mt-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Active</span>
            <span className="text-[13px] font-bold text-gray-500">Current Phase: {project.phase}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-6">

          {/* Roadmap */}
          <section className="bg-white border border-gray-200 text-gray-900 p-8 rounded-[24px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Roadmap</h3>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{project.timeline}</span>
            </div>
            <div className="relative flex justify-between mt-10">
              <div className="absolute top-3 left-0 w-full h-[2px] bg-gray-100 z-0" />
              <div className="z-10 text-center">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] mx-auto mb-3 shadow-[0_0_0_4px_white]">✓</div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kickoff</p>
              </div>
              <div className="z-10 text-center">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] mx-auto mb-3 shadow-[0_0_0_4px_white]">●</div>
                <p className="text-xs font-extrabold text-gray-900 max-w-[80px] break-words leading-tight">{project.phase}</p>
              </div>
              <div className="z-10 text-center opacity-40">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] mx-auto mb-3 shadow-[0_0_0_4px_white]">3</div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completion</p>
              </div>
            </div>
          </section>

          {/* Tasks */}
          {tasks.length > 0 && (
            <section className="bg-white border border-gray-200 text-gray-900 p-8 rounded-[24px]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Your Action Items</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {tasks.map(t => (
                  <div key={t.id} onClick={() => toggleTask(t)} className="flex items-center cursor-pointer p-4 bg-gray-50 border border-gray-100 rounded-[16px] hover:border-gray-200 transition-all">
                    <CheckCircle size={20} className={`mr-4 shadow-sm rounded-full bg-white shrink-0 transition-colors ${t.completed ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={`text-sm font-bold ${t.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{t.title}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">

          {/* Payments */}
          <section className="bg-white border border-gray-200 text-gray-900 p-8 rounded-[24px]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Account Balance</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Agreed</p>
                <p className="text-4xl font-extrabold text-gray-900">${project.agreedPayment.toLocaleString()}</p>
              </div>
              <div className="h-[1px] bg-gray-100" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paid to Date</p>
                  <p className="text-lg font-extrabold text-green-600">${(project.agreedPayment - project.remainingPayment).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
                  <p className="text-lg font-extrabold text-gray-900">${project.remainingPayment.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Chat */}
          <section className="bg-white border border-gray-200 rounded-[28px] flex flex-col h-[400px] overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Project Chat</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VISH Studio</span>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/50">
              {messages.map(m => {
                const isMe = m.senderId === 'client';
                return (
                  <div key={m.id} className={`max-w-[85%] p-3.5 text-xs font-medium leading-relaxed shadow-sm ${isMe ? 'ml-auto bg-black text-white rounded-[16px] rounded-tr-[4px]' : 'bg-white border border-gray-200 text-gray-900 rounded-[16px] rounded-tl-[4px]'}`}>
                    <p>{m.text}</p>
                    {m.createdAt?.toMillis && (
                      <span className="text-[10px] mt-1.5 block font-bold text-gray-400">
                        {format(m.createdAt.toMillis(), 'h:mm a')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMsg} className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)} type="text" placeholder="Write a message..." className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm font-medium focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all text-gray-900" />
                <button disabled={!newMsg.trim()} type="submit" className="absolute right-2 text-black p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 transition-colors">
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
