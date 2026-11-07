import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Download, BookOpen } from 'lucide-react';
import { useStore } from '../store';
import type { Document as Doc, FileRef, Subject } from '../types';
import { Card, PageHeader, PrimaryBtn, Modal, Field, inputCls, Select, SearchInput, SubjectTabs, EmptyState, IconBtn, FileActions, Badge, TableWrap } from '../components/ui';
import { uid } from '../utils';
import { TINGKATAN, SUBJECTS } from '../seed';

export default function Dskp() {
  const { data, addItem, updateItem, removeItem, fileToRef, notify, confirm } = useStore();
  const [subject, setSubject] = useState<Subject | 'Semua'>('Semua');
  const [tingkatan, setTingkatan] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Doc | 'new' | null>(null);
  const [form, setForm] = useState({ title: '', subject: 'Fizik' as Subject, tingkatan: TINGKATAN[0], bab: 'Semua Bab', description: '', file: null as FileRef | null });
  const [viewing, setViewing] = useState<Doc | null>(null);

  const filtered = useMemo(() => data.documents.filter((d) =>
    (subject === 'Semua' || d.subject === subject) &&
    (!tingkatan || d.tingkatan === tingkatan) &&
    (!search || d.title.toLowerCase().includes(search.toLowerCase()) || d.bab.toLowerCase().includes(search.toLowerCase()))
  ), [data.documents, subject, tingkatan, search]);

  const openNew = () => { setForm({ title: '', subject: subject === 'Matematik' ? 'Matematik' : 'Fizik', tingkatan: TINGKATAN[0], bab: 'Semua Bab', description: '', file: null }); setEditing('new'); };
  const openEdit = (d: Doc) => { setForm({ title: d.title, subject: d.subject, tingkatan: d.tingkatan, bab: d.bab, description: d.description || '', file: d.file }); setEditing(d); };

  const save = async () => {
    if (!form.title.trim()) { notify('Sila masukkan tajuk', 'error'); return; }
    if (!form.file) { notify('Sila muat naik fail dokumen', 'error'); return; }
    const payload = { title: form.title, subject: form.subject, tingkatan: form.tingkatan, bab: form.bab, description: form.description, file: form.file, uploadedAt: new Date().toISOString().slice(0, 10) };
    if (editing === 'new') { addItem('documents', { id: uid(), ...payload }); notify('Dokumen DSKP ditambah'); }
    else if (editing) { updateItem('documents', editing.id, payload); notify('Dokumen dikemas kini'); }
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Dokumen DSKP" subtitle="Standard Kurikulum dan Pentaksiran Fizik & Matematik" actions={<PrimaryBtn onClick={openNew}><Plus className="w-4 h-4" /> Tambah Dokumen</PrimaryBtn>} />

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <SubjectTabs value={subject} onChange={setSubject} />
        <Select value={tingkatan} onChange={setTingkatan} options={TINGKATAN} placeholder="Semua Tingkatan" />
        <SearchInput value={search} onChange={setSearch} placeholder="Cari dokumen..." />
      </div>

      <Card>
        {filtered.length === 0 ? <EmptyState subtitle="Tiada dokumen sepadan dengan penapis" /> : (
          <TableWrap>
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Tajuk Dokumen</th>
                  <th className="px-5 py-3">Mata Pelajaran</th>
                  <th className="px-5 py-3">Tingkatan</th>
                  <th className="px-5 py-3">Fail</th>
                  <th className="px-5 py-3">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800 flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple" />{d.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{d.description || d.bab} · {d.uploadedAt}</p>
                    </td>
                    <td className="px-5 py-3"><Badge color={d.subject === 'Fizik' ? 'teal' : 'purple'}>{d.subject}</Badge></td>
                    <td className="px-5 py-3 text-slate-600">{d.tingkatan}</td>
                    <td className="px-5 py-3"><FileActions file={d.file} /></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <IconBtn icon={Eye} onClick={() => setViewing(d)} title="Lihat" />
                        <IconBtn icon={Pencil} onClick={() => openEdit(d)} title="Edit" />
                        <IconBtn icon={Trash2} onClick={() => confirm(`Padam dokumen "${d.title}"?`, () => { removeItem('documents', d.id); notify('Dokumen dipadam'); })} title="Padam" danger />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      {/* View modal */}
      {viewing && (viewing.file.data || viewing.file.url) ? (
        <Modal title={viewing.title} onClose={() => setViewing(null)} wide>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge color={viewing.subject === 'Fizik' ? 'teal' : 'purple'}>{viewing.subject}</Badge>
            <Badge>{viewing.tingkatan}</Badge>
            {viewing.description && <p className="w-full text-sm text-slate-500">{viewing.description}</p>}
          </div>
          {viewing.file.kind === 'image' ? (
            <img src={viewing.file.data || viewing.file.url} className="max-w-full rounded-lg mx-auto" alt={viewing.title} />
          ) : viewing.file.kind === 'video' ? (
            <video src={viewing.file.data || viewing.file.url} controls className="w-full rounded-lg" />
          ) : (
            <iframe src={viewing.file.data || viewing.file.url} className="w-full h-[65vh] rounded-lg border" title={viewing.title} />
          )}
        </Modal>
      ) : null}

      {/* Edit modal */}
      {editing && (
        <Modal title={editing === 'new' ? 'Tambah Dokumen DSKP' : 'Edit Dokumen DSKP'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Tajuk Dokumen">
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="cth: DSKP Fizik Tingkatan 4" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mata Pelajaran">
                <Select value={form.subject} onChange={(v) => setForm({ ...form, subject: v as Subject })} options={[...SUBJECTS]} className="w-full" />
              </Field>
              <Field label="Tingkatan">
                <Select value={form.tingkatan} onChange={(v) => setForm({ ...form, tingkatan: v })} options={TINGKATAN} className="w-full" />
              </Field>
            </div>
            <Field label="Bab / Kategori">
              <input className={inputCls} value={form.bab} onChange={(e) => setForm({ ...form, bab: e.target.value })} />
            </Field>
            <Field label="Penerangan">
              <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Fail Dokumen (PDF / DOCX)">
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
                  <Download className="w-5 h-5 rotate-180" /> Klik untuk muat naik fail
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
