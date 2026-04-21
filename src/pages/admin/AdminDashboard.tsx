import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, CreditCard, DollarSign, ToggleLeft, ToggleRight, Loader2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../components/authprovider/authprovider';

export default function AdminDashboard() {
  const { isDemo } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    totalRevenue: 0,
    totalExpenses: 0
  });
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(true);
  
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (isDemo) {
        setStats({
          totalClients: 1293,
          activeProjects: 857,
          totalRevenue: 256000,
          totalExpenses: 8400
        });
        setRecentClients([
          { id: '1', displayName: 'Gladys', email: 'hello@acme.com', status: 'active' },
          { id: '2', displayName: 'Elbert', email: 'ceo@globex.com', status: 'agreed' },
          { id: '3', displayName: 'Dash', email: 'contact@initech.com', status: 'prospect' },
          { id: '4', displayName: 'Joyce', email: 'foo@bar.com', status: 'active' },
          { id: '5', displayName: 'Marina', email: 'baz@qux.com', status: 'active' },
        ]);
        setExpenses([
          { id: '1', amount: 3250, description: 'Crypter - NFT UI Kit', createdAt: { toMillis: () => Date.now() - 86400000 } },
          { id: '2', amount: 7890, description: 'Bento Pro 2.0 Illustrations', createdAt: { toMillis: () => Date.now() - 86400000 * 2 } },
          { id: '3', amount: 1500, description: 'Fleet - travel shopping kit', createdAt: { toMillis: () => Date.now() - 86400000 * 5 } },
          { id: '4', amount: 9999, description: 'SimpleSocial UI Design Kit', createdAt: { toMillis: () => Date.now() - 86400000 * 10 } },
        ]);
        setLoading(false);
        return;
      }

      try {
        const usersSnap = await getDocs(query(collection(db, 'users')));
        const projectsSnap = await getDocs(query(collection(db, 'projects')));
        const expSnap = await getDocs(query(collection(db, 'expenses')));
        
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
           setIsWorking(settingsSnap.data().isWorking !== false);
        }

        let clientsCount = 0;
        const clients: any[] = [];
        usersSnap.forEach(d => {
          const data = d.data();
          if (data.role === 'client') {
            clientsCount++;
            clients.push({ id: d.id, ...data });
          }
        });

        let revenue = 0;
        let active = 0;
        projectsSnap.forEach(d => {
          const data = d.data();
          revenue += (data.agreedPayment || 0);
          if (data.phase !== 'Completed') {
              active++;
          }
        });

        let expTotal = 0;
        const expList: any[] = [];
        expSnap.forEach(d => {
           expTotal += d.data().amount || 0;
           expList.push({ id: d.id, ...(d.data() as any) });
        });

        setStats({
          totalClients: clientsCount,
          activeProjects: active,
          totalRevenue: revenue,
          totalExpenses: expTotal
        });
        
        setExpenses(expList.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).slice(0, 5));
        clients.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setRecentClients(clients.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isDemo]);

  const toggleWorkingStatus = async () => {
     try {
       const nextStat = !isWorking;
       setIsWorking(nextStat);
       if (!isDemo) {
         await setDoc(doc(db, 'settings', 'global'), { isWorking: nextStat }, { merge: true });
       }
     } catch(e) { console.error(e) }
  }

  const addExpense = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!expAmount || !expDesc) return;
     try {
       const ex = { amount: Number(expAmount), description: expDesc, createdAt: isDemo ? { toMillis: () => Date.now() } : serverTimestamp() };
       if (!isDemo) {
         const res = await addDoc(collection(db, 'expenses'), ex);
         setExpenses([{id: res.id, ...ex, createdAt: {toMillis: () => Date.now()}}, ...expenses].slice(0,5));
       } else {
         setExpenses([{id: 'demo_' + Date.now(), ...ex}, ...expenses].slice(0,5));
       }
       setStats({...stats, totalExpenses: stats.totalExpenses + Number(expAmount)});
       setExpAmount(''); setExpDesc('');
     } catch(e) { console.error(e) }
  }

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center text-gray-500 font-medium"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-20 overflow-x-hidden md:overflow-visible">
      {/* Left Column */}
      <div className="md:col-span-8 flex flex-col gap-6">
        
        {/* Header row equivalent */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-extrabold text-gray-900">Overview</h3>
          <button onClick={toggleWorkingStatus} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${isWorking ? 'bg-white text-gray-900 shadow-sm border border-gray-100 hover:bg-gray-50' : 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'}`}>
             {isWorking ? <ToggleRight size={16} className="text-(--color-accent-green)" /> : <ToggleLeft size={16} />}
             {isWorking ? "Agency Active" : "Out of Office"}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-gray-900" size={20} />
              <h4 className="text-[15px] font-bold text-gray-900">Customers</h4>
            </div>
            <div className="flex items-end gap-4 mt-2">
              <p className="text-5xl font-extrabold text-gray-900 tracking-tight">{stats.totalClients.toLocaleString()}</p>
              <div className="bg-red-50 text-red-500 text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center gap-1">
                 ↓ 2.1%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_var(--color-shadow-subtle)]">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-gray-900" size={20} />
              <h4 className="text-[15px] font-bold text-gray-900">Balance</h4>
            </div>
            <div className="flex flex-wrap items-end gap-4 mt-2">
              <p className="text-5xl font-extrabold text-gray-900 tracking-tight">{stats.totalRevenue > 999 ? (stats.totalRevenue/1000).toFixed(0)+'k' : stats.totalRevenue}</p>
              <div className="bg-green-50 text-green-500 text-[11px] font-bold px-2 py-1 rounded-md mb-2 flex items-center gap-1 shrink-0">
                 ↑ 36.8%
              </div>
            </div>
          </div>
        </div>

        {/* Avatars Row */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_var(--color-shadow-subtle)] mt-2">
           <h4 className="text-[15px] font-extrabold text-gray-900 mb-1">{stats.activeProjects} active projects running</h4>
           <p className="text-[13px] font-semibold text-gray-400 mb-8">Send a welcome message to all new customers.</p>
           
           <div className="flex items-center gap-[3%] sm:gap-[5%] overflow-x-auto pb-2 justify-between px-2 w-full">
              {recentClients.map((c, i) => (
                <div key={c.id || i} className="text-center flex flex-col items-center flex-shrink-0">
                   <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 mb-3 flex items-center justify-center font-extrabold text-gray-900 text-lg overflow-hidden border border-gray-200">
                     {c.displayName?.charAt(0)}
                   </div>
                   <p className="text-[11px] sm:text-[12px] font-bold text-gray-600">{c.displayName?.split(' ')[0]}</p>
                </div>
              ))}
              <div className="text-center flex flex-col items-center flex-shrink-0">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm cursor-pointer mb-3 hover:bg-gray-50 transition-colors">
                    <ArrowRight size={18} />
                 </div>
                 <p className="text-[11px] sm:text-[12px] font-bold text-gray-600">View all</p>
              </div>
           </div>
        </div>

        {/* Product View Chart Mockup */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_var(--color-shadow-subtle)] mt-2 flex flex-col relative h-[360px]">
           <div className="flex justify-between items-center z-10 relative">
              <h4 className="text-[15px] font-extrabold text-gray-900">Product view</h4>
              <button className="bg-white border border-gray-200 text-gray-500 text-[12px] font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:text-gray-900 transition-colors shadow-sm shrink-0">
                 Last 7 days
              </button>
           </div>

           <div className="absolute left-8 bottom-10 z-10 space-y-1">
              <h2 className="text-[40px] sm:text-5xl font-extrabold text-(--color-text-ghost) tracking-tighter opacity-80">${(stats.totalRevenue > 0 ? stats.totalRevenue / 1000000 : 0).toFixed(1)}m</h2>
           </div>

           {/* Fake Bar Chart */}
           <div className="flex items-end justify-end h-full w-full gap-2 sm:gap-4 md:gap-6 pt-16 z-0 relative pr-4">
              <div className="w-10 sm:w-14 bg-gray-100 rounded-t-[12px] h-[30%] hidden sm:block"></div>
              <div className="w-10 sm:w-14 bg-gray-100 rounded-t-[12px] h-[45%]"></div>
              <div className="w-10 sm:w-14 bg-gray-100 rounded-t-[12px] h-[60%]"></div>
              
              <div className="w-12 sm:w-16 bg-(--color-accent-mint) rounded-t-[12px] h-[85%] relative flex flex-col items-center shadow-[0_0_20px_var(--color-accent-mint-glow)]">
                 <div className="w-3 h-3 bg-white rounded-full border-[3px] border-(--color-accent-green) absolute -top-8"></div>
                 <div className="absolute -top-16 bg-(--color-tooltip-bg) text-white text-[11px] font-bold px-2 py-1 rounded-[8px]">
                    2.2m
                 </div>
              </div>

              <div className="w-10 sm:w-14 bg-gray-100 rounded-t-[12px] h-[40%]"></div>
              <div className="w-10 sm:w-14 bg-gray-100 rounded-t-[12px] h-[65%]"></div>
           </div>
           
           {/* Fade out bottom overlay for the bars */}
           <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-0 pointer-events-none rounded-b-[32px]"></div>
        </div>

      </div>

      {/* Right Column */}
      <div className="md:col-span-4 flex flex-col gap-6 w-full max-w-[400px] mx-auto md:max-w-none">
        
        {/* Recent Expenses (Popular products equivalent) */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_2px_20px_var(--color-shadow-subtle)] md:mt-[45px]">
          <h4 className="text-[16px] font-extrabold text-gray-900 mb-6">Recent Expenses</h4>
          <div className="space-y-6">
             {expenses.length === 0 ? (
                <p className="text-sm font-semibold text-gray-400">No expenses recorded.</p>
             ) : expenses.map((ex, i) => {
                const colors = ['bg-(--color-expense-1)', 'bg-(--color-expense-2)', 'bg-(--color-expense-3)', 'bg-(--color-expense-4)'];
                const cardColor = colors[i % colors.length];
                return (
                  <div key={ex.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4 min-w-0">
                       <div className={`w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-[16px] ${cardColor} bg-opacity-20 flex items-center justify-center border border-white shadow-sm flex-shrink-0 relative overflow-hidden`}>
                          <div className={`absolute bottom-0 right-0 w-full h-1/2 ${cardColor} opacity-40 blur-[8px]`}></div>
                          <DollarSign size={20} className={`${cardColor.replace('bg-','text-')}`} />
                       </div>
                       <div className="min-w-0">
                         <p className="text-[13px] font-extrabold text-gray-900 leading-tight mb-1 truncate">{ex.description}</p>
                       </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                       <p className="text-[13px] font-extrabold text-gray-900 mb-1">${ex.amount.toLocaleString()}</p>
                       <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[6px] ${i%3 === 2 ? 'text-red-500 bg-red-50' : 'text-green-500 bg-(--color-accent-mint)/30'}`}>
                         {i%3 === 2 ? 'Offline' : 'Active'}
                       </span>
                    </div>
                  </div>
                )
             })}
          </div>
          <button className="w-full mt-8 py-3 border border-gray-100 rounded-full text-[13px] font-bold text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all text-center">
             All expenses
          </button>
        </div>

        {/* Log Expense Form (Comments equivalent) */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_2px_20px_var(--color-shadow-subtle)]">
          <h4 className="text-[16px] font-extrabold text-gray-900 mb-6">Log Expense</h4>
          <form onSubmit={addExpense} className="flex flex-col gap-3">
             <input required type="number" placeholder="$ Amount" value={expAmount} onChange={e=>setExpAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-[13px] font-bold py-3 px-4 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 transition-colors shadow-sm" />
             <input required type="text" placeholder="Description..." value={expDesc} onChange={e=>setExpDesc(e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-[13px] font-bold py-3 px-4 rounded-[16px] focus:outline-none focus:bg-white focus:border-gray-200 transition-colors shadow-sm" />
             <button type="submit" className="w-full bg-black text-white text-[13px] font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-sm mt-2">
                Submit Log
             </button>
          </form>
        </div>

      </div>
    </div>
  );
}
