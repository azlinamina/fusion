import { Atom, Calculator, FileText, ClipboardList, BookOpenCheck, Flag, Megaphone, ArrowRight, CalendarDays, Dumbbell } from 'lucide-react';
import { useStore } from '../store';
import { Card, StatCard } from '../components/ui';
import { cn } from '../utils';
import type { PageKey } from '../components/Layout';

interface Props { onNavigate: (p: PageKey) => void; onEnterSubject: (s: 'Fizik' | 'Matematik') => void }

export default function Dashboard({ onNavigate, onEnterSubject }: Props) {
  const { data } = useStore();
  const stats = [
    { icon: FileText, label: 'Jumlah Nota', value: data.notas.length, color: 'bg-teal', page: 'nota' as PageKey },
    { icon: Dumbbell, label: 'Jumlah Latihan', value: data.latihans.length, color: 'bg-purple', page: 'latihan' as PageKey },
    { icon: BookOpenCheck, label: 'Jumlah RPH', value: data.rphs.length, color: 'bg-navy', page: 'rph' as PageKey },
    { icon: Flag, label: 'Jumlah Program', value: data.programs.length, color: 'bg-green', page: 'program' as PageKey },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-[#123c75] to-teal p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-green/20 blur-2xl" />
        <div className="absolute -left-10 -bottom-16 w-56 h-56 rounded-full bg-purple/30 blur-2xl" />
        <div className="relative">
          <p className="text-green-light text-sm font-semibold uppercase tracking-widest mb-2">Selamat Datang</p>
          <h2 className="text-2xl sm:text-3xl font-bold max-w-xl">Portal Sumber Digital Panitia Fizik & Matematik</h2>
          <p className="text-white/70 text-sm sm:text-base mt-3 max-w-2xl">
            Akses DSKP, RPH, nota pembelajaran, latihan, headcount dan program akademik — semuanya dalam satu platform.
          </p>
        </div>
      </div>

      {/* Subject cards */}
      <div className="grid md:grid-cols-2 gap-5">
        <SubjectCard
          icon={<Atom className="w-9 h-9" />}
          title="FIZIK"
          desc="Akses nota, latihan KBAT, RPH dan dokumen DSKP mata pelajaran Fizik untuk semua tingkatan."
          gradient="from-teal to-navy"
          onClick={() => onEnterSubject('Fizik')}
        />
        <SubjectCard
          icon={<Calculator className="w-9 h-9" />}
          title="MATEMATIK"
          desc="Akses nota, latihan format SPM, RPH dan dokumen DSKP mata pelajaran Matematik untuk semua tingkatan."
          gradient="from-purple to-teal"
          onClick={() => onEnterSubject('Matematik')}
        />
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-lg font-bold text-navy mb-4">Ringkasan Sumber</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <button key={s.label} onClick={() => onNavigate(s.page)} className="text-left card-hover">
              <StatCard icon={s.icon} label={s.label} value={s.value} color={s.color} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Announcements */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple" />
            <h3 className="font-bold text-navy">Pengumuman Terkini</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.announcements.map((a) => (
              <li key={a.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{a.content}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" /> {new Date(a.date).toLocaleDateString('ms-MY')}
                  </span>
                </div>
              </li>
            ))}
            {data.announcements.length === 0 && <li className="px-5 py-10 text-center text-slate-400 text-sm">Tiada pengumuman</li>}
          </ul>
        </Card>

        {/* Quick links */}
        <Card className="p-5">
          <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal" /> Pautan Pantas
          </h3>
          <div className="space-y-2">
            {[
              { label: 'DSKP Fizik & Matematik', page: 'dskp' as PageKey },
              { label: 'RPH Terkini', page: 'rph' as PageKey },
              { label: 'Headcount Pencapaian', page: 'headcount' as PageKey },
              { label: 'Program Akademik', page: 'program' as PageKey },
            ].map((l) => (
              <button
                key={l.label}
                onClick={() => onNavigate(l.page)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-purple/5 hover:text-purple text-sm font-medium text-slate-600 transition-colors group"
              >
                {l.label}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SubjectCard({ icon, title, desc, gradient, onClick }: { icon: React.ReactNode; title: string; desc: string; gradient: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 shadow-sm card-hover text-left">
      <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', gradient)} />
      <div className="p-6 sm:p-8">
        <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg mb-5', gradient)}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-navy">{title}</h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">{desc}</p>
        <span className={cn('inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r text-white text-sm font-semibold shadow', gradient)}>
          MASUK {title} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </button>
  );
}
