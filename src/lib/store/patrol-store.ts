import { useSyncExternalStore } from "react";
import type { Checkpoint, PatrolSession, PatrolLog, User } from "@/lib/types";

type State = {
  user: User | null;
  checkpoints: Checkpoint[];
  sessions: PatrolSession[];
  logs: PatrolLog[];
  officers: string[];
};

const todayAt = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

const seedLogs = (): PatrolLog[] => {
  const now = Date.now();
  return [
    {
      id: "log-1",
      sessionId: "s-pagi",
      sessionName: "Ronde Pagi",
      checkpointId: "cp-1",
      checkpointCode: "CP-001",
      checkpointName: "Gerbang Utama",
      officerName: "Satpam A",
      timestamp: todayAt("07:05"),
      status: "Tepat Waktu",
    },
    {
      id: "log-2",
      sessionId: "s-pagi",
      sessionName: "Ronde Pagi",
      checkpointId: "cp-2",
      checkpointCode: "CP-002",
      checkpointName: "Taman Tengah",
      officerName: "Satpam A",
      timestamp: todayAt("07:20"),
      status: "Tepat Waktu",
    },
    {
      id: "log-3",
      sessionId: "s-pagi",
      sessionName: "Ronde Pagi",
      checkpointId: "cp-3",
      checkpointCode: "CP-003",
      checkpointName: "Area Parkir",
      officerName: "Satpam A",
      timestamp: todayAt("08:45"),
      status: "Terlambat",
    },
    {
      id: "log-4",
      sessionId: "s-pagi",
      sessionName: "Ronde Pagi",
      checkpointId: "cp-4",
      checkpointCode: "CP-004",
      checkpointName: "Pos Jaga 2",
      officerName: "Satpam A",
      timestamp: todayAt("07:30"),
      status: "Tepat Waktu",
    },
    {
      id: "log-rej-1",
      sessionId: "-",
      sessionName: "Di Luar Sesi",
      checkpointId: "cp-5",
      checkpointCode: "CP-005",
      checkpointName: "Pintu Belakang",
      officerName: "Satpam B",
      timestamp: todayAt("10:15"),
      status: "Ditolak",
      note: "Scan di luar jam sesi patroli",
    },
  ];
};

let state: State = {
  user: null,
  checkpoints: [
    { id: "cp-1", code: "CP-001", name: "Gerbang Utama", location: "Pintu masuk depan perumahan" },
    { id: "cp-2", code: "CP-002", name: "Taman Tengah", location: "Taman komunal blok B" },
    { id: "cp-3", code: "CP-003", name: "Area Parkir", location: "Parkir bersama blok C" },
    { id: "cp-4", code: "CP-004", name: "Pos Jaga 2", location: "Belakang clubhouse" },
    { id: "cp-5", code: "CP-005", name: "Pintu Belakang", location: "Akses servis sisi utara" },
  ],
  sessions: [
    {
      id: "s-pagi",
      name: "Ronde Pagi",
      startTime: "07:00",
      endTime: "09:00",
      officerNames: ["Satpam A"],
    },
    {
      id: "s-siang",
      name: "Ronde Siang",
      startTime: "13:00",
      endTime: "15:00",
      officerNames: ["Satpam B"],
    },
    {
      id: "s-malam",
      name: "Ronde Malam",
      startTime: "20:00",
      endTime: "22:00",
      officerNames: ["Satpam C"],
    },
  ],
  logs: seedLogs(),
  officers: ["Satpam A", "Satpam B", "Satpam C"],
};

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const emit = () => listeners.forEach((l) => l());
const getSnapshot = () => state;
const setState = (updater: (s: State) => State) => {
  state = updater(state);
  emit();
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

export const store = {
  get: getSnapshot,
  setUser: (user: User | null) => setState((s) => ({ ...s, user })),
  addCheckpoint: (cp: Omit<Checkpoint, "id">) =>
    setState((s) => ({ ...s, checkpoints: [...s.checkpoints, { ...cp, id: `cp-${Date.now()}` }] })),
  updateCheckpoint: (id: string, patch: Partial<Checkpoint>) =>
    setState((s) => ({
      ...s,
      checkpoints: s.checkpoints.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  deleteCheckpoint: (id: string) =>
    setState((s) => ({
      ...s,
      checkpoints: s.checkpoints.filter((c) => c.id !== id),
    })),
  addSession: (sess: Omit<PatrolSession, "id">) =>
    setState((s) => ({ ...s, sessions: [...s.sessions, { ...sess, id: `s-${Date.now()}` }] })),
  updateSession: (id: string, patch: Partial<PatrolSession>) =>
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
  deleteSession: (id: string) =>
    setState((s) => ({ ...s, sessions: s.sessions.filter((x) => x.id !== id) })),
  addLog: (log: Omit<PatrolLog, "id">) =>
    setState((s) => ({ ...s, logs: [{ ...log, id: `log-${Date.now()}` }, ...s.logs] })),
};
