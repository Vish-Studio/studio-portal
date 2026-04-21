import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../../components/authprovider/authprovider';

export default function Clients() {
  const { isDemo } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientName, setNewClientName] = useState('');

  const fetchClients = async () => {
    if (isDemo) {
      setClients([
        { id: '1', displayName: 'Acme Corp', email: 'hello@acme.com', status: 'active', createdAt: { toMillis: () => Date.now() - 86400000 * 5, toDate: () => new Date(Date.now() - 86400000 * 5) } },
        { id: '2', displayName: 'Globex', email: 'ceo@globex.com', status: 'agreed', createdAt: { toMillis: () => Date.now() - 86400000 * 10, toDate: () => new Date(Date.now() - 86400000 * 10) } },
        { id: '3', displayName: 'Initech', email: 'contact@initech.com', status: 'prospect', createdAt: { toMillis: () => Date.now() - 86400000 * 15, toDate: () => new Date(Date.now() - 86400000 * 15) } },
        { id: '4', displayName: 'Stark Industries', email: 'tony@stark.com', status: 'lost', createdAt: { toMillis: () => Date.now() - 86400000 * 30, toDate: () => new Date(Date.now() - 86400000 * 30) } },
      ]);
      setLoading(false);
      return;
    }
    try {
      const snap = await getDocs(query(collection(db, 'users')));
      const cList: any[] = [];
      snap.forEach(d => {
        if (d.data().role === 'client') {
           cList.push({ id: d.id, ...(d.data() as any) });
        }
      });
      setClients(cList.sort((a,b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [isDemo]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newClientEmail) return;
    try {
      if (isDemo) {
        setClients([{
          id: 'demo_' + Date.now(),
          email: newClientEmail,
          displayName: newClientName || newClientEmail.split('@')[0],
          role: 'client',
          status: 'prospect',
          createdAt: { toMillis: () => Date.now(), toDate: () => new Date() }
        }, ...clients]);
      } else {
        await addDoc(collection(db, 'users'), {
          email: newClientEmail,
          displayName: newClientName || newClientEmail.split('@')[0],
          role: 'client',
          status: 'prospect',
          createdAt: serverTimestamp()
        });
        fetchClients();
      }
      setShowAddForm(false);
      setNewClientEmail('');
      setNewClientName('');
    } catch(err) {
      console.error(err);
      alert('Failed to add client. Check permissions.');
    }
  }

  const filtered = clients.filter(c => c.displayName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-end mb-6 space-y-4 sm:space-y-0">
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-gray-900 text-sm font-medium rounded-full py-3.5 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-sans"
            />
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-black text-white p-3.5 rounded-full hover:bg-gray-800 transition-colors shadow-md">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 p-6 rounded-[28px] mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
            <input type="text" value={newClientName} onChange={e=>setNewClientName(e.target.value)} placeholder="Company or Name" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm py-3 px-4 rounded-[12px] focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all font-sans" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
            <input type="email" value={newClientEmail} onChange={e=>setNewClientEmail(e.target.value)} required placeholder="client@example.com" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm py-3 px-4 rounded-[12px] focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all font-sans" />
          </div>
          <button onClick={handleAddClient} disabled={!newClientEmail} className="bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-[12px] hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto h-auto">Add Lead</button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-[28px] overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-left text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Client</th>
              <th className="px-8 py-5 text-left text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-left text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Joined</th>
              <th className="px-8 py-5 text-right text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium text-sm">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium text-sm">No clients found.</td></tr>
            ) : filtered.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-[14px] bg-black flex items-center justify-center text-white font-bold opacity-90 group-hover:opacity-100 transition-opacity">
                      {client.displayName?.charAt(0) || '?'}
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-bold text-gray-900">{client.displayName}</div>
                      <div className="text-xs font-semibold text-gray-500 mt-0.5">{client.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                    ${client.status === 'active' ? 'bg-green-100 text-green-700' :
                      client.status === 'agreed' ? 'bg-blue-100 text-blue-700' :
                      client.status === 'lost' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                    {client.status || 'prospect'}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-500">
                  {client.createdAt?.toDate ? format(client.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right">
                  {client.id.startsWith('demo_') || isDemo ? (
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Demo Record</div>
                  ) : (
                    <Link to={`/clients/${client.id}`} className="inline-flex items-center justify-center px-5 py-2.5 bg-black text-white font-bold text-xs rounded-[12px] hover:bg-gray-800 transition-colors shadow-sm">
                      Manage Space
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
