export type Checkpoint = {
  id: string;
  code: string;
  name: string;
  location: string;
  urutan: number;
};

export type PatrolSession = {
  id: string;
  name: string;
  startTime: string; // "HH:MM"
  endTime: string;
  officerNames: string[]; // satpam yang bertugas pada sesi ini
};

export type PatrolLog = {
  id: string;
  sessionId: string;
  sessionName: string;
  checkpointId: string;
  checkpointCode: string;
  checkpointName: string;
  officerName: string;
  timestamp: number; // ms epoch
  status: "Tepat Waktu" | "Terlambat" | "Ditolak";
  photo?: string; // dataURL
  note?: string;
  latitude?: number;
  longitude?: number;
  sequenceNumber?: number;
};

export type Role = "petugas" | "admin" | "warga";
export type User = { name: string; role: Role; email?: string; password?: string };

export type DummyAccount = { name: string; role: Role; label: string; email: string; password: string };

export const DUMMY_ACCOUNTS: DummyAccount[] = [
  { name: "Budi", role: "petugas", label: "Budi (Satpam)", email: "budi@sipatrol.id", password: "budi123" },
  { name: "Andi", role: "petugas", label: "Andi (Satpam)", email: "andi@sipatrol.id", password: "andi123" },
  { name: "Asep", role: "petugas", label: "Asep (Satpam)", email: "asep@sipatrol.id", password: "asep123" },
  { name: "Pak RT", role: "warga", label: "Pak RT (Warga)", email: "pakrt@sipatrol.id", password: "warga123" },
  { name: "Admin Pusat", role: "admin", label: "Admin Pusat (Admin)", email: "admin@sipatrol.id", password: "admin123" },
];

export type ScanValidation =
  | { ok: true; session: PatrolSession; checkpoint: Checkpoint }
  | {
      ok: false;
      code: "NO_SESSION" | "NOT_ASSIGNED" | "UNKNOWN_CP" | "ALREADY_DONE" | "WRONG_ORDER";
      message: string;
    };
