import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, CalendarDays, BookOpenCheck } from 'lucide-react';
import { useStore } from '../store';
import type { Rph, FileRef, Subject } from '../types';
import { Card, PageHeader, PrimaryBtn, Modal, Field, inputCls, Select, SearchInput, SubjectTabs, EmptyState, IconBtn, FileActions, Badge, TableWrap } from '../components/ui';
import { uid } from '../utils';
import { TINGKATAN, SUBJECTS } from '../seed';

export default function RphPage() {
  const { data, addItem, updateItem, removeItem, fileToRef, notify, confirm } = useStore();
  const [subject, setSubject] = useState<Subject | 'Semua'>('Semua');
  const [tingkatan, setTingkatan] = useState('');
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Rph | 'new' | null>(null);
  const [viewing, setViewing] = useState<Rph | null>(null);
  const [form, setForm] = useState({ title: '', subject: 'Fizik' as Subject, tingkatan: TINGKATAN[0], year: new Date().getFullYear(), week: '', file: null as FileRef | null });

  const years = useMemo(() => [...new Set(data.rphs.map((r) => r.year))].sort((a, b) => b - a), [data.rphs]);

  const filtered = useMemo(() => data.rphs.filter((r) =>
    (subject === 'Semua' || r.subject === subject) &&
    (!tingkatan || r.tingkatan === tingkatan) &&
    (!year || String(r.year) === year) &&
    (!search || r.title.toLowerCase().includes(search.toLowerCase()))
  ), [data.rphs, subject, tingkatan, year, search]);

  const openNew = () => { setForm({ title: '', subject: subject === 'Matematik' ? 'Matematik' : 'Fizik', tingkatan: TINGKATAN[0], year: new Date().getFullYear(), week: '', file: null }); setEditing('new'); };
  const openEdit = (r: Rph) => { setForm({ title: r.title, subject: r.subject, tingkatan: r.tingkatan, year: r.year, week: r.week, file: r.file }); setEditing(r); };

  const save = async () => {
    if (!form.title.trim()) { notify('Sila masukkan tajuk RPH', 'error'); return; }
    if (!form.file) { notify('Sila muat naik fail RPH', 'error'); return; }
    const payload = { title: form.title, subject: form.subject, tingkatan: form.tingkatan, year: form.year, week: form.week, file: form.file, uploadedAt: new Date().toISOString().slice(0, 10) };
    if (editing === 'new') { addItem('rphs', { id: uid(), ...payload }); notify('RPH ditambah'); }
    else if (editing) { updateItem('rphs', editing.id, payload); notify('RPH dikemas kini'); }
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Rancangan Pengajaran Harian (RPH)" subtitle="Koleksi RPH mengikut mata pelajaran, tingkatan dan tahun" actions={<PrimaryBtn onClick={openNew}><Plus className="w-4 h-4" /> Tambah RPH</PrimaryBtn>} />

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <SubjectTabs value={subject} onChange={setSubject} />
        <Select value={tingkatan} onChange={setTingkatan} options={TINGKATAN} placeholder="Semua Tingkatan" />
        <Select value={year} onChange={setYear} options={years.map(String)} placeholder="Semua Tahun" />
        <SearchInput value={search} onChange={setSearch} placeholder="Cari RPH..." />
      </div>

      <Card>
        {filtered.length === 0 ? <EmptyState subtitle="Tiada RPH sepadan dengan penapis" /> : (
          <TableWrap>
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Tajuk RPH</th>
                  <th className="px-5 py-3">Mata Pelajaran</th>
                  <th className="px-5 py-3">Tingkatan</th>
                  <th className="px-5 py-3">Tahun / Minggu</th>
                  <th className="px-5 py-3">Fail</th>
                  <th className="px-5 py-3">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800 flex items-center gap-2"><BookOpenCheck className="w-4 h-4 text-teal" />{r.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{r.uploadedAt}</p>
                    </td>
                    <td className="px-5 py-3"><Badge color={r.subject === 'Fizik' ? 'teal' : 'purple'}>{r.subject}</Badge></td>
                    <td className="px-5 py-3 text-slate-600">{r.tingkatan}</td>
                    <td className="px-5 py-3 text-slate-600"><span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-slate-400" />{r.year} · {r.week}</span></td>
                    <td className="px-5 py-3"><FileActions file={r.file} /></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <IconBtn icon={Eye} onClick={() => setViewing(r)} title="Lihat" />
                        <IconBtn icon={Pencil} onClick={() => openEdit(r)} title="Edit" />
                        <IconBtn icon={Trash2} onClick={() => confirm(`Padam RPH "${r.title}"?`, () => { removeItem('rphs', r.id); notify('RPH dipadam'); })} title="Padam" danger />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      {viewing && (viewing.file.data || viewing.file.url) && (
        <Modal title={viewing.title} onClose={() => setViewing(null)} wide>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge color={viewing.subject === 'Fizik' ? 'teal' : 'purple'}>{viewing.subject}</Badge>
            <Badge>{viewing.tingkatan}</Badge>
            <Badge color="green">{viewing.year} · {viewing.week}</Badge>
          </div>
          {viewing.file.kind === 'image' ? (
            <img src={viewing.file.data || viewing.file.url} className="max-w-full rounded-lg mx-auto" alt={viewing.title} />
          ) : viewing.file.kind === 'video' ? (
            <video src={viewing.file.data || viewing.file.url} controls className="w-full rounded-lg" />
          ) : (
            <iframe src={viewing.file.data || viewing.file.url} className="w-full h-[65vh] rounded-lg border" title={viewing.title} />
          )}
        </Modal>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Tambah RPH' : 'Edit RPH'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Tajuk RPH">
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="cth: RPH Fizik T4 - Daya dan Gerakan I" />
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
              <Field label="Tahun">
                <input type="number" className={inputCls} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </Field>
              <Field label="Minggu">
                <input className={inputCls} value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} placeholder="cth: Minggu 1" />
              </Field>
            </div>
            <Field label="Fail RPH (PDF / DOCX)">
              {form.file ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50">
                  <FileActions file={form.file} />
                  <label className="text-xs text-purple font-medium cursor-pointer hover:underline">
                    Tukar fail
                    <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, file: await fileToRef(f) }); e.target.value = ''; }} />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-purple/40 text-purple text-sm font-medium cursor-pointer hover:bg-purple/5">
                  Klik untuk muat naik fail RPH
                  <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, file: await fileToRef(f) }); e.target.value = ''; }} />
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
