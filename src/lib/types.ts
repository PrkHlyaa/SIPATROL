export type Checkpoint = {
  id: string;
  code: string;
  name: string;
  location: string;
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
};

export type Role = "petugas" | "admin";
export type User = { name: string; role: Role };

export type ScanValidation =
  | { ok: true; session: PatrolSession; checkpoint: Checkpoint }
  | {
      ok: false;
      code: "NO_SESSION" | "NOT_ASSIGNED" | "UNKNOWN_CP" | "ALREADY_DONE";
      message: string;
    };
