import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/authprovider/authprovider';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ExternalLink, FileText, Download, Loader2, Presentation, FileCheck2, FileHeart, FolderOpen, PenTool } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../components/layout/layout';

export default function Documents() {
  const { user, appUser, isDemo } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Signing State
  const [signingDoc, setSigningDoc] = useState<any>(null);
  const [signatureName, setSignatureName] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user || !appUser) return;
      if (isDemo) {
        setDocuments([
          { id: '1', type: 'contract', title: 'Service Agreement', url: '#', createdAt: { toMillis: () => Date.now() - 86400000 } },
          { id: '2', type: 'proposal', title: 'Project Proposal 2026', url: '#', createdAt: { toMillis: () => Date.now() - 86400000 * 5 } },
          { id: '3', type: 'invoice', title: 'Initial Deposit Invoice', url: '#', createdAt: { toMillis: () => Date.now() - 86400000 * 10 } },
        ]);
        setLoading(false);
        return;
      }
      try {
        let q;
        if (appUser.role === 'admin') {
          // Admin sees all docs
          q = query(collection(db, 'documents'));
        } else {
          // Client sees their docs and global onboarding
          q = query(collection(db, 'documents'), where('clientId', 'in', [user.uid, 'global']));
        }
        
        const snap = await getDocs(q);
        const docsList = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        // sort by newest
        docsList.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setDocuments(docsList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user, appUser, isDemo]);

  const signDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingDoc || !signatureName.trim() || !user) return;
    try {
      if (!isDemo) {
        await updateDoc(doc(db, 'documents', signingDoc.id), {
           isSigned: true,
           signatureData: {
             name: signatureName,
             uid: user.uid,
             timestamp: new Date().toISOString()
           }
        });
      }
      setDocuments(documents.map(d => d.id === signingDoc.id ? { ...d, isSigned: true, signatureData: { name: signatureName } } : d));
      setSigningDoc(null);
      setSignatureName('');
      alert("Contract signed successfully!");
    } catch(err) {
      console.error(err);
      alert("Failed to sign contract.");
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'quotation': return <span className="font-extrabold text-2xl">Q</span>;
      case 'proposal': return <Presentation className="text-gray-400 w-6 h-6 flex-shrink-0" />;
      case 'invoice': return <FileCheck2 className="text-green-500 w-6 h-6 flex-shrink-0" />;
      case 'onboarding': return <FileHeart className="text-red-500 w-6 h-6 flex-shrink-0" />;
      case 'contract': return <PenTool className="text-purple-500 w-6 h-6 flex-shrink-0" />;
      default: return <FileText className="text-gray-400 w-6 h-6 flex-shrink-0" />;
    }
  }

  return (
    <Layout title="Documents">
      <div className="space-y-6 max-w-[1200px] mx-auto w-full">
        <div className="flex justify-end mb-6">
           <p className="text-gray-500 font-medium text-sm">All relevant files and agreements for your project.</p>
      </div>

      {signingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[28px] max-w-md w-full shadow-2xl">
             <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Sign Contract</h3>
             <p className="text-sm font-medium text-gray-500 mb-6">By typing your name below, you electronically sign the document: <span className="font-bold text-gray-900">{signingDoc.title}</span></p>
             <form onSubmit={signDocument} className="space-y-4">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Legal Name</label>
                   <input required value={signatureName} onChange={e=>setSignatureName(e.target.value)} type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium py-3 px-4 rounded-[12px] focus:outline-none focus:border-gray-400 font-sans" placeholder="John Doe" />
                </div>
                <div className="flex gap-3 pt-4">
                   <button type="button" onClick={() => setSigningDoc(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-extrabold uppercase tracking-widest rounded-full transition-colors">Cancel</button>
                   <button type="submit" className="flex-1 py-3 bg-black hover:bg-gray-800 text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-colors">Confirm & Sign</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-[400px] items-center justify-center text-gray-400 font-medium">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 rounded-[28px] text-center shadow-sm">
           <FolderOpen className="mx-auto text-gray-300 mb-4 h-12 w-12" />
           <h2 className="text-lg font-bold text-gray-900">No documents yet</h2>
           <p className="text-gray-500 mt-2 font-medium text-sm">When documents are shared they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => {
            const isContract = doc.type === 'contract';
            const pendingSignature = isContract && !doc.isSigned;
            return (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-[28px] p-6 hover:shadow-lg transition-all group flex flex-col justify-between h-full hover:border-gray-300 relative">
               {pendingSignature && (
                  <span className="absolute -top-3 -right-3 bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-purple-200 shadow-sm animate-pulse">Action Required</span>
               )}
               {isContract && doc.isSigned && (
                  <span className="absolute -top-3 -right-3 bg-green-100 text-green-700 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-green-200 shadow-sm">Signed</span>
               )}
               <div>
                 <div className="flex justify-between items-start mb-6">
                   <div className="h-12 w-12 rounded-[14px] bg-gray-50 border border-gray-100 flex items-center justify-center font-extrabold text-gray-900 flex-shrink-0">
                     {getIcon(doc.type)}
                   </div>
                   <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-[8px]">
                     {doc.type}
                   </span>
                 </div>
                 <h3 className="text-lg font-extrabold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
                   {doc.createdAt ? format(doc.createdAt.toMillis(), 'MMM dd, yyyy') : 'Unknown date'}
                 </p>
               </div>
               
               <div className="mt-auto flex flex-col gap-2">
                 <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full px-6 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 font-bold text-xs rounded-[16px] hover:bg-gray-100 transition-colors shadow-sm">
                   Open Document
                   <ExternalLink size={14} className="ml-2 opacity-80" />
                 </a>
                 {pendingSignature && appUser?.role === 'client' && (
                    <button onClick={() => setSigningDoc(doc)} className="flex items-center justify-center w-full px-6 py-3.5 bg-black text-white font-extrabold text-xs uppercase tracking-widest rounded-[16px] hover:bg-gray-800 transition-colors shadow-sm">
                      Sign Now
                    </button>
                 )}
               </div>
            </div>
          )})}
        </div>
      )}
      </div>
    </Layout>
  );
}
