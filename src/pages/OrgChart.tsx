import { useState } from 'react';
import { Crown, UserRound, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { useStore } from '../store';
import type { OrgMember } from '../types';
import { Card, PageHeader, PrimaryBtn, Modal, Field, inputCls, Select, IconBtn, Badge, EmptyState } from '../components/ui';
import { uid, cn } from '../utils';
import { SUBJECTS } from '../seed';

const POSITIONS = ['Ketua Panitia Fizik', 'Ketua Panitia Matematik', 'Guru Fizik', 'Guru Matematik', 'Setiausaha Panitia', 'Bendahari Panitia'];

export default function OrgChart() {
  const { data, addItem, updateItem, removeItem, fileToRef, notify, confirm } = useStore();
  const [editing, setEditing] = useState<OrgMember | 'new' | null>(null);
  const [form, setForm] = useState({ name: '', position: '', subject: 'Fizik' as OrgMember['subject'], photo: '' });

  const ketua = data.orgMembers.filter((m) => m.position.startsWith('Ketua Panitia'));
  const others = data.orgMembers.filter((m) => !m.position.startsWith('Ketua Panitia'));

  const openNew = () => { setForm({ name: '', position: POSITIONS[0], subject: 'Fizik', photo: '' }); setEditing('new'); };
  const openEdit = (m: OrgMember) => { setForm({ name: m.name, position: m.position, subject: m.subject, photo: m.photo || '' }); setEditing(m); };

  const save = async () => {
    if (!form.name.trim()) { notify('Sila masukkan nama', 'error'); return; }
    const payload = { name: form.name, position: form.position, subject: form.subject, photo: form.photo || undefined };
    if (editing === 'new') {
      addItem('orgMembers', { id: uid(), ...payload });
      notify('Ahli organisasi ditambah');
    } else if (editing) {
      updateItem('orgMembers', editing.id, payload);
      notify('Maklumat dikemas kini');
    }
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Carta Organisasi Panitia"
        subtitle="Struktur organisasi Panitia Fizik & Matematik"
        actions={<PrimaryBtn onClick={openNew}><Plus className="w-4 h-4" /> Tambah Ahli</PrimaryBtn>}
      />

      {data.orgMembers.length === 0 ? <EmptyState subtitle="Tambah ahli untuk membina carta organisasi" /> : (
        <div className="flex flex-col items-center gap-8 pb-8">
          {/* Ketua level */}
          <div className="flex flex-wrap justify-center gap-4">
            {ketua.map((m) => <MemberCard key={m.id} member={m} onEdit={() => openEdit(m)} onDelete={() => confirm(`Padam ${m.name}?`, () => { removeItem('orgMembers', m.id); notify('Ahli dipadam'); })} lead />)}
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="w-full max-w-4xl h-px bg-slate-300 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-px w-px h-8 bg-slate-300" />
          </div>
          {/* Members level */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
            {others.map((m) => <MemberCard key={m.id} member={m} onEdit={() => openEdit(m)} onDelete={() => confirm(`Padam ${m.name}?`, () => { removeItem('orgMembers', m.id); notify('Ahli dipadam'); })} />)}
          </div>
        </div>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Tambah Ahli Organisasi' : 'Edit Ahli Organisasi'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Nama Penuh">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="cth: En. Ahmad Rahman" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Jawatan">
                <Select value={form.position} onChange={(v) => setForm({ ...form, position: v })} options={POSITIONS} className="w-full" />
              </Field>
              <Field label="Subjek">
                <Select value={form.subject} onChange={(v) => setForm({ ...form, subject: v as OrgMember['subject'] })} options={[...SUBJECTS, 'Kedua-dua']} className="w-full" />
              </Field>
            </div>
            <Field label="Gambar (pilihan)">
              <div className="flex items-center gap-3">
                {form.photo ? <img src={form.photo} className="w-12 h-12 rounded-full object-cover" alt="" /> : <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center"><UserRound className="w-6 h-6 text-slate-400" /></div>}
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-sm cursor-pointer hover:bg-slate-50">
                  <Upload className="w-4 h-4" /> Pilih Gambar
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) { const ref = await fileToRef(f); setForm({ ...form, photo: ref.data || '' }); }
                  }} />
                </label>
                {form.photo && <button onClick={() => setForm({ ...form, photo: '' })} className="text-xs text-red-500">Buang</button>}
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

function MemberCard({ member, onEdit, onDelete, lead }: { member: OrgMember; onEdit: () => void; onDelete: () => void; lead?: boolean }) {
  return (
    <Card className={cn('p-4 text-center relative group', lead && 'border-purple/40 ring-2 ring-purple/20')}>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconBtn icon={Pencil} onClick={onEdit} title="Edit" />
        <IconBtn icon={Trash2} onClick={onDelete} title="Padam" danger />
      </div>
      <div className={cn('mx-auto rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br', lead ? 'from-purple to-teal w-20 h-20' : 'from-teal to-navy w-16 h-16')}>
        {member.photo ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" /> : <UserRound className={cn('text-white', lead ? 'w-9 h-9' : 'w-7 h-7')} />}
      </div>
      {lead && <Crown className="w-4 h-4 text-amber-500 mx-auto mt-1" />}
      <p className={cn('font-semibold text-navy mt-2', lead ? 'text-base' : 'text-sm')}>{member.name}</p>
      <p className="text-xs text-slate-500">{member.position}</p>
      <div className="mt-2 flex justify-center"><Badge color={member.subject === 'Fizik' ? 'teal' : member.subject === 'Matematik' ? 'purple' : 'green'}>{member.subject}</Badge></div>
    </Card>
  );
}
