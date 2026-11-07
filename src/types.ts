export type Subject = 'Fizik' | 'Matematik';
export type Difficulty = 'Mudah' | 'Sederhana' | 'KBAT' | 'Format SPM';
export type FileKind = 'pdf' | 'docx' | 'image' | 'video' | 'none';

export interface FileRef {
  name: string;
  data?: string; // dataURL for uploaded files
  url?: string;  // external link
  kind: FileKind;
}

export interface OrgMember {
  id: string;
  name: string;
  position: string;
  subject: Subject | 'Kedua-dua';
  photo?: string;
}

export interface Document {
  id: string;
  title: string;
  subject: Subject;
  tingkatan: string;
  bab: string;
  file: FileRef;
  description?: string;
  uploadedAt: string;
}

export interface Rph {
  id: string;
  title: string;
  subject: Subject;
  tingkatan: string;
  year: number;
  week: string;
  file: FileRef;
  uploadedAt: string;
}

export interface HeadcountRow {
  id: string;
  subject: Subject;
  tingkatan: string;
  kelas: string;
  tov: number;   // sasaran TOV (%)
  etr: number;   // sasaran ETR (%)
  actual: number;// pencapaian sebenar (%)
}

export interface Nota {
  id: string;
  title: string;
  subject: Subject;
  tingkatan: string;
  bab: string;
  subtopik: string;
  file: FileRef;
  uploadedAt: string;
}

export interface Latihan {
  id: string;
  title: string;
  subject: Subject;
  tingkatan: string;
  bab: string;
  difficulty: Difficulty;
  file: FileRef;
  skema?: FileRef;
  uploadedAt: string;
}

export interface Program {
  id: string;
  name: string;
  subject: Subject | 'Kedua-dua';
  objective: string;
  date: string;
  target: string;
  activities: string;
  report?: string;
  image?: string;
  status: 'Dirancang' | 'Berlangsung' | 'Selesai';
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
}

export type CollectionKey = 'documents' | 'rphs' | 'headcounts' | 'notas' | 'latihans' | 'programs' | 'orgMembers' | 'announcements';
