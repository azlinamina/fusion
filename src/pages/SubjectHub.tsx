import { ArrowLeft, Atom, Calculator, FileText, BookOpenCheck, StickyNote, Dumbbell, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../components/ui';
import { cn } from '../utils';
import type { PageKey } from '../components/Layout';

export default function SubjectHub({ subject, onBack, onNavigate }: { subject: 'Fizik' | 'Matematik'; onBack: () => void; onNavigate: (p: PageKey) => void }) {
  const { data } = useStore();
  const isFizik = subject === 'Fizik';
  const notas = data.notas.filter((n) => n.subject === subject);
  const latihans = data.latihans.filter((l) => l.subject === subject);
  const rphs = data.rphs.filter((r) => r.subject === subject);
  const dskps = data.documents.filter((d) => d.subject === subject);

  const links = [
    { page: 'dskp' as PageKey, label: 'Dokumen DSKP', count: dskps.length, icon: FileText, color: 'bg-purple/10 text-purple' },
    { page: 'rph' as PageKey, label: 'RPH', count: rphs.length, icon: BookOpenCheck, color: 'bg-navy/10 text-navy' },
    { page: 'nota' as PageKey, label: 'Nota Pembelajaran', count: notas.length, icon: StickyNote, color: 'bg-teal/10 text-teal' },
    { page: 'latihan' as PageKey, label: 'Latihan', count: latihans.length, icon: Dumbbell, color: 'bg-green/15 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </button>

      <div className={cn('relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl bg-gradient-to-br', isFizik ? 'from-teal via-[#12486b] to-navy' : 'from-purple via-[#4b47a8] to-teal')}>
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            {isFizik ? <Atom className="w-10 h-10 sm:w-12 sm:h-12" /> : <Calculator className="w-10 h-10 sm:w-12 sm:h-12" />}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">{subject.toUpperCase()}</h2>
            <p className="text-white/75 text-sm mt-1">Sumber PdP digital mata pelajaran {subject} — semua tingkatan.</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((l) => (
          <button key={l.page} onClick={() => onNavigate(l.page)} className="card-hover text-left">
            <Card className="p-5 h-full">
              <div className="flex items-start justify-between">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', l.color)}>
                  <l.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-navy mt-4">{l.count}</p>
              <p className="text-sm font-medium text-slate-600">{l.label}</p>
            </Card>
          </button>
        ))}
      </div>

      {/* Latest notas */}
      <Card className="p-5">
        <h3 className="font-bold text-navy mb-4">Nota {subject} Terkini</h3>
        {notas.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">Tiada nota lagi.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notas.slice(0, 5).map((n) => (
              <li key={n.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{n.title}</p>
                  <p className="text-xs text-slate-500">{n.tingkatan} · {n.bab}</p>
                </div>
                <button onClick={() => onNavigate('nota')} className="text-xs font-semibold text-purple hover:underline shrink-0">Lihat</button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
