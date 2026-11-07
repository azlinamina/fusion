import type { Document, Rph, HeadcountRow, Nota, Latihan, Program, OrgMember, Announcement } from './types';

const today = new Date().toISOString().slice(0, 10);

export const TINGKATAN = ['Tingkatan 1', 'Tingkatan 2', 'Tingkatan 3', 'Tingkatan 4', 'Tingkatan 5'];
export const SUBJECTS = ['Fizik', 'Matematik'] as const;
export const DIFFICULTIES = ['Mudah', 'Sederhana', 'KBAT', 'Format SPM'] as const;

const samplePdf = { name: 'dokumen-contoh.pdf', kind: 'pdf' as const, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' };

export const seedDocuments: Document[] = [
  { id: 'd1', title: 'DSKP Fizik Tingkatan 4 (KSSM)', subject: 'Fizik', tingkatan: 'Tingkatan 4', bab: 'Semua Bab', file: samplePdf, description: 'Dokumen Standard Kurikulum dan Pentaksiran Fizik Tingkatan 4.', uploadedAt: '2026-01-15' },
  { id: 'd2', title: 'DSKP Fizik Tingkatan 5 (KSSM)', subject: 'Fizik', tingkatan: 'Tingkatan 5', bab: 'Semua Bab', file: samplePdf, description: 'Dokumen Standard Kurikulum dan Pentaksiran Fizik Tingkatan 5.', uploadedAt: '2026-01-15' },
  { id: 'd3', title: 'DSKP Matematik Tingkatan 4', subject: 'Matematik', tingkatan: 'Tingkatan 4', bab: 'Semua Bab', file: samplePdf, description: 'Dokumen Standard Kurikulum Matematik Tingkatan 4.', uploadedAt: '2026-02-02' },
  { id: 'd4', title: 'DSKP Matematik Tingkatan 5', subject: 'Matematik', tingkatan: 'Tingkatan 5', bab: 'Semua Bab', file: samplePdf, description: 'Dokumen Standard Kurikulum Matematik Tingkatan 5.', uploadedAt: '2026-02-02' },
];

export const seedRphs: Rph[] = [
  { id: 'r1', title: 'RPH Fizik T4 - Daya dan Gerakan I', subject: 'Fizik', tingkatan: 'Tingkatan 4', year: 2026, week: 'Minggu 1', file: samplePdf, uploadedAt: '2026-01-20' },
  { id: 'r2', title: 'RPH Fizik T4 - Daya dan Gerakan II', subject: 'Fizik', tingkatan: 'Tingkatan 4', year: 2026, week: 'Minggu 2', file: samplePdf, uploadedAt: '2026-01-27' },
  { id: 'r3', title: 'RPH Matematik T4 - Fungsi', subject: 'Matematik', tingkatan: 'Tingkatan 4', year: 2026, week: 'Minggu 1', file: samplePdf, uploadedAt: '2026-01-21' },
  { id: 'r4', title: 'RPH Matematik T5 - Vektor', subject: 'Matematik', tingkatan: 'Tingkatan 5', year: 2026, week: 'Minggu 3', file: samplePdf, uploadedAt: '2026-02-10' },
];

export const seedHeadcounts: HeadcountRow[] = [
  { id: 'h1', subject: 'Fizik', tingkatan: 'Tingkatan 4', kelas: '4 Bestari', tov: 80, etr: 70, actual: 74 },
  { id: 'h2', subject: 'Fizik', tingkatan: 'Tingkatan 4', kelas: '4 Cemerlang', tov: 80, etr: 70, actual: 68 },
  { id: 'h3', subject: 'Fizik', tingkatan: 'Tingkatan 5', kelas: '5 Amanah', tov: 85, etr: 75, actual: 79 },
  { id: 'h4', subject: 'Matematik', tingkatan: 'Tingkatan 4', kelas: '4 Bestari', tov: 85, etr: 75, actual: 71 },
  { id: 'h5', subject: 'Matematik', tingkatan: 'Tingkatan 4', kelas: '4 Cemerlang', tov: 85, etr: 75, actual: 82 },
  { id: 'h6', subject: 'Matematik', tingkatan: 'Tingkatan 5', kelas: '5 Amanah', tov: 90, etr: 80, actual: 77 },
];

export const seedNotas: Nota[] = [
  { id: 'n1', title: 'Nota Daya dan Gerakan', subject: 'Fizik', tingkatan: 'Tingkatan 4', bab: 'Daya dan Gerakan I', subtopik: 'Hukum Newton', file: samplePdf, uploadedAt: '2026-01-10' },
  { id: 'n2', title: 'Nota Gerakan Jatuh Bebas', subject: 'Fizik', tingkatan: 'Tingkatan 4', bab: 'Daya dan Gerakan II', subtopik: 'Pecutan Graviti', file: samplePdf, uploadedAt: '2026-01-24' },
  { id: 'n3', title: 'Nota Elektromagnet', subject: 'Fizik', tingkatan: 'Tingkatan 5', bab: 'Daya dan Gerakan III', subtopik: 'Medan Magnet', file: samplePdf, uploadedAt: '2026-02-05' },
  { id: 'n4', title: 'Nota Fungsi dan Graf', subject: 'Matematik', tingkatan: 'Tingkatan 4', bab: 'Fungsi', subtopik: 'Fungsi Kuadratik', file: samplePdf, uploadedAt: '2026-01-12' },
  { id: 'n5', title: 'Nota Persamaan Serentak', subject: 'Matematik', tingkatan: 'Tingkatan 5', bab: 'Vektor dan Geometri', subtopik: 'Sistem Persamaan', file: samplePdf, uploadedAt: '2026-02-08' },
  { id: 'n6', title: 'Nota Pemodelan Matematik', subject: 'Matematik', tingkatan: 'Tingkatan 5', bab: 'Pemodelan Matematik', subtopik: 'Fungsi Exponen', file: samplePdf, uploadedAt: '2026-02-14' },
];

export const seedLatihans: Latihan[] = [
  { id: 'l1', title: 'Latihan Hukum Newton', subject: 'Fizik', tingkatan: 'Tingkatan 4', bab: 'Daya dan Gerakan I', difficulty: 'Mudah', file: samplePdf, uploadedAt: '2026-01-18' },
  { id: 'l2', title: 'Latihan Gerakan Jatuh Bebas', subject: 'Fizik', tingkatan: 'Tingkatan 4', bab: 'Daya dan Gerakan II', difficulty: 'Sederhana', file: samplePdf, uploadedAt: '2026-01-30' },
  { id: 'l3', title: 'KBAT Medan Magnet', subject: 'Fizik', tingkatan: 'Tingkatan 5', bab: 'Daya dan Gerakan III', difficulty: 'KBAT', file: samplePdf, skema: samplePdf, uploadedAt: '2026-02-07' },
  { id: 'l4', title: 'Format SPM - Elektromagnet', subject: 'Fizik', tingkatan: 'Tingkatan 5', bab: 'Daya dan Gerakan III', difficulty: 'Format SPM', file: samplePdf, skema: samplePdf, uploadedAt: '2026-02-12' },
  { id: 'l5', title: 'Latihan Fungsi Kuadratik', subject: 'Matematik', tingkatan: 'Tingkatan 4', bab: 'Fungsi', difficulty: 'Mudah', file: samplePdf, uploadedAt: '2026-01-15' },
  { id: 'l6', title: 'Latihan Persamaan Serentak', subject: 'Matematik', tingkatan: 'Tingkatan 5', bab: 'Vektor dan Geometri', difficulty: 'Sederhana', file: samplePdf, skema: samplePdf, uploadedAt: '2026-02-09' },
  { id: 'l7', title: 'KBAT Pemodelan Matematik', subject: 'Matematik', tingkatan: 'Tingkatan 5', bab: 'Pemodelan Matematik', difficulty: 'KBAT', file: samplePdf, uploadedAt: '2026-02-16' },
  { id: 'l8', title: 'Format SPM - Pemodelan Matematik', subject: 'Matematik', tingkatan: 'Tingkatan 5', bab: 'Pemodelan Matematik', difficulty: 'Format SPM', file: samplePdf, skema: samplePdf, uploadedAt: '2026-02-18' },
];

export const seedPrograms: Program[] = [
  { id: 'p1', name: 'Kelas Tambah Nilai Fizik & Matematik', subject: 'Kedua-dua', objective: 'Meningkatkan pencapaian murid lemah dalam Fizik dan Matematik.', date: '2026-03-01 hingga 2026-04-30', target: 'Murid pencapaian C dan ke bawah', activities: 'Kelas bimbingan 2 kali seminggu, kuiz mingguan dan modul khas.', report: 'Laporan bulanan dikemaskini di portal.', status: 'Berlangsung' },
  { id: 'p2', name: 'Bengkel KBAT SPM', subject: 'Kedua-dua', objective: 'Melatih murid menjawab soalan KBAT format SPM.', date: '2026-05-10', target: 'Semua murid Tingkatan 5', activities: 'Bengkel interaktif, pembentangan penyelesaian dan taklimat teknik.', status: 'Dirancang' },
  { id: 'p3', name: 'Lawatan Sains ke Pusat Sains Negara', subject: 'Fizik', objective: 'Mengaitkan konsep fizik dengan aplikasi sebenar.', date: '2026-02-20', target: 'Murid Tingkatan 4 Cemerlang', activities: 'Lawatan berpandu, eksperimen demonstrasi dan refleksi.', status: 'Selesai' },
];

export const seedOrgMembers: OrgMember[] = [
  { id: 'o1', name: 'En. Ahmad Rahman', position: 'Ketua Panitia Fizik', subject: 'Fizik' },
  { id: 'o2', name: 'Pn. Siti Aminah', position: 'Ketua Panitia Matematik', subject: 'Matematik' },
  { id: 'o3', name: 'En. Daniel Chong', position: 'Guru Fizik', subject: 'Fizik' },
  { id: 'o4', name: 'Pn. Lee Mei Lin', position: 'Guru Matematik', subject: 'Matematik' },
  { id: 'o5', name: 'Pn. Norhayati', position: 'Guru Fizik', subject: 'Fizik' },
  { id: 'o6', name: 'En. Kumar Selvam', position: 'Guru Matematik', subject: 'Matematik' },
  { id: 'o7', name: 'Pn. Aisyah Bt. Abdullah', position: 'Setiausaha Panitia', subject: 'Kedua-dua' },
];

export const seedAnnouncements: Announcement[] = [
  { id: 'a1', title: 'Mesyuarat Panitia Fizik & Matematik', date: today, content: 'Mesyuarat panitia akan diadakan pada Khamis ini di bilik guru. Semua guru dikehendaki hadir.' },
  { id: 'a2', title: 'Tarikh Peperiksaan Percubaan SPM', date: today, content: 'Peperiksaan percubaan SPM dijadualkan bermula 15 Mac 2026.' },
  { id: 'a3', title: 'Kemas Kini Nota Pembelajaran', date: today, content: 'Nota Fizik Tingkatan 5 bab Elektromagnet telah dikemaskini dan dimuat naik.' },
];
