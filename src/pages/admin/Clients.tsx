import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../../components/authprovider/authprovider';
import { useClientsStore } from '../../store/clients';
import DataTable, { type Column } from '../../components/table/table';
import type { Client } from '../../store/clients';

export default function Clients() {
  const { isDemo } = useAuth();
  const { clients, setClients, addClient } = useClientsStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientName, setNewClientName] = useState('');

  useEffect(() => {
    if (isDemo) { setLoading(false); return; }
    const fetchClients = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'users')));
        const cList: Client[] = [];
        snap.forEach(d => {
          if (d.data().role === 'client') cList.push({ id: d.id, ...(d.data() as any) });
        });
        setClients(cList.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [isDemo]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientEmail) return;
    const now = { toMillis: () => Date.now(), toDate: () => new Date() };
    const newClient: Client = {
      id: 'demo_' + Date.now(),
      email: newClientEmail,
      displayName: newClientName || newClientEmail.split('@')[0],
      role: 'client',
      status: 'prospect',
      createdAt: now,
    };
    try {
      if (!isDemo) {
        const res = await addDoc(collection(db, 'users'), {
          email: newClientEmail,
          displayName: newClientName || newClientEmail.split('@')[0],
          role: 'client',
          status: 'prospect',
          createdAt: serverTimestamp(),
        });
        newClient.id = res.id;
      }
      addClient(newClient);
      setShowAddForm(false);
      setNewClientEmail('');
      setNewClientName('');
    } catch (err) {
      console.error(err);
      alert('Failed to add client. Check permissions.');
    }
  };

  const filtered = clients.filter(c =>
    c.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<Client>[] = [
    {
      key: 'displayName',
      label: 'Client',
      render: row => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-[14px] bg-black flex items-center justify-center text-white font-bold opacity-90 group-hover:opacity-100 transition-opacity shrink-0">
            {row.displayName?.charAt(0) || '?'}
          </div>
          <div>
            <div className="text-base font-bold text-gray-900 whitespace-nowrap">{row.displayName}</div>
            <div className="text-xs font-semibold text-gray-500 mt-0.5 whitespace-nowrap">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap
          ${row.status === 'active' ? 'bg-green-100 text-green-700' :
            row.status === 'agreed' ? 'bg-blue-100 text-blue-700' :
            row.status === 'lost' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      hideBelow: 'sm',
      render: row => (
        <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
          {row.createdAt?.toDate ? format(row.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: row => (
        row.id.startsWith('demo_') || isDemo ? (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Demo Record</span>
        ) : (
          <Link
            to={`/clients/${row.id}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-black text-white font-bold text-xs rounded-[12px] hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
          >
            Manage Space
          </Link>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Toolbar */}
      <div className="flex gap-4 items-center justify-end">
        <div className="relative flex-1 sm:max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Filter clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-gray-900 text-sm font-medium rounded-full py-3.5 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddForm(v => !v)}
          className="bg-black text-white p-3.5 rounded-full hover:bg-gray-800 transition-colors shadow-md shrink-0"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Inline add form */}
      {showAddForm && (
        <form
          onSubmit={handleAddClient}
          className="bg-white border border-gray-200 p-6 rounded-[28px] shadow-sm flex flex-col sm:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
            <input
              type="text"
              value={newClientName}
              onChange={e => setNewClientName(e.target.value)}
              placeholder="Company or Name"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm py-3 px-4 rounded-[12px] focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
            <input
              type="email"
              value={newClientEmail}
              onChange={e => setNewClientEmail(e.target.value)}
              required
              placeholder="client@example.com"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm py-3 px-4 rounded-[12px] focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!newClientEmail}
            className="bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-[12px] hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            Add Lead
          </button>
        </form>
      )}

      {/* Table */}
      <DataTable<Client>
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No clients found."
      />
    </div>
  );
}
