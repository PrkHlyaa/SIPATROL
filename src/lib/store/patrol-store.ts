import { useSyncExternalStore } from "react";
import type { Checkpoint, PatrolSession, PatrolLog, User } from "@/lib/types";
import { DUMMY_ACCOUNTS } from "@/lib/types";

type State = {
  user: User | null;
  checkpoints: Checkpoint[];
  sessions: PatrolSession[];
  logs: PatrolLog[];
  officers: string[];
  users: User[];
};

const todayAt = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

/** Create a date N days ago at the given HH:MM */
const daysAgoAt = (daysAgo: number, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

const seedLogs = (): PatrolLog[] => {
  const logs: PatrolLog[] = [];
  // Seed logs for today
  logs.push(
    {
      id: "log-1",
      sessionId: "s-pagi",
      sessionName: "Ronda Pagi",
      checkpointId: "cp-1",
      checkpointCode: "CP-001",
      checkpointName: "Gerbang Utama",
      officerName: "Budi",
      timestamp: todayAt("07:05"),
      status: "Tepat Waktu",
      sequenceNumber: 1,
      latitude: -6.2,
      longitude: 106.816,
    },
    {
      id: "log-2",
      sessionId: "s-pagi",
      sessionName: "Ronda Pagi",
      checkpointId: "cp-2",
      checkpointCode: "CP-002",
      checkpointName: "Taman Tengah",
      officerName: "Budi",
      timestamp: todayAt("07:20"),
      status: "Tepat Waktu",
      sequenceNumber: 2,
      latitude: -6.201,
      longitude: 106.817,
    },
    {
      id: "log-3",
      sessionId: "s-pagi",
      sessionName: "Ronda Pagi",
      checkpointId: "cp-3",
      checkpointCode: "CP-003",
      checkpointName: "Area Parkir",
      officerName: "Budi",
      timestamp: todayAt("08:45"),
      status: "Terlambat",
      sequenceNumber: 3,
      latitude: -6.202,
      longitude: 106.818,
    },
    {
      id: "log-4",
      sessionId: "s-pagi",
      sessionName: "Ronda Pagi",
      checkpointId: "cp-4",
      checkpointCode: "CP-004",
      checkpointName: "Pos Jaga 2",
      officerName: "Andi",
      timestamp: todayAt("07:30"),
      status: "Tepat Waktu",
      sequenceNumber: 4,
      latitude: -6.203,
      longitude: 106.819,
    },
    {
      id: "log-rej-1",
      sessionId: "-",
      sessionName: "Di Luar Sesi",
      checkpointId: "cp-5",
      checkpointCode: "CP-005",
      checkpointName: "Pintu Belakang",
      officerName: "Asep",
      timestamp: todayAt("10:15"),
      status: "Ditolak",
      note: "Scan di luar jam sesi patroli",
    },
  );

  // Seed logs for past 6 days so warga can see 7-day history
  for (let daysAgo = 1; daysAgo <= 6; daysAgo++) {
    const dayId = `d${daysAgo}`;
    // Ronda Pagi
    logs.push(
      {
        id: `${dayId}-pagi-1`,
        sessionId: "s-pagi",
        sessionName: "Ronda Pagi",
        checkpointId: "cp-1",
        checkpointCode: "CP-001",
        checkpointName: "Gerbang Utama",
        officerName: "Budi",
        timestamp: daysAgoAt(daysAgo, "07:10"),
        status: "Tepat Waktu",
        sequenceNumber: 1,
        latitude: -6.2,
        longitude: 106.816,
      },
      {
        id: `${dayId}-pagi-2`,
        sessionId: "s-pagi",
        sessionName: "Ronda Pagi",
        checkpointId: "cp-2",
        checkpointCode: "CP-002",
        checkpointName: "Taman Tengah",
        officerName: "Budi",
        timestamp: daysAgoAt(daysAgo, "07:25"),
        status: "Tepat Waktu",
        sequenceNumber: 2,
        latitude: -6.201,
        longitude: 106.817,
      },
      {
        id: `${dayId}-pagi-3`,
        sessionId: "s-pagi",
        sessionName: "Ronda Pagi",
        checkpointId: "cp-3",
        checkpointCode: "CP-003",
        checkpointName: "Area Parkir",
        officerName: "Budi",
        timestamp: daysAgoAt(daysAgo, daysAgo % 2 === 0 ? "07:45" : "08:50"),
        status: daysAgo % 2 === 0 ? "Tepat Waktu" : "Terlambat",
        sequenceNumber: 3,
        latitude: -6.202,
        longitude: 106.818,
      },
    );
    // Ronda Siang
    logs.push(
      {
        id: `${dayId}-siang-1`,
        sessionId: "s-siang",
        sessionName: "Ronda Siang",
        checkpointId: "cp-1",
        checkpointCode: "CP-001",
        checkpointName: "Gerbang Utama",
        officerName: "Asep",
        timestamp: daysAgoAt(daysAgo, "13:10"),
        status: "Tepat Waktu",
        sequenceNumber: 1,
        latitude: -6.2,
        longitude: 106.816,
      },
      {
        id: `${dayId}-siang-2`,
        sessionId: "s-siang",
        sessionName: "Ronda Siang",
        checkpointId: "cp-2",
        checkpointCode: "CP-002",
        checkpointName: "Taman Tengah",
        officerName: "Asep",
        timestamp: daysAgoAt(daysAgo, "13:30"),
        status: daysAgo % 3 === 0 ? "Terlambat" : "Tepat Waktu",
        sequenceNumber: 2,
        latitude: -6.201,
        longitude: 106.817,
      },
    );
    // Ronda Malam (some days incomplete)
    if (daysAgo % 2 === 0) {
      logs.push(
        {
          id: `${dayId}-malam-1`,
          sessionId: "s-malam",
          sessionName: "Ronda Malam",
          checkpointId: "cp-1",
          checkpointCode: "CP-001",
          checkpointName: "Gerbang Utama",
          officerName: "Budi",
          timestamp: daysAgoAt(daysAgo, "20:10"),
          status: "Tepat Waktu",
          sequenceNumber: 1,
          latitude: -6.2,
          longitude: 106.816,
        },
        {
          id: `${dayId}-malam-2`,
          sessionId: "s-malam",
          sessionName: "Ronda Malam",
          checkpointId: "cp-2",
          checkpointCode: "CP-002",
          checkpointName: "Taman Tengah",
          officerName: "Budi",
          timestamp: daysAgoAt(daysAgo, "20:30"),
          status: "Tepat Waktu",
          sequenceNumber: 2,
          latitude: -6.201,
          longitude: 106.817,
        },
        {
          id: `${dayId}-malam-3`,
          sessionId: "s-malam",
          sessionName: "Ronda Malam",
          checkpointId: "cp-3",
          checkpointCode: "CP-003",
          checkpointName: "Area Parkir",
          officerName: "Budi",
          timestamp: daysAgoAt(daysAgo, "20:50"),
          status: "Tepat Waktu",
          sequenceNumber: 3,
          latitude: -6.202,
          longitude: 106.818,
        },
      );
    }
  }

  return logs;
};

let state: State = {
  user: null,
  checkpoints: [
    { id: "cp-1", code: "CP-001", name: "Gerbang Utama", location: "Pintu masuk depan perumahan", urutan: 1 },
    { id: "cp-2", code: "CP-002", name: "Taman Tengah", location: "Taman komunal blok B", urutan: 2 },
    { id: "cp-3", code: "CP-003", name: "Area Parkir", location: "Parkir bersama blok C", urutan: 3 },
    { id: "cp-4", code: "CP-004", name: "Pos Jaga 2", location: "Belakang clubhouse", urutan: 4 },
    { id: "cp-5", code: "CP-005", name: "Pintu Belakang", location: "Akses servis sisi utara", urutan: 5 },
  ],
  sessions: [
    {
      id: "s-pagi",
      name: "Ronda Pagi",
      startTime: "07:00",
      endTime: "09:00",
      officerNames: ["Budi", "Andi"],
    },
    {
      id: "s-siang",
      name: "Ronda Siang",
      startTime: "13:00",
      endTime: "15:00",
      officerNames: ["Asep"],
    },
    {
      id: "s-malam",
      name: "Ronda Malam",
      startTime: "20:00",
      endTime: "22:00",
      officerNames: ["Budi"],
    },
  ],
  logs: seedLogs(),
  officers: ["Budi", "Andi", "Asep"],
  users: DUMMY_ACCOUNTS.map(({ name, role, email, password }) => ({ name, role, email, password })),
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
  addUser: (u: User) =>
    setState((s) => {
      const officers =
        u.role === "petugas" && !s.officers.includes(u.name) ? [...s.officers, u.name] : s.officers;
      return { ...s, users: [...s.users, u], officers };
    }),
  updateUser: (originalName: string, patch: Partial<User>) =>
    setState((s) => {
      const users = s.users.map((u) => (u.name === originalName ? { ...u, ...patch } : u));
      const officers = users.filter((u) => u.role === "petugas").map((u) => u.name);
      return { ...s, users, officers };
    }),
  deleteUser: (name: string) =>
    setState((s) => {
      const users = s.users.filter((u) => u.name !== name);
      const officers = users.filter((u) => u.role === "petugas").map((u) => u.name);
      return { ...s, users, officers };
    }),
};
