import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CollectionKey, FileRef } from './types';
import {
  seedDocuments, seedRphs, seedHeadcounts, seedNotas, seedLatihans,
  seedPrograms, seedOrgMembers, seedAnnouncements,
} from './seed';

const STORAGE_KEY = 'portal-fizik-math-v1';

type DataShape = {
  documents: typeof seedDocuments;
  rphs: typeof seedRphs;
  headcounts: typeof seedHeadcounts;
  notas: typeof seedNotas;
  latihans: typeof seedLatihans;
  programs: typeof seedPrograms;
  orgMembers: typeof seedOrgMembers;
  announcements: typeof seedAnnouncements;
};

interface StoreCtx {
  data: DataShape;
  addItem: <K extends CollectionKey>(key: K, item: DataShape[K][number]) => void;
  updateItem: <K extends CollectionKey>(key: K, id: string, patch: Partial<DataShape[K][number]>) => void;
  removeItem: <K extends CollectionKey>(key: K, id: string) => void;
  fileToRef: (file: File) => Promise<FileRef>;
  notify: (msg: string, type?: 'success' | 'error') => void;
  toast: { msg: string; type: 'success' | 'error' } | null;
  confirm: (msg: string, onYes: () => void) => void;
  confirmState: { msg: string; onYes: () => void } | null;
}

const Ctx = createContext<StoreCtx | null>(null);

function kindOf(file: File): FileRef['kind'] {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.includes('word') || file.name.endsWith('.docx')) return 'docx';
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'none';
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataShape>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {
      documents: seedDocuments, rphs: seedRphs, headcounts: seedHeadcounts,
      notas: seedNotas, latihans: seedLatihans, programs: seedPrograms,
      orgMembers: seedOrgMembers, announcements: seedAnnouncements,
    };
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [confirmState, setConfirmState] = useState<{ msg: string; onYes: () => void } | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* quota */ }
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo<StoreCtx>(() => ({
    data,
    addItem: (key, item) => setData((d) => ({ ...d, [key]: [...d[key], item] })),
    updateItem: (key, id, patch) =>
      setData((d) => ({ ...d, [key]: (d[key] as { id: string }[]).map((it) => (it.id === id ? { ...it, ...patch } : it)) })),
    removeItem: (key, id) =>
      setData((d) => ({ ...d, [key]: (d[key] as { id: string }[]).filter((it) => it.id !== id) })),
    fileToRef: (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: String(reader.result), kind: kindOf(file) });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
    notify: (msg, type = 'success') => setToast({ msg, type }),
    toast,
    confirm: (msg, onYes) => setConfirmState({ msg, onYes }),
    confirmState,
  }), [data, toast, confirmState]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}
      {confirmState && (
        <div className="fixed inset-0 z-[100] bg-navy/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <p className="text-slate-700 mb-5">{confirmState.msg}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmState(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-50">Batal</button>
              <button onClick={() => { confirmState.onYes(); setConfirmState(null); }} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">Padam</button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
