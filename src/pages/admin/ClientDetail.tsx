import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, Trash2, Mail } from 'lucide-react';
import { format } from 'date-fns';

const DEMO_CLIENT = {
  id: 'demo',
  displayName: 'Demo Client',
  email: 'hello@example.com',
};

const DEMO_PROJECT = {
  id: 'demoproj',
  phase: 'Development',
  timeline: '3 Weeks',
  agreedPayment: 5000,
  remainingPayment: 2500,
};

export default function ClientDetail() {

  const [client]   = useState<any>(DEMO_CLIENT);
  const [status, setStatus] = useState('active');

  const [companyName, setCompanyName] = useState('Demo Corp');
  const [brandInfo, setBrandInfo]     = useState('Looking for a modern website.');
  const [rejectReason, setRejectReason] = useState('');

  const [phase, setPhase]       = useState(DEMO_PROJECT.phase);
  const [timeline, setTimeline] = useState(DEMO_PROJECT.timeline);
  const [agreed, setAgreed]     = useState<number>(DEMO_PROJECT.agreedPayment);
  const [remaining, setRemaining] = useState<number>(DEMO_PROJECT.remainingPayment);

  const [messages, setMessages] = useState<any[]>([
    { id: 'm1', senderId: 'client', text: 'When will the mocks be ready?', createdAt: { toMillis: () => Date.now() - 3600000 } },
  ]);
  const [documents, setDocuments] = useState<any[]>([
    { id: 'd1', title: 'Proposal.pdf', type: 'proposal', isSigned: false },
  ]);
  const [tasks, setTasks] = useState<any[]>([
    { id: 't1', title: 'Gather Assets',  completed: true  },
    { id: 't2', title: 'Sign Contract',  completed: false },
  ]);

  const [newMsg,  setNewMsg]  = useState('');
  const [newTask, setNewTask] = useState('');

  const [docType,   setDocType]   = useState('quotation');
  const [docTitle,  setDocTitle]  = useState('');
  const [docUrl,    setDocUrl]    = useState('');
  const [savingDoc, setSavingDoc] = useState(false);

  const saveProfile = () => alert('Client profile updated');

  const saveProject = () => {
    alert('Saved tracking.');
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: 'local_' + Date.now(), title: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (task: any) =>
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));

  const deleteTask = (id: string) =>
    setTasks(tasks.filter(t => t.id !== id));

  const sendMsg = (e?: React.FormEvent, text?: string) => {
    if (e) e.preventDefault();
    const msgText = text || newMsg;
    if (!msgText.trim()) return;
    setMessages([...messages, {
      id: 'local_' + Date.now(),
      senderId: 'admin',
      text: msgText,
      createdAt: { toMillis: () => Date.now() },
    }]);
    if (!text) setNewMsg('');
  };

  const saveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docUrl) return;
    setSavingDoc(true);
    setDocuments([...documents, {
      id: 'local_' + Date.now(),
      type: docType,
      title: docTitle,
      url: docUrl,
      isSigned: false,
    }]);
    alert('Document saved.');
    setDocTitle(''); setDocUrl('');
    setSavingDoc(false);
  };

  const deleteDocument = (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    setDocuments(documents.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <Link to="/admin/clients" className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center text-gray-500 shadow-[0_2px_10px_var(--color-shadow-subtle)] hover:text-gray-900 hover:scale-105 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{client.displayName}</h1>
            <p className="text-[13px] font-semibold text-gray-500 mt-1">{client.email}</p>
          </div>
        </div>
        <div className="hidden sm:flex bg-white rounded-full p-1 shadow-[0_2px_10px_var(--color-shadow-subtle)]">
          {['prospect', 'agreed', 'active', 'lost'].map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`px-5 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${status === s ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}>
              {s}
            </button>
          ))}
        </div>
      </header>

      {/* Mobile status */}
      <div className="sm:hidden flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 no-scrollbar">
        {['prospect', 'agreed', 'active', 'lost'].map(s => (
          <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 shrink-0 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${status === s ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-400 shadow-sm border border-gray-100 hover:text-gray-900'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Profile + Financials */}
        <div className="space-y-8">
          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <h3 className="text-[16px] font-extrabold text-gray-900 mb-6">Company Profile</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Brand Info / Notes</label>
                <textarea value={brandInfo} onChange={e => setBrandInfo(e.target.value)} rows={3} placeholder="Mascot is a bird, likes blue colors..." className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 transition-all shadow-sm" />
              </div>
              {status === 'lost' && (
                <div>
                  <label className="block text-[11px] font-bold text-red-500 uppercase tracking-widest mb-2">Rejection Reason</label>
                  <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Why did we lose them?" className="w-full bg-red-50 border border-red-100 text-red-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-red-200 transition-all shadow-sm" />
                </div>
              )}
            </div>
            <button onClick={saveProfile} className="text-[13px] font-bold mt-2 flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors w-full shadow-sm">Save Profile</button>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <h3 className="text-[16px] font-extrabold text-gray-900 mb-6">Financials & Timeline</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Phase</label>
                <input value={phase} onChange={e => setPhase(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Timeline Summary</label>
                <input value={timeline} onChange={e => setTimeline(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Agreed ($)</label>
                  <input type="number" value={agreed} onChange={e => setAgreed(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Remaining ($)</label>
                  <input type="number" value={remaining} onChange={e => setRemaining(Number(e.target.value))} className="w-full bg-red-50 border border-red-100 text-red-600 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-red-200 shadow-sm transition-colors" />
                </div>
              </div>
            </div>
            <button onClick={saveProject} className="text-[13px] font-bold mt-2 flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors w-full shadow-sm">Save Tracking</button>
          </section>
        </div>

        {/* Middle: Tasks + Docs */}
        <div className="space-y-8">
          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <h3 className="text-[16px] font-extrabold text-gray-900 mb-6">Project Tasks</h3>
            <form onSubmit={addTask} className="flex gap-2 mb-6">
              <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="New task title..." className="flex-1 bg-gray-50 border border-gray-100 text-gray-900 text-[13px] font-bold py-3 px-4 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" />
              <button type="submit" disabled={!newTask.trim()} className="bg-black text-white text-[13px] font-bold px-5 py-3 rounded-[16px] hover:bg-gray-800 transition-colors disabled:opacity-50 shrink-0 shadow-sm">Add</button>
            </form>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {tasks.length === 0 ? (
                <p className="text-[13px] font-semibold text-gray-400 text-center py-4">No tasks added yet.</p>
              ) : tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-[20px] hover:shadow-sm hover:border-gray-200 group transition-all">
                  <div className="flex items-center cursor-pointer flex-1 gap-4" onClick={() => toggleTask(t)}>
                    <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${t.completed ? 'bg-green-100 border-green-400 text-green-700' : 'bg-white border-gray-200 text-transparent'}`}>
                      <CheckCircle size={14} className={t.completed ? 'opacity-100' : 'opacity-0'} />
                    </div>
                    <span className={`text-[13px] font-extrabold truncate max-w-[200px] leading-tight ${t.completed ? 'text-gray-400 line-through decoration-gray-300 decoration-2' : 'text-gray-900'}`}>{t.title}</span>
                  </div>
                  <button onClick={() => deleteTask(t.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 ml-2 bg-white rounded-full shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <h3 className="text-[16px] font-extrabold text-gray-900 mb-6">Manage Documents</h3>
            <form onSubmit={saveDocument} className="space-y-4 mb-8">
              <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white shadow-sm transition-colors">
                <option value="quotation">Quotation</option>
                <option value="proposal">Proposal</option>
                <option value="invoice">Invoice</option>
                <option value="contract">Contract (Needs Signature)</option>
                <option value="onboarding">Onboarding</option>
                <option value="other">Other</option>
              </select>
              <input placeholder="Doc Title" value={docTitle} onChange={e => setDocTitle(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white shadow-sm transition-colors" />
              <input placeholder="Document URL (https://...)" value={docUrl} onChange={e => setDocUrl(e.target.value)} required type="url" className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white shadow-sm transition-colors" />
              <button type="submit" disabled={savingDoc} className="text-[13px] font-bold mt-2 flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors w-full shadow-sm disabled:opacity-50">
                Share Document
              </button>
            </form>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {documents.map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-[20px] group transition-all hover:bg-white hover:border-gray-200 hover:shadow-sm">
                  <div className="truncate flex-1">
                    <div className="text-[13px] font-extrabold text-gray-900 truncate leading-tight">{d.title}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                      {d.type} {d.type === 'contract' && (d.isSigned ? '(Signed)' : '(Pending)')}
                    </div>
                  </div>
                  <button onClick={() => deleteDocument(d.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-sm ml-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Chat */}
        <section className="bg-white rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)] flex flex-col h-[800px] overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <h3 className="text-[16px] font-extrabold text-gray-900">Communication</h3>
            <button
              onClick={() => sendMsg(undefined, "Hello! This is our automated monthly check-in. Just wanted to see if your website is running smoothly or if you need any adjustments or new features crafted! Let us know.")}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Mail size={14} /> Sync
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-4 bg-gray-50/30">
            {messages.map(m => {
              const isAdmin = m.senderId === 'admin';
              return (
                <div key={m.id} className={`max-w-[85%] p-4 text-[13px] font-bold leading-relaxed shadow-sm ${isAdmin ? 'ml-auto bg-black text-white rounded-[20px] rounded-tr-[4px]' : 'bg-white border border-gray-200 text-gray-900 rounded-[20px] rounded-tl-[4px]'}`}>
                  <p>{m.text}</p>
                  <span className="text-[10px] mt-2 block font-bold text-gray-400">{m.createdAt?.toMillis ? format(m.createdAt.toMillis(), 'h:mm a') : ''}</span>
                </div>
              );
            })}
          </div>
          <form onSubmit={e => sendMsg(e)} className="p-6 sm:p-8 bg-white border-t border-gray-100 z-10">
            <div className="relative flex items-center">
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} type="text" placeholder="Message client..." className="w-full bg-gray-50 border border-gray-100 rounded-[16px] pl-5 pr-14 py-3.5 text-[13px] font-bold focus:outline-none focus:bg-white focus:border-gray-200 text-gray-900 shadow-sm transition-colors" />
              <button type="submit" disabled={!newMsg.trim()} className="absolute right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm">
                <Send size={16} className="-ml-0.5" />
              </button>
            </div>
          </form>
        </section>

      </div>
    </div>
  );
}
