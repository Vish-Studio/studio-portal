import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Send, CheckCircle, Trash2, Mail } from 'lucide-react';
import { useAuth } from '../../components/authprovider/authprovider';
import { format } from 'date-fns';

export default function ClientDetail() {
  const { clientId } = useParams();
  const { user: currentUser, isDemo } = useAuth();
  const [client, setClient] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  
  // Profile Form
  const [companyName, setCompanyName] = useState('');
  const [brandInfo, setBrandInfo] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Project Form
  const [phase, setPhase] = useState('Kickoff');
  const [timeline, setTimeline] = useState('');
  const [agreed, setAgreed] = useState(0);
  const [remaining, setRemaining] = useState(0);

  // Lists
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Inputs
  const [newMsg, setNewMsg] = useState('');
  const [newTask, setNewTask] = useState('');

  // New Doc Form
  const [docType, setDocType] = useState('quotation');
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [savingDoc, setSavingDoc] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    const loadData = async () => {
      if (isDemo) {
         setClient({ id: clientId, displayName: 'Demo Client', email: 'hello@example.com' });
         setStatus('active');
         setCompanyName('Demo Corp');
         setBrandInfo('Looking for a modern website.');
         setProject({ id: 'demoproj', phase: 'Development', timeline: '3 Weeks', agreedPayment: 5000, remainingPayment: 2500 });
         setPhase('Development'); setTimeline('3 Weeks'); setAgreed(5000); setRemaining(2500);
         setMessages([{ id: 'm1', senderId: 'client', text: 'When will the mocks be ready?', createdAt: { toMillis: () => Date.now() - 3600000 } }]);
         setDocuments([{ id: 'd1', title: 'Proposal.pdf', type: 'proposal', isSigned: false }]);
         setTasks([{ id: 't1', title: 'Gather Assets', completed: true }, { id: 't2', title: 'Sign Contract', completed: false }]);
         setLoading(false);
         return;
      }
      try {
        const cSnap = await getDoc(doc(db, 'users', clientId));
        if (cSnap.exists()) {
          const cData = cSnap.data();
          setClient({ id: cSnap.id, ...cData });
          setStatus(cData.status || 'prospect');
          setCompanyName(cData.companyName || '');
          setBrandInfo(cData.brandInfo || '');
          setRejectReason(cData.rejectReason || '');
        }

        const pSnap = await getDocs(query(collection(db, 'projects'), where('clientId', '==', clientId)));
        if (!pSnap.empty) {
          const pData = { id: pSnap.docs[0].id, ...(pSnap.docs[0].data() as any) };
          setProject(pData);
          setPhase(pData.phase);
          setTimeline(pData.timeline);
          setAgreed(pData.agreedPayment);
          setRemaining(pData.remainingPayment);
        }

        const mSnap = await getDocs(query(collection(db, 'messages'), where('clientId', '==', clientId)));
        const sortedMessages = mSnap.docs.map(d => ({id: d.id, ...(d.data() as any)})).sort((a:any,b:any) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
        setMessages(sortedMessages);

        const dSnap = await getDocs(query(collection(db, 'documents'), where('clientId', '==', clientId)));
        setDocuments(dSnap.docs.map(d => ({id: d.id, ...(d.data() as any)})));

        const tSnap = await getDocs(query(collection(db, 'tasks'), where('clientId', '==', clientId)));
        setTasks(tSnap.docs.map(d => ({id: d.id, ...(d.data() as any)})));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [clientId, isDemo]);

  const updateStatus = async (newStatus: string) => {
    if (!clientId) return;
    setStatus(newStatus);
    if (!isDemo) {
       await updateDoc(doc(db, 'users', clientId), { status: newStatus });
    }
  };

  const saveProfile = async () => {
    if (!clientId) return;
    try {
      if (!isDemo) {
        await updateDoc(doc(db, 'users', clientId), {
           companyName,
           brandInfo,
           rejectReason
        });
      }
      alert('Client profile updated');
    } catch(e) { console.error(e); }
  }

  const saveProject = async () => {
    if (!clientId) return;
    try {
      if (isDemo) {
         setProject({ id: 'demoproj', phase, timeline, agreedPayment: Number(agreed), remainingPayment: Number(remaining) });
         alert('Saved tracking.');
         return;
      }
      if (project) {
        await updateDoc(doc(db, 'projects', project.id), {
          phase, timeline, agreedPayment: Number(agreed), remainingPayment: Number(remaining), updatedAt: serverTimestamp()
        });
        alert('Updated project');
      } else {
        const newProj = await addDoc(collection(db, 'projects'), {
          clientId, name: `${client.displayName}'s Project`, phase, timeline, agreedPayment: Number(agreed), remainingPayment: Number(remaining), createdAt: serverTimestamp(), updatedAt: serverTimestamp()
        });
        setProject({ id: newProj.id });
        alert('Created project');
      }
    } catch(e) {
      console.error(e);
      alert('Error saving project');
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newTask.trim() || !clientId) return;
    try {
      const t = { clientId, title: newTask, completed: false, createdAt: isDemo ? {toMillis: () => Date.now()} : serverTimestamp() };
      if (!isDemo) {
        const res = await addDoc(collection(db, 'tasks'), t);
        setTasks([...tasks, { id: res.id, ...t }]);
      } else {
        setTasks([...tasks, { id: 'demo_' + Date.now(), ...t }]);
      }
      setNewTask('');
    } catch(e) { console.error(e); }
  }

  const toggleTask = async (task: any) => {
    try {
      if (!isDemo) await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !task.completed } : t));
    } catch(e) { console.error(e); }
  }

  const deleteTask = async (id: string) => {
    try {
      if (!isDemo) await deleteDoc(doc(db, 'tasks', id));
      setTasks(tasks.filter(t => t.id !== id));
    } catch(e) { console.error(e); }
  }

  const sendMsg = async (e?: React.FormEvent, text?: string) => {
    if(e) e.preventDefault();
    const msgText = text || newMsg;
    if(!msgText.trim() || !clientId || !currentUser) return;
    const msg = {
      clientId, senderId: currentUser.uid, text: msgText, createdAt: isDemo ? {toMillis: () => Date.now()} : serverTimestamp()
    };
    try {
      if (!isDemo) {
         const docRef = await addDoc(collection(db, 'messages'), msg);
         setMessages([...messages, { id: docRef.id, ...msg, createdAt: { toMillis: () => Date.now() }}]);
      } else {
         setMessages([...messages, { id: 'demo_' + Date.now(), ...msg }]);
      }
      if(!text) setNewMsg('');
    } catch(e) { console.error(e) }
  };

  const saveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!docTitle || !docUrl || !clientId) return;
    setSavingDoc(true);
    try {
      const nd = {
        clientId, projectId: project ? project.id : '', type: docType, title: docTitle, url: docUrl, createdAt: isDemo ? {toMillis: () => Date.now()} : serverTimestamp(), isSigned: false
      };
      if (!isDemo) {
         const dRef = await addDoc(collection(db, 'documents'), nd);
         setDocuments([...documents, { id: dRef.id, ...nd }]);
      } else {
         setDocuments([...documents, { id: 'demo_' + Date.now(), ...nd }]);
      }
      alert('Document saved. Client can now view it.');
      setDocTitle(''); setDocUrl('');
    } catch(e) {
      console.error(e);
      alert('Failed to save document');
    } finally {
      setSavingDoc(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      if (!isDemo) await deleteDoc(doc(db, 'documents', id));
      setDocuments(documents.filter(d => d.id !== id));
    } catch(e) { console.error(e); }
  }

  if (loading) return <div className="text-gray-400 font-medium">Loading...</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <Link to="/clients" className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center text-gray-500 shadow-[0_2px_10px_var(--color-shadow-subtle)] hover:text-gray-900 hover:scale-105 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{client.displayName}</h1>
            <p className="text-[13px] font-semibold text-gray-500 mt-1">{client.email}</p>
          </div>
        </div>
        <div className="hidden sm:flex bg-white rounded-full p-1 shadow-[0_2px_10px_var(--color-shadow-subtle)]">
           {['prospect', 'agreed', 'active', 'lost'].map(s => (
              <button key={s} onClick={() => updateStatus(s)} className={`px-5 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${status === s ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}>
                {s}
              </button>
            ))}
        </div>
      </header>
      
      {/* Mobile status selector */}
      <div className="sm:hidden flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 no-scrollbar">
         {['prospect', 'agreed', 'active', 'lost'].map(s => (
            <button key={s} onClick={() => updateStatus(s)} className={`px-4 py-2 flex-shrink-0 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${status === s ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-400 shadow-sm border border-gray-100 hover:text-gray-900'}`}>
              {s}
            </button>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Setup */}
        <div className="space-y-8">
          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <h3 className="text-[16px] font-extrabold text-gray-900 mb-6">Company Profile</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                <input value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Brand Info / Notes</label>
                <textarea value={brandInfo} onChange={e=>setBrandInfo(e.target.value)} rows={3} placeholder="Mascot is a bird, likes blue colors..." className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 transition-all shadow-sm" />
              </div>
              {status === 'lost' && (
                <div>
                  <label className="block text-[11px] font-bold text-red-500 uppercase tracking-widest mb-2">Rejection Reason</label>
                  <input value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Why did we lose them?" className="w-full bg-red-50 border border-red-100 text-red-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-red-200 transition-all shadow-sm" />
                </div>
              )}
            </div>
            <button onClick={saveProfile} className="text-[13px] font-bold mt-2 flex items-center justify-center px-6 py-3 bg-(--color-btn-dark) text-white rounded-full hover:bg-black transition-colors w-full shadow-sm">Save Profile</button>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <h3 className="text-[16px] font-extrabold text-gray-900 mb-6">Financials & Timeline</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Phase</label>
                <input value={phase} onChange={e=>setPhase(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Timeline Summary</label>
                <input value={timeline} onChange={e=>setTimeline(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Agreed ($)</label>
                  <input type="number" value={agreed} onChange={e=>setAgreed(e.target.value as any)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Remaining ($)</label>
                  <input type="number" value={remaining} onChange={e=>setRemaining(e.target.value as any)} className="w-full bg-red-50 border border-red-100 text-red-600 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white focus:border-red-200 shadow-sm transition-colors" />
                </div>
              </div>
            </div>
            <button onClick={saveProject} className="text-[13px] font-bold mt-2 flex items-center justify-center px-6 py-3 bg-(--color-btn-dark) text-white rounded-full hover:bg-black transition-colors w-full shadow-sm">Save Tracking</button>
          </section>
        </div>

        {/* Middle Col: Tasks and Docs */}
        <div className="space-y-8">
          {/* Tasks */}
          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-extrabold text-gray-900">Project Tasks</h3>
             </div>
             <form onSubmit={addTask} className="flex gap-2 mb-6">
               <input 
                 value={newTask} 
                 onChange={e=>setNewTask(e.target.value)} 
                 placeholder="New task title..." 
                 className="flex-1 w-full bg-gray-50 border border-gray-100 text-gray-900 text-[13px] font-bold py-3 px-4 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 shadow-sm transition-colors" 
               />
               <button 
                 type="submit" 
                 disabled={!newTask.trim()}
                 className="bg-black text-white text-[13px] font-bold px-5 py-3 rounded-[16px] hover:bg-gray-800 transition-colors disabled:opacity-50 shrink-0 shadow-sm"
               >
                 Add
               </button>
             </form>
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {tasks.length === 0 ? (
                  <p className="text-[13px] font-semibold text-gray-400 text-center py-4">No tasks added yet.</p>
               ) : tasks.map(t => (
                 <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-[20px] transition-all hover:shadow-sm hover:border-gray-200 group">
                   <div className="flex items-center cursor-pointer flex-1 gap-4" onClick={() => toggleTask(t)}>
                     <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${t.completed ? 'bg-(--color-accent-mint) border-(--color-accent-mint) text-green-700' : 'bg-white border-gray-200 text-transparent'}`}>
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

          {/* Docs */}
          <section className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)]">
             <h3 className="text-[16px] font-extrabold text-gray-900 mb-6">Manage Documents</h3>
             <form onSubmit={saveDocument} className="space-y-4 mb-8">
                <select value={docType} onChange={e=>setDocType(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white shadow-sm transition-colors">
                  <option value="quotation">Quotation</option>
                  <option value="proposal">Proposal</option>
                  <option value="invoice">Invoice</option>
                  <option value="contract">Contract (Needs Signature)</option>
                  <option value="discovery">Discovery Form</option>
                  <option value="satisfaction">Client Satisfaction Form</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="other">Other</option>
                </select>
                <input placeholder="Doc Title" value={docTitle} onChange={e=>setDocTitle(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white shadow-sm transition-colors" />
                <input placeholder="Document URL (https://...)" value={docUrl} onChange={e=>setDocUrl(e.target.value)} required type="url" className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold text-[13px] px-4 py-3.5 rounded-[16px] focus:outline-none focus:bg-white shadow-sm transition-colors" />
                <button type="submit" disabled={savingDoc} className="text-[13px] font-bold mt-2 flex items-center justify-center px-6 py-3 bg-(--color-btn-dark) text-white rounded-full hover:bg-black transition-colors w-full shadow-sm disabled:opacity-50">
                  Share Document
                </button>
             </form>
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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

        {/* Right Col: Chat Logs */}
        <section className="bg-white rounded-[32px] shadow-[0_2px_20px_var(--color-shadow-subtle)] flex flex-col h-[800px] overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <h3 className="text-[16px] font-extrabold text-gray-900">Communication</h3>
            <button 
              onClick={() => sendMsg(undefined, "Hello! This is our automated monthly check-in. Just wanted to see if your website is running smoothly or if you need any adjustments or new features crafted! Let us know.")}
              className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Mail size={14} /> Sync
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-4 bg-gray-50/30 custom-scrollbar">
            {messages.map(m => {
               const isAdminMsg = m.senderId === currentUser?.uid;
               return (
                 <div key={m.id} className={`max-w-[85%] p-4 text-[13px] font-bold leading-relaxed shadow-sm ${isAdminMsg ? 'ml-auto bg-black text-white rounded-[20px] rounded-tr-[4px]' : 'bg-white border border-gray-200 text-gray-900 rounded-[20px] rounded-tl-[4px]'}`}>
                   <p>{m.text}</p>
                   <span className={`text-[10px] mt-2 block font-bold text-gray-400`}>{m.createdAt?.toMillis ? format(m.createdAt.toMillis(), 'h:mm a') : ''}</span>
                 </div>
               )
            })}
          </div>
          <form onSubmit={(e) => sendMsg(e)} className="p-6 sm:p-8 bg-white border-t border-gray-100 z-10">
             <div className="relative flex items-center">
               <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} type="text" placeholder="Message client..." className="w-full bg-gray-50 border border-gray-100 rounded-[16px] pl-5 pr-14 py-3.5 text-[13px] font-bold focus:outline-none focus:bg-white focus:border-gray-200 text-gray-900 shadow-sm transition-colors" />
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
