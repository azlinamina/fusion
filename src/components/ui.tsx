import React, { useState } from 'react';
import { Search, X, Eye, Download, FileText, Image as ImageIcon, Video, File as FileIcon, Trash2, Pencil, Plus, Loader2 } from 'lucide-react';
import type { FileRef, Subject } from '../types';
import { cn } from '../utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('bg-white rounded-2xl border border-slate-200/70 shadow-sm', className)}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Cari...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 py-2.5 w-full sm:w-72 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple/40 focus:border-purple"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function Select({ value, onChange, options, className, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; className?: string; placeholder?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn('px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple/40', className)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function SubjectTabs({ value, onChange }: { value: Subject | 'Semua'; onChange: (v: Subject | 'Semua') => void }) {
  const opts: (Subject | 'Semua')[] = ['Semua', 'Fizik', 'Matematik'];
  return (
    <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
            value === o ? 'bg-navy text-white shadow' : 'text-slate-600 hover:text-navy'
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: 'slate' | 'green' | 'purple' | 'teal' | 'amber' | 'red' }) {
  const map = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-green/15 text-emerald-700',
    purple: 'bg-purple/15 text-purple',
    teal: 'bg-teal/15 text-teal',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-600',
  };
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', map[color])}>{children}</span>;
}

export function EmptyState({ title = 'Tiada data', subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="text-center py-14 text-slate-400">
      <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p className="font-medium text-slate-500">{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

export function FileActions({ file, label = 'Dokumen' }: { file?: FileRef; label?: string }) {
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!file) return <span className="text-xs text-slate-400">Tiada fail</span>;

  const src = file.data || file.url || '';
  const isPreviewable = file.kind === 'pdf' || file.kind === 'image' || file.kind === 'video' || file.kind === 'none';
  const downloadHref = file.data ? file.data : (file.url ?? '#');

  return (
    <>
      <div className="flex items-center gap-1.5">
        <FileKindIcon kind={file.kind} />
        <span className="text-xs text-slate-500 truncate max-w-[140px]">{file.name}</span>
        {isPreviewable && src && (
          <button onClick={() => setPreview(true)} className="p-1.5 rounded-lg text-teal hover:bg-teal/10" title={`Lihat ${label}`}>
            <Eye className="w-4 h-4" />
          </button>
        )}
        {src && file.kind !== 'video' && (
          <a href={downloadHref} download={file.name} className="p-1.5 rounded-lg text-purple hover:bg-purple/10" title={`Muat turun ${label}`}>
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
      {preview && (
        <Modal title={file.name} onClose={() => setPreview(false)} wide>
          {file.kind === 'image' ? (
            <img src={src} alt={file.name} className="max-w-full rounded-lg" />
          ) : file.kind === 'video' ? (
            <video src={src} controls className="w-full rounded-lg" />
          ) : (
            <iframe src={src} title={file.name} className="w-full h-[70vh] rounded-lg border" />
          )}
          {loading && <Loader2 className="animate-spin" />}
        </Modal>
      )}
    </>
  );
}

export function FileKindIcon({ kind }: { kind: FileRef['kind'] }) {
  const cls = 'w-4 h-4 text-slate-400';
  if (kind === 'pdf') return <FileText className={cn(cls, 'text-red-500')} />;
  if (kind === 'image') return <ImageIcon className={cn(cls, 'text-purple')} />;
  if (kind === 'video') return <Video className={cn(cls, 'text-teal')} />;
  return <FileIcon className={cls} />;
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[90] bg-navy/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className={cn('bg-white rounded-2xl shadow-2xl w-full my-8', wide ? 'max-w-4xl' : 'max-w-lg')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-navy">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function IconBtn({ icon: Icon, onClick, title, danger }: { icon: React.ElementType; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn('p-2 rounded-lg transition-colors', danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-500 hover:bg-slate-100 hover:text-navy')}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export function PrimaryBtn({ children, onClick, className, type = 'button' }: { children: React.ReactNode; onClick?: () => void; className?: string; type?: 'button' | 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn('inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple to-teal text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity', className)}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn('inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors', className)}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple/40 focus:border-purple bg-white';

export function FilePicker({ onPick, accept = '.pdf,.docx,.png,.jpg,.jpeg,.mp4' }: { onPick: (f: File) => void; accept?: string }) {
  return (
    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-purple/40 text-purple text-sm font-medium cursor-pointer hover:bg-purple/5 transition-colors">
      <Plus className="w-4 h-4" /> Muat Naik Fail
      <input type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = ''; }} />
    </label>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto -mx-1 px-1">{children}</div>;
}

export function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white', color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </Card>
  );
}
