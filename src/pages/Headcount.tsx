import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Users, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { useStore } from '../store';
import type { HeadcountRow, Subject } from '../types';
import { Card, PageHeader, PrimaryBtn, Modal, Field, inputCls, Select, SubjectTabs, EmptyState, IconBtn, Badge, TableWrap } from '../components/ui';
import { uid, cn } from '../utils';
import { TINGKATAN, SUBJECTS } from '../seed';

export default function Headcount() {
  const { data, addItem, updateItem, removeItem, notify, confirm } = useStore();
  const [subject, setSubject] = useState<Subject | 'Semua'>('Semua');
  const [tingkatan, setTingkatan] = useState('');
  const [editing, setEditing] = useState<HeadcountRow | 'new' | null>(null);
  const [form, setForm] = useState({ subject: 'Fizik' as Subject, tingkatan: TINGKATAN[0], kelas: '', tov: 80, etr: 70, actual: 0 });

  const filtered = useMemo(() => data.headcounts.filter((h) =>
    (subject === 'Semua' || h.subject === subject) && (!tingkatan || h.tingkatan === tingkatan)
  ), [data.headcounts, subject, tingkatan]);

  const chartData = useMemo(() => filtered.map((h) => ({
    name: `${h.kelas}`,
    'Sasaran TOV': h.tov,
    'Sasaran ETR': h.etr,
    'Pencapaian Sebenar': h.actual,
  })), [filtered]);

  const openNew = () => { setForm({ subject: subject === 'Matematik' ? 'Matematik' : 'Fizik', tingkatan: tingkatan || TINGKATAN[0], kelas: '', tov: 80, etr: 70, actual: 0 }); setEditing('new'); };
  const openEdit = (h: HeadcountRow) => { setForm({ subject: h.subject, tingkatan: h.tingkatan, kelas: h.kelas, tov: h.tov, etr: h.etr, actual: h.actual }); setEditing(h); };

  const save = () => {
    if (!form.kelas.trim()) { notify('Sila masukkan nama kelas', 'error'); return; }
    const payload = { subject: form.subject, tingkatan: form.tingkatan, kelas: form.kelas, tov: form.tov, etr: form.etr, actual: form.actual };
    if (editing === 'new') { addItem('headcounts', { id: uid(), ...payload }); notify('Data headcount ditambah'); }
    else if (editing) { updateItem('headcounts', editing.id, payload); notify('Data dikemas kini'); }
    setEditing(null);
  };

  const avg = (k: 'tov' | 'etr' | 'actual') => filtered.length ? Math.round(filtered.reduce((s, h) => s + h[k], 0) / filtered.length) : 0;

  return (
    <div>
      <PageHeader title="Headcount Pencapaian" subtitle="Data headcount murid — sasaran TOV, ETR dan pencapaian sebenar" actions={<PrimaryBtn onClick={openNew}><Plus className="w-4 h-4" /> Tambah Data</PrimaryBtn>} />

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <SubjectTabs value={subject} onChange={setSubject} />
        <Select value={tingkatan} onChange={setTingkatan} options={TINGKATAN} placeholder="Semua Tingkatan" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard icon={Target} label="Purata Sasaran TOV" value={`${avg('tov')}%`} color="bg-purple" />
        <SummaryCard icon={TrendingUp} label="Purata Sasaran ETR" value={`${avg('etr')}%`} color="bg-teal" />
        <SummaryCard icon={Users} label="Purata Pencapaian" value={`${avg('actual')}%`} color="bg-green" />
      </div>

      <div className="grid lg:grid-cols-5 gap-5 mb-6">
        <Card className="lg:col-span-3 p-5">
          <h3 className="font-bold text-navy mb-4">Graf Perbandingan Pencapaian (%)</h3>
          {chartData.length === 0 ? <EmptyState subtitle="Tiada data untuk dipaparkan" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Sasaran TOV" fill="#6B66C2" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Sasaran ETR" fill="#175F7D" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Pencapaian Sebenar" fill="#40D926" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-bold text-navy mb-4">Trend Pencapaian</h3>
          {chartData.length === 0 ? <EmptyState subtitle="Tiada data" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Pencapaian Sebenar" stroke="#40D926" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Sasaran TOV" stroke="#6B66C2" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card>
        {filtered.length === 0 ? <EmptyState subtitle="Tiada data headcount sepadan" /> : (
          <TableWrap>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Kelas</th>
                  <th className="px-5 py-3">Mata Pelajaran</th>
                  <th className="px-5 py-3">Tingkatan</th>
                  <th className="px-5 py-3 text-center">TOV (%)</th>
                  <th className="px-5 py-3 text-center">ETR (%)</th>
                  <th className="px-5 py-3 text-center">Pencapaian (%)</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((h) => {
                  const pct = Math.min(100, Math.round((h.actual / h.tov) * 100));
                  const ok = h.actual >= h.etr;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-semibold text-slate-800">{h.kelas}</td>
                      <td className="px-5 py-3"><Badge color={h.subject === 'Fizik' ? 'teal' : 'purple'}>{h.subject}</Badge></td>
                      <td className="px-5 py-3 text-slate-600">{h.tingkatan}</td>
                      <td className="px-5 py-3 text-center text-slate-600">{h.tov}</td>
                      <td className="px-5 py-3 text-center text-slate-600">{h.etr}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn('h-full rounded-full', ok ? 'bg-green' : 'bg-amber-400')} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-semibold text-slate-700 w-10">{h.actual}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center"><Badge color={ok ? 'green' : 'amber'}>{ok ? 'Capai' : 'Bawah'}</Badge></td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <IconBtn icon={Pencil} onClick={() => openEdit(h)} title="Edit" />
                          <IconBtn icon={Trash2} onClick={() => confirm(`Padam data ${h.kelas}?`, () => { removeItem('headcounts', h.id); notify('Data dipadam'); })} title="Padam" danger />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      {editing && (
        <Modal title={editing === 'new' ? 'Tambah Data Headcount' : 'Edit Data Headcount'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mata Pelajaran">
                <Select value={form.subject} onChange={(v) => setForm({ ...form, subject: v as Subject })} options={[...SUBJECTS]} className="w-full" />
              </Field>
              <Field label="Tingkatan">
                <Select value={form.tingkatan} onChange={(v) => setForm({ ...form, tingkatan: v })} options={TINGKATAN} className="w-full" />
              </Field>
            </div>
            <Field label="Nama Kelas">
              <input className={inputCls} value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} placeholder="cth: 4 Bestari" />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              {([['tov', 'Sasaran TOV (%)'], ['etr', 'Sasaran ETR (%)'], ['actual', 'Pencapaian (%)']] as const).map(([k, label]) => (
                <Field key={k} label={label}>
                  <input type="number" min={0} max={100} className={inputCls} value={form[k]} onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} />
                </Field>
              ))}
            </div>
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

function SummaryCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white', color)}><Icon className="w-5 h-5" /></div>
      <div><p className="text-xl font-bold text-navy">{value}</p><p className="text-xs text-slate-500">{label}</p></div>
    </Card>
  );
}
