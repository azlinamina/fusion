import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, StickyNote, Play } from 'lucide-react';
import { useStore } from '../store';
import type { Nota as NotaType, FileRef, Subject } from '../types';
import { Card, PageHeader, PrimaryBtn, Modal, Field, inputCls, Select, SearchInput, SubjectTabs, EmptyState, IconBtn, FileActions, Badge, FileKindIcon } from '../components/ui';
import { uid } from '../utils';
import { TINGKATAN, SUBJECTS } from '../seed';

export default function NotaPage() {
  const { data, addItem, updateItem, removeItem, fileToRef, notify, confirm } = useStore();
  const [subject, setSubject] = useState<Subject | 'Semua'>('Semua');
  const [tingkatan, setTingkatan] = useState('');
  const [bab, setBab] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<NotaType | 'new' | null>(null);
  const [viewing, setViewing] = useState<NotaType | null>(null);
  const [form, setForm] = useState({ title: '', subject: 'Fizik' as Subject, tingkatan: TINGKATAN[0], bab: '', subtopik: '', file: null as FileRef | null, urlInput: '' });

  const babs = useMemo(() => [...new Set(data.notas.map((n) => n.bab))].sort(), [data.notas]);

  const filtered = useMemo(() => data.notas.filter((n) =>
    (subject === 'Semua' || n.subject === subject) &&
    (!tingkatan || n.tingkatan === tingkatan) &&
    (!bab || n.bab === bab) &&
    (!search || n.title.toLowerCase().includes(search.toLowerCase()) || n.subtopik.toLowerCase().includes(search.toLowerCase()))
  ), [data.notas, subject, tingkatan, bab, search]);

  const openNew = () => { setForm({ title: '', subject: subject === 'Matematik' ? 'Matematik' : 'Fizik', tingkatan: tingkatan || TINGKATAN[0], bab: '', subtopik: '', file: null, urlInput: '' }); setEditing('new'); };
  const openEdit = (n: NotaType) => { setForm({ title: n.title, subject: n.subject, tingkatan: n.tingkatan, bab: n.bab, subtopik: n.subtopik, file: n.file, urlInput: n.file.url || '' }); setEditing(n); };

  const save = async () => {
    if (!form.title.trim()) { notify('Sila masukkan tajuk nota', 'error'); return; }
    if (!form.file) { notify('Sila pilih fail / pautan nota', 'error'); return; }
    const payload = { title: form.title, subject: form.subject, tingkatan: form.tingkatan, bab: form.bab, subtopik: form.subtopik, file: form.file, uploadedAt: new Date().toISOString().slice(0, 10) };
    if (editing === 'new') { addItem('notas', { id: uid(), ...payload }); notify('Nota ditambah'); }
    else if (editing) { updateItem('notas', editing.id, payload); notify('Nota dikemas kini'); }
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Nota Pembelajaran" subtitle="Koleksi nota Fizik & Matematik mengikut tingkatan, bab dan subtopik" actions={<PrimaryBtn onClick={openNew}><Plus className="w-4 h-4" /> Tambah Nota</PrimaryBtn>} />

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <SubjectTabs value={subject} onChange={setSubject} />
        <Select value={tingkatan} onChange={setTingkatan} options={TINGKATAN} placeholder="Semua Tingkatan" />
        <Select value={bab} onChange={setBab} options={babs} placeholder="Semua Bab" />
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nota..." />
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState subtitle="Tiada nota sepadan dengan penapis" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((n) => (
            <Card key={n.id} className="overflow-hidden card-hover flex flex-col">
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-teal/90 to-navy relative flex items-center justify-center overflow-hidden">
                {n.file.kind === 'image' && (n.file.data || n.file.url) ? (
                  <img src={n.file.data || n.file.url} alt={n.title} className="w-full h-full object-cover" />
                ) : n.file.kind === 'video' ? (
                  <div className="flex flex-col items-center text-white/90"><Play className="w-10 h-10 mb-1" /><span className="text-xs">Video Pembelajaran</span></div>
                ) : (
                  <div className="flex flex-col items-center text-white/90"><StickyNote className="w-10 h-10 mb-1" /><span className="text-xs uppercase tracking-wide">{n.subject}</span></div>
                )}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <Badge color={n.subject === 'Fizik' ? 'green' : 'purple'}>{n.subject}</Badge>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-navy leading-snug">{n.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{n.tingkatan} · {n.bab}{n.subtopik ? ` · ${n.subtopik}` : ''}</p>
                <div className="mt-3 flex-1"><FileActions file={n.file} label="nota" /></div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">{n.uploadedAt}</span>
                  <div className="flex gap-1">
                    <IconBtn icon={Eye} onClick={() => setViewing(n)} title="Baca Nota" />
                    <IconBtn icon={Pencil} onClick={() => openEdit(n)} title="Edit" />
                    <IconBtn icon={Trash2} onClick={() => confirm(`Padam nota "${n.title}"?`, () => { removeItem('notas', n.id); notify('Nota dipadam'); })} title="Padam" danger />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {viewing && (viewing.file.data || viewing.file.url) && (
        <Modal title={viewing.title} onClose={() => setViewing(null)} wide>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge color={viewing.subject === 'Fizik' ? 'teal' : 'purple'}>{viewing.subject}</Badge>
            <Badge>{viewing.tingkatan}</Badge>
            <Badge color="green">{viewing.bab}</Badge>
            {viewing.subtopik && <Badge color="amber">{viewing.subtopik}</Badge>}
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
        <Modal title={editing === 'new' ? 'Tambah Nota' : 'Edit Nota'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Tajuk Nota">
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
                <input className={inputCls} value={form.bab} onChange={(e) => setForm({ ...form, bab: e.target.value })} list="bab-list" />
                <datalist id="bab-list">{babs.map((b) => <option key={b} value={b} />)}</datalist>
              </Field>
              <Field label="Subtopik">
                <input className={inputCls} value={form.subtopik} onChange={(e) => setForm({ ...form, subtopik: e.target.value })} />
              </Field>
            </div>
            <Field label="Fail Nota (PDF / imej / video) atau pautan">
              {form.file ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50">
                  <FileActions file={form.file} />
                  <div className="flex gap-3 text-xs">
                    <label className="text-purple font-medium cursor-pointer hover:underline">Tukar fail<input type="file" accept=".pdf,.png,.jpg,.jpeg,.mp4" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, file: await fileToRef(f) }); e.target.value = ''; }} /></label>
                    <button onClick={() => setForm({ ...form, file: null })} className="text-red-500 font-medium">Buang</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-purple/40 text-purple text-sm font-medium cursor-pointer hover:bg-purple/5">
                    <FileKindIcon kind="pdf" /> Klik untuk muat naik fail
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg,.mp4" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, file: await fileToRef(f) }); e.target.value = ''; }} />
                  </label>
                  <div className="flex items-center gap-2">
                    <input className={inputCls} placeholder="Atau tampal pautan video/PDF..." value={form.urlInput} onChange={(e) => setForm({ ...form, urlInput: e.target.value })} />
                    {form.urlInput && (
                      <button
                        type="button"
                        onClick={() => { const u = form.urlInput; setForm({ ...form, file: { name: u.split('/').pop()?.split('?')[0] || 'pautan', url: u, kind: u.includes('youtube') || u.includes('youtu.be') ? 'video' : 'pdf' }, urlInput: '' }); }}
                        className="px-4 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold whitespace-nowrap"
                      >
                        Guna Pautan
                      </button>
                    )}
                  </div>
                </div>
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
