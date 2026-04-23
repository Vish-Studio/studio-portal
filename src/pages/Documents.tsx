import React, { useState } from 'react';
import { ExternalLink, FileText, Loader2, Presentation, FileCheck2, FileHeart, FolderOpen, PenTool } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../components/layout/layout';
import { useDocumentsStore } from '../store/documents';
import type { StudioDocument } from '../store/documents';

export default function Documents() {
  const { documents, signDocument } = useDocumentsStore();
  const [signingDoc, setSigningDoc] = useState<StudioDocument | null>(null);
  const [signatureName, setSignatureName] = useState('');

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingDoc || !signatureName.trim()) return;
    signDocument(signingDoc.id, signatureName);
    setSigningDoc(null);
    setSignatureName('');
    alert('Contract signed successfully!');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'quotation':   return <span className="font-extrabold text-2xl">Q</span>;
      case 'proposal':    return <Presentation className="text-gray-400 w-6 h-6 shrink-0" />;
      case 'invoice':     return <FileCheck2 className="text-green-500 w-6 h-6 shrink-0" />;
      case 'onboarding':  return <FileHeart className="text-red-500 w-6 h-6 shrink-0" />;
      case 'contract':    return <PenTool className="text-purple-500 w-6 h-6 shrink-0" />;
      default:            return <FileText className="text-gray-400 w-6 h-6 shrink-0" />;
    }
  };

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
              <p className="text-sm font-medium text-gray-500 mb-6">
                By typing your name below, you electronically sign:{' '}
                <span className="font-bold text-gray-900">{signingDoc.title}</span>
              </p>
              <form onSubmit={handleSign} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Legal Name</label>
                  <input
                    required value={signatureName} onChange={e => setSignatureName(e.target.value)}
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium py-3 px-4 rounded-[12px] focus:outline-none focus:border-gray-400 font-sans"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setSigningDoc(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-extrabold uppercase tracking-widest rounded-full transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-black hover:bg-gray-800 text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-colors">Confirm & Sign</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 rounded-[28px] text-center shadow-sm">
            <FolderOpen className="mx-auto text-gray-300 mb-4 h-12 w-12" />
            <h2 className="text-lg font-bold text-gray-900">No documents yet</h2>
            <p className="text-gray-500 mt-2 font-medium text-sm">When documents are shared they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(document => {
              const isContract = document.type === 'contract';
              const pendingSignature = isContract && !document.isSigned;
              return (
                <div key={document.id} className="bg-white border border-gray-200 rounded-[28px] p-6 hover:shadow-lg transition-all group flex flex-col justify-between h-full hover:border-gray-300 relative">
                  {pendingSignature && (
                    <span className="absolute -top-3 -right-3 bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-purple-200 shadow-sm animate-pulse">
                      Action Required
                    </span>
                  )}
                  {isContract && document.isSigned && (
                    <span className="absolute -top-3 -right-3 bg-green-100 text-green-700 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-green-200 shadow-sm">
                      Signed
                    </span>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-12 w-12 rounded-[14px] bg-gray-50 border border-gray-100 flex items-center justify-center font-extrabold text-gray-900 shrink-0">
                        {getIcon(document.type)}
                      </div>
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-[8px]">
                        {document.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2 leading-tight group-hover:text-gray-700 transition-colors">
                      {document.title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
                      {document.createdAt ? format(document.createdAt.toMillis(), 'MMM dd, yyyy') : 'Unknown date'}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <a href={document.url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full px-6 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 font-bold text-xs rounded-[16px] hover:bg-gray-100 transition-colors shadow-sm">
                      Open Document
                      <ExternalLink size={14} className="ml-2 opacity-80" />
                    </a>
                    {pendingSignature && (
                      <button onClick={() => setSigningDoc(document)} className="flex items-center justify-center w-full px-6 py-3.5 bg-black text-white font-extrabold text-xs uppercase tracking-widest rounded-[16px] hover:bg-gray-800 transition-colors shadow-sm">
                        Sign Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
