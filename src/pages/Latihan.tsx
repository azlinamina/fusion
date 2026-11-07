import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Dumbbell, KeyRound, FileCheck } from 'lucide-react';
import { useStore } from '../store';
import type { Latihan as LatihanType, FileRef, Subject, Difficulty } from '../types';
import { Card, PageHeader, PrimaryBtn, Modal, Field, inputCls, Select, SearchInput, SubjectTabs, EmptyState, IconBtn, FileActions, Badge, TableWrap } from '../components/ui';
import { uid, cn } from '../utils';
import { TINGKATAN, SUBJECTS, DIFFICULTIES } from '../seed';

const diffColor: Record<Difficulty, 'green' | 'amber' | 'purple' | 'red'> = {
  'Mudah': 'green', 'Sederhana': 'amber', 'KBAT': 'purple', 'Format SPM': 'red',
};

export default function LatihanPage() {
  const { data, addItem, updateItem, removeItem, fileToRef, notify, confirm } = useStore();
  const [subject, setSubject] = useState<Subject | 'Semua'>('Semua');
  const [tingkatan, setTingkatan] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<LatihanType | 'new' | null>(null);
  const [viewing, setViewing] = useState<LatihanType | null>(null);
  const [form, setForm] = useState({ title: '', subject: 'Fizik' as Subject, tingkatan: TINGKATAN[0], bab: '', difficulty: 'Mudah' as Difficulty, file: null as FileRef | null, skema: null as FileRef | null });

  const babs = useMemo(() => [...new Set(data.latihans.map((l) => l.bab))].sort(), [data.latihans]);

  const filtered = useMemo(() => data.latihans.filter((l) =>
    (subject === 'Semua' || l.subject === subject) &&
    (!tingkatan || l.tingkatan === tingkatan) &&
    (!difficulty || l.difficulty === difficulty) &&
    (!search || l.title.toLowerCase().includes(search.toLowerCase()) || l.bab.toLowerCase().includes(search.toLowerCase()))
  ), [data.latihans, subject, tingkatan, difficulty, search]);

  const openNew = () => { setForm({ title: '', subject: subject === 'Matematik' ? 'Matematik' : 'Fizik', tingkatan: tingkatan || TINGKATAN[0], bab: '', difficulty: 'Mudah', file: null, skema: null }); setEditing('new'); };
  const openEdit = (l: LatihanType) => { setForm({ title: l.title, subject: l.subject, tingkatan: l.tingkatan, bab: l.bab, difficulty: l.difficulty, file: l.file, skema: l.skema || null }); setEditing(l); };

  const save = async () => {
    if (!form.title.trim()) { notify('Sila masukkan tajuk latihan', 'error'); return; }
    if (!form.file) { notify('Sila muat naik fail latihan', 'error'); return; }
    const payload = { title: form.title, subject: form.subject, tingkatan: form.tingkatan, bab: form.bab, difficulty: form.difficulty, file: form.file, skema: form.skema || undefined, uploadedAt: new Date().toISOString().slice(0, 10) };
    if (editing === 'new') { addItem('latihans', { id: uid(), ...payload }); notify('Latihan ditambah'); }
    else if (editing) { updateItem('latihans', editing.id, payload); notify('Latihan dikemas kini'); }
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Latihan" subtitle="Koleksi latihan mengikut tahap kesukaran — Mudah, Sederhana, KBAT & Format SPM" actions={<PrimaryBtn onClick={openNew}><Plus className="w-4 h-4" /> Tambah Latihan</PrimaryBtn>} />

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <SubjectTabs value={subject} onChange={setSubject} />
        <Select value={tingkatan} onChange={setTingkatan} options={TINGKATAN} placeholder="Semua Tingkatan" />
        <Select value={difficulty} onChange={setDifficulty} options={[...DIFFICULTIES]} placeholder="Semua Tahap" />
        <SearchInput value={search} onChange={setSearch} placeholder="Cari latihan..." />
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState subtitle="Tiada latihan sepadan dengan penapis" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((l) => (
            <Card key={l.id} className="p-5 card-hover flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-white', l.difficulty === 'KBAT' ? 'bg-purple' : l.difficulty === 'Format SPM' ? 'bg-red-500' : l.difficulty === 'Sederhana' ? 'bg-amber-500' : 'bg-green')}>
                  <Dumbbell className="w-5 h-5" />
                </div>
                <Badge color={diffColor[l.difficulty]}>{l.difficulty}</Badge>
              </div>
              <h3 className="font-bold text-navy mt-3 leading-snug">{l.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{l.subject} · {l.tingkatan}{l.bab ? ` · ${l.bab}` : ''}</p>
              <div className="mt-3 space-y-1.5">
                <FileActions file={l.file} label="latihan" />
                {l.skema && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Skema jawapan: <FileActions file={l.skema} label="skema" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">{l.uploadedAt}</span>
                <div className="flex gap-1">
                  <IconBtn icon={Eye} onClick={() => setViewing(l)} title="Lihat Latihan" />
                  <IconBtn icon={Pencil} onClick={() => openEdit(l)} title="Edit" />
                  <IconBtn icon={Trash2} onClick={() => confirm(`Padam latihan "${l.title}"?`, () => { removeItem('latihans', l.id); notify('Latihan dipadam'); })} title="Padam" danger />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {viewing && (viewing.file.data || viewing.file.url) && (
        <Modal title={viewing.title} onClose={() => setViewing(null)} wide>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge color={diffColor[viewing.difficulty]}>{viewing.difficulty}</Badge>
            <Badge color={viewing.subject === 'Fizik' ? 'teal' : 'purple'}>{viewing.subject}</Badge>
            <Badge>{viewing.tingkatan}</Badge>
            {viewing.bab && <Badge color="green">{viewing.bab}</Badge>}
          </div>
          {viewing.file.kind === 'image' ? (
            <img src={viewing.file.data || viewing.file.url} className="max-w-full rounded-lg mx-auto" alt={viewing.title} />
          ) : viewing.file.kind === 'video' ? (
            <video src={viewing.file.data || viewing.file.url} controls className="w-full rounded-lg" />
          ) : (
            <iframe src={viewing.file.data || viewing.file.url} className="w-full h-[60vh] rounded-lg border" title={viewing.title} />
          )}
          {viewing.skema && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <FileCheck className="w-4 h-4 text-amber-500" /> Skema jawapan:
              <FileActions file={viewing.skema} label="skema jawapan" />
            </div>
          )}
        </Modal>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Tambah Latihan' : 'Edit Latihan'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Tajuk Latihan">
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mata Pelajaran">
                <Select value={form.subject} onChange={(v) => setForm({ ...form, subject: v as Subject })} options={[...SUBJECTS]} className="w-full" />
              </Field>
              <Field label="Tingkatan">
                <Select value={form.tingkatan} onChange={(v) => setForm({ ...form, tingkatan: v })} options={TINGKATAN} className="w-full" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Bab">
                <input className={inputCls} value={form.bab} onChange={(e) => setForm({ ...form, bab: e.target.value })} list="bab-list-lat" />
                <datalist id="bab-list-lat">{babs.map((b) => <option key={b} value={b} />)}</datalist>
              </Field>
              <Field label="Tahap Kesukaran">
                <Select value={form.difficulty} onChange={(v) => setForm({ ...form, difficulty: v as Difficulty })} options={[...DIFFICULTIES]} className="w-full" />
              </Field>
            </div>
            <Field label="Fail Latihan (PDF)">
              {form.file ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50">
                  <FileActions file={form.file} />
                  <div className="flex gap-3 text-xs">
                    <label className="text-purple font-medium cursor-pointer hover:underline">Tukar<input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, file: await fileToRef(f) }); e.target.value = ''; }} /></label>
                    <button onClick={() => setForm({ ...form, file: null })} className="text-red-500 font-medium">Buang</button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-purple/40 text-purple text-sm font-medium cursor-pointer hover:bg-purple/5">
                  Klik untuk muat naik fail latihan
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, file: await fileToRef(f) }); e.target.value = ''; }} />
                </label>
              )}
            </Field>
            <Field label="Skema Jawapan (pilihan)">
              {form.skema ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50">
                  <FileActions file={form.skema} label="skema" />
                  <div className="flex gap-3 text-xs">
                    <label className="text-purple font-medium cursor-pointer hover:underline">Tukar<input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, skema: await fileToRef(f) }); e.target.value = ''; }} /></label>
                    <button onClick={() => setForm({ ...form, skema: null })} className="text-red-500 font-medium">Buang</button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed border-teal/40 text-teal text-sm font-medium cursor-pointer hover:bg-teal/5">
                  Klik untuk muat naik skema jawapan
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, skema: await fileToRef(f) }); e.target.value = ''; }} />
                </label>
              )}
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
