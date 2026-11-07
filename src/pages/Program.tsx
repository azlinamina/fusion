import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Flag, CalendarDays, Users, Target, ListChecks, ImagePlus, FileText } from 'lucide-react';
import { useStore } from '../store';
import type { Program as Prog, Subject } from '../types';
import { Card, PageHeader, PrimaryBtn, Modal, Field, inputCls, Select, SearchInput, SubjectTabs, EmptyState, IconBtn, Badge } from '../components/ui';
import { uid, cn } from '../utils';
import { SUBJECTS } from '../seed';

const statusColor = { 'Dirancang': 'amber', 'Berlangsung': 'purple', 'Selesai': 'green' } as const;
const statusList = ['Dirancang', 'Berlangsung', 'Selesai'] as const;

export default function ProgramPage() {
  const { data, addItem, updateItem, removeItem, fileToRef, notify, confirm } = useStore();
  const [subject, setSubject] = useState<Subject | 'Semua'>('Semua');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Prog | 'new' | null>(null);
  const [viewing, setViewing] = useState<Prog | null>(null);
  const [form, setForm] = useState({ name: '', subject: 'Kedua-dua' as Prog['subject'], objective: '', date: '', target: '', activities: '', report: '', image: '', status: 'Dirancang' as Prog['status'] });

  const filtered = useMemo(() => data.programs.filter((p) =>
    (subject === 'Semua' || p.subject === subject || p.subject === 'Kedua-dua') &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.objective.toLowerCase().includes(search.toLowerCase()))
  ), [data.programs, subject, search]);

  const openNew = () => { setForm({ name: '', subject: subject === 'Semua' ? 'Kedua-dua' : subject, objective: '', date: '', target: '', activities: '', report: '', image: '', status: 'Dirancang' }); setEditing('new'); };
  const openEdit = (p: Prog) => { setForm({ name: p.name, subject: p.subject, objective: p.objective, date: p.date, target: p.target, activities: p.activities, report: p.report || '', image: p.image || '', status: p.status }); setEditing(p); };

  const save = async () => {
    if (!form.name.trim()) { notify('Sila masukkan nama program', 'error'); return; }
    const payload = { name: form.name, subject: form.subject, objective: form.objective, date: form.date, target: form.target, activities: form.activities, report: form.report || undefined, image: form.image || undefined, status: form.status };
    if (editing === 'new') { addItem('programs', { id: uid(), ...payload }); notify('Program ditambah'); }
    else if (editing) { updateItem('programs', editing.id, payload); notify('Program dikemas kini'); }
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Program Akademik" subtitle="Senarai program Fizik & Matematik — bengkel, lawatan dan aktiviti" actions={<PrimaryBtn onClick={openNew}><Plus className="w-4 h-4" /> Tambah Program</PrimaryBtn>} />

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <SubjectTabs value={subject} onChange={setSubject} />
        <SearchInput value={search} onChange={setSearch} placeholder="Cari program..." />
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState subtitle="Tiada program sepadan" /></Card>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple via-teal to-green hidden sm:block" />
          <div className="space-y-5">
            {filtered.map((p) => (
              <div key={p.id} className="relative sm:pl-14">
                <div className="hidden sm:flex absolute left-0 top-5 w-10 h-10 rounded-full bg-gradient-to-br from-purple to-teal items-center justify-center text-white shadow z-10">
                  <Flag className="w-4 h-4" />
                </div>
                <Card className="p-5 sm:p-6 card-hover">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover hidden sm:block" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple/15 to-teal/15 flex items-center justify-center hidden sm:flex">
                          <Flag className="w-6 h-6 text-purple" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-navy text-lg">{p.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <Badge color={p.subject === 'Fizik' ? 'teal' : p.subject === 'Matematik' ? 'purple' : 'green'}>{p.subject}</Badge>
                          <Badge color={statusColor[p.status]}>{p.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <IconBtn icon={Pencil} onClick={() => openEdit(p)} title="Edit" />
                      <IconBtn icon={Trash2} onClick={() => confirm(`Padam program "${p.name}"?`, () => { removeItem('programs', p.id); notify('Program dipadam'); })} title="Padam" danger />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-4 text-sm">
                    <Info icon={Target} label="Objektif" text={p.objective} />
                    <Info icon={CalendarDays} label="Tarikh" text={p.date} />
                    <Info icon={Users} label="Sasaran" text={p.target} />
                    <Info icon={ListChecks} label="Aktiviti" text={p.activities} />
                  </div>
                  {p.report && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                      <FileText className="w-4 h-4 text-teal" /> {p.report}
                    </div>
                  )}
                  <button onClick={() => setViewing(p)} className="mt-4 text-xs font-semibold text-purple hover:underline">Lihat butiran program →</button>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)} wide>
          <div className="flex flex-wrap gap-2 mb-5">
            <Badge color={viewing.subject === 'Fizik' ? 'teal' : viewing.subject === 'Matematik' ? 'purple' : 'green'}>{viewing.subject}</Badge>
            <Badge color={statusColor[viewing.status]}>{viewing.status}</Badge>
          </div>
          {viewing.image && <img src={viewing.image} alt={viewing.name} className="w-full max-h-64 object-cover rounded-xl mb-5" />}
          <dl className="space-y-4 text-sm">
            {([
              ['Objektif Program', viewing.objective],
              ['Tarikh Pelaksanaan', viewing.date],
              ['Sasaran Peserta', viewing.target],
              ['Aktiviti Program', viewing.activities],
              ['Laporan & Dokumentasi', viewing.report || '-'],
            ] as const).map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">{k}</dt>
                <dd className="text-slate-700">{v}</dd>
              </div>
            ))}
          </dl>
        </Modal>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Tambah Program' : 'Edit Program'} onClose={() => setEditing(null)} wide>
          <div className="space-y-4">
            <Field label="Nama Program">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mata Pelajaran">
                <Select value={form.subject} onChange={(v) => setForm({ ...form, subject: v as Prog['subject'] })} options={[...SUBJECTS, 'Kedua-dua']} className="w-full" />
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={(v) => setForm({ ...form, status: v as Prog['status'] })} options={[...statusList]} className="w-full" />
              </Field>
            </div>
            <Field label="Objektif Program">
              <textarea className={inputCls} rows={2} value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tarikh Pelaksanaan">
                <input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="cth: 2026-05-10" />
              </Field>
              <Field label="Sasaran Peserta">
                <input className={inputCls} value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
              </Field>
            </div>
            <Field label="Aktiviti Program">
              <textarea className={inputCls} rows={2} value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} />
            </Field>
            <Field label="Laporan & Dokumentasi">
              <input className={inputCls} value={form.report} onChange={(e) => setForm({ ...form, report: e.target.value })} />
            </Field>
            <Field label="Gambar Program (pilihan)">
              <div className="flex items-center gap-3">
                {form.image ? <img src={form.image} className="w-14 h-14 rounded-xl object-cover" alt="" /> : <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center"><ImagePlus className="w-5 h-5 text-slate-400" /></div>}
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-sm cursor-pointer hover:bg-slate-50">
                  Muat Naik Gambar
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const ref = await fileToRef(f); setForm({ ...form, image: ref.data || '' }); } e.target.value = ''; }} />
                </label>
                {form.image && <button onClick={() => setForm({ ...form, image: '' })} className="text-xs text-red-500">Buang</button>}
              </div>
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">Batal</button>
              <PrimaryBtn onClick={save}>{editing === 'new' ? 'Tambah' : 'Simpan'}</PrimaryBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Info({ icon: Icon, label, text }: { icon: React.ElementType; label: string; text: string }) {
  return (
    <div className="flex gap-2.5">
      <Icon className="w-4 h-4 text-teal shrink-0 mt-0.5" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-slate-700">{text}</p>
      </div>
    </div>
  );
}
