import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/authprovider/authprovider';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowRight, FileText, CheckCircle, CreditCard, Send, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientDashboard() {
  const { user, appUser, isDemo } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isWorking, setIsWorking] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!user) return;
      if (isDemo) {
        setProject({
          name: 'VISH Studio Website Redesign',
          phase: 'Development',
          timeline: 'Q3 2026 - Sprint 4',
          agreedPayment: 15000,
          remainingPayment: 7500
        });
        setOnboarding(null);
        setTasks([
          { id: '1', title: 'Complete Onboarding Form', completed: true },
          { id: '2', title: 'Upload Brand Assets', completed: false },
          { id: '3', title: 'Review Initial Mockups', completed: false },
        ]);
        setIsWorking(true);
        setLoading(false);
        return;
      }
      try {
        const pSnap = await getDocs(query(collection(db, 'projects'), where('clientId', '==', user.uid)));
        if (!pSnap.empty) {
          setProject({ id: pSnap.docs[0].id, ...(pSnap.docs[0].data() as any) });
        }

        const dSnap = await getDocs(query(collection(db, 'documents'), where('clientId', 'in', [user.uid, 'global']), where('type', '==', 'onboarding')));
        if (!dSnap.empty) {
          setOnboarding({ id: dSnap.docs[0].id, ...(dSnap.docs[0].data() as any) });
        }

        const tSnap = await getDocs(query(collection(db, 'tasks'), where('clientId', '==', user.uid)));
        setTasks(tSnap.docs.map(d => ({id: d.id, ...(d.data() as any)})));

        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
           setIsWorking(settingsSnap.data().isWorking !== false);
        }

      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [user, isDemo]);

  const toggleTask = async (task: any) => {
    try {
      if (!isDemo) {
        await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
      }
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !task.completed } : t));
    } catch(e) { console.error(e); }
  }

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center text-gray-500 font-medium"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {!isWorking && (
         <div className="bg-red-50 border border-red-100 p-4 rounded-[16px] flex items-start gap-4 mb-4">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
               <h3 className="text-sm font-bold text-red-900">VISH Studio is currently Out of Office</h3>
               <p className="text-xs font-semibold text-red-700 mt-1">We are not taking active requests or replying to messages immediately. Rest assured, your project is safe with us.</p>
            </div>
         </div>
      )}
      
      <header className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Project: {project?.name || 'Getting Started'}</h2>
          <div className="flex gap-4 items-center mt-2">
             {project && (
                <span className="px-3 py-1 bg-(--color-accent-mint)/30 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">Status: {appUser?.status || 'Active'}</span>
             )}
             <span className="text-[13px] font-bold text-gray-500">Current Phase: {project?.phase || 'Kickoff'}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {onboarding && (
            <a href={onboarding.url} target="_blank" rel="noreferrer" className="px-6 py-3 bg-black text-white font-bold text-xs rounded-full hover:bg-gray-800 transition-colors shadow-sm">
              View Onboarding
            </a>
          )}
        </div>
      </header>

      {!project ? (
        <div className="bg-white border border-gray-200 p-12 rounded-[28px] text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="text-gray-400 animate-spin" size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Setting things up</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm font-medium">We are preparing your project workspace. Your timeline and payments will appear here shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-6">
            
            {/* Timeline equivalent in theme */}
            <section className="bg-white border text-gray-900 border-gray-200 p-8 rounded-[24px]">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Roadmap</h3>
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{project?.timeline || 'Estimating'}</span>
               </div>
               
               <div className="relative flex justify-between mt-10">
                  <div className="absolute top-3 left-0 w-full h-[2px] bg-gray-100 z-0"></div>
                  <div className="z-10 text-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] mx-auto mb-3 shadow-[0_0_0_4px_white]">✓</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kickoff</p>
                  </div>
                  <div className="z-10 text-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] mx-auto mb-3 shadow-[0_0_0_4px_white]">●</div>
                    <p className="text-xs font-extrabold text-gray-900 max-w-[80px] break-words leading-tight">{project.phase}</p>
                  </div>
                  <div className="z-10 text-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] mx-auto mb-3 shadow-[0_0_0_4px_white]">3</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completion</p>
                  </div>
               </div>
            </section>

            {/* Tasks section */}
            {tasks.length > 0 && (
              <section className="bg-white border text-gray-900 border-gray-200 p-8 rounded-[24px]">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Your Action Items</h3>
                 <div className="space-y-3 max-h-[300px] overflow-y-auto">
                   {tasks.map((t) => (
                      <div key={t.id} onClick={() => toggleTask(t)} className="flex items-center cursor-pointer p-4 bg-gray-50 border border-gray-100 rounded-[16px] hover:border-gray-200 transition-all">
                        <CheckCircle size={20} className={`mr-4 shadow-sm rounded-full bg-white flex-shrink-0 transition-colors ${t.completed ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className={`text-sm font-bold ${t.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{t.title}</span>
                      </div>
                   ))}
                 </div>
              </section>
            )}

          </div>

          <div className="col-span-12 lg:col-span-5 space-y-6">
            
            {/* Payments */}
            <section className="bg-white border text-gray-900 border-gray-200 p-8 rounded-[24px]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Account Balance</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Agreed</p>
                  <p className="text-4xl font-extrabold text-gray-900">${(project.agreedPayment || 0).toLocaleString()}</p>
                </div>
                <div className="h-[1px] bg-gray-100"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paid to Date</p>
                    <p className="text-lg font-extrabold text-green-600">${((project.agreedPayment || 0) - (project.remainingPayment || 0)).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
                    <p className="text-lg font-extrabold text-gray-900">${(project.remainingPayment || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Admin Chat */}
            <section className="bg-white border border-gray-200 rounded-[28px] flex flex-col h-[400px] overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Project Chat</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VISH Studio</span>
              </div>
              <ChatPanel clientId={user.uid} currentUserId={user.uid} isDemo={isDemo} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatPanel({ clientId, currentUserId, isDemo }: { clientId: string, currentUserId: string, isDemo?: boolean }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    const fetchChat = async () => {
      if (isDemo) {
        setMessages([
          { id: '1', senderId: 'admin_1', text: 'Welcome to VISH Studio! Let us know if you need anything.', createdAt: { toMillis: () => Date.now() - 86400000 } }
        ]);
        return;
      }
      try {
        const mSnap = await getDocs(query(collection(db, 'messages'), where('clientId', '==', clientId)));
        const sorted = mSnap.docs.map(d => ({id: d.id, ...(d.data() as any)})).sort((a:any,b:any) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
        setMessages(sorted);
      } catch(e) { console.error(e) }
    };
    fetchChat();
  }, [clientId, isDemo]);

  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newMsg.trim()) return;
    const { serverTimestamp, addDoc, collection } = await import('firebase/firestore');
    const msg = {
      clientId, senderId: currentUserId, text: newMsg, createdAt: isDemo ? { toMillis: () => Date.now() } : serverTimestamp()
    };
    try {
      if (!isDemo) {
        const docRef = await addDoc(collection(db, 'messages'), msg);
        setMessages([...messages, { id: docRef.id, ...msg, createdAt: { toMillis: () => Date.now() }}]);
      } else {
        setMessages([...messages, { id: 'demo_' + Date.now(), ...msg }]);
      }
      setNewMsg('');
    } catch(e) { console.error(e) }
  };

  return (
    <>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/50">
        {messages.length === 0 ? <p className="text-gray-400 text-xs font-medium text-center">Ask us anything.</p> : null}
        {messages.map(m => {
           const isMe = m.senderId === currentUserId;
           return (
             <div key={m.id} className={`max-w-[85%] p-3.5 text-xs font-medium leading-relaxed shadow-sm ${isMe ? 'ml-auto bg-black text-white rounded-[16px] rounded-tr-[4px]' : 'bg-white border border-gray-200 text-gray-900 rounded-[16px] rounded-tl-[4px]'}`}>
               <p>{m.text}</p>
               {m.createdAt?.toMillis && <span className={`text-[10px] mt-1.5 block font-bold ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>{format(m.createdAt.toMillis(), 'h:mm a')}</span>}
             </div>
           );
        })}
      </div>
      <form onSubmit={sendMsg} className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} type="text" placeholder="Write a message..." className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm font-medium focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all font-sans text-gray-900" />
          <button disabled={!newMsg.trim()} type="submit" className="absolute right-2 text-black p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 transition-colors"><Send size={18} className="ml-0.5" /></button>
        </div>
      </form>
    </>
  );
}
