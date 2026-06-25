import type { Checkpoint, PatrolSession, PatrolLog, ScanValidation } from "@/lib/types";
import { getActiveSession, getNextSession, isSameDay } from "@/lib/helpers/time";
import { store } from "@/lib/store/patrol-store";

export function validateScan(checkpointId: string, officerName: string): ScanValidation {
  const s = store.get();
  const checkpoint = s.checkpoints.find((c) => c.id === checkpointId);
  if (!checkpoint) {
    return { ok: false, code: "UNKNOWN_CP", message: "Titik patroli tidak dikenali." };
  }
  const active = getActiveSession(s.sessions);
  if (!active) {
    const next = getNextSession(s.sessions);
    const nextStr = next ? ` Sesi berikutnya: ${next.name} (${next.startTime} - ${next.endTime}).` : "";
    return {
      ok: false,
      code: "NO_SESSION",
      message: `Gagal: Saat ini bukan waktu patroli.${nextStr}`,
    };
  }
  if (!active.officerNames.includes(officerName)) {
    return {
      ok: false,
      code: "NOT_ASSIGNED",
      message: `Maaf, Anda tidak dijadwalkan untuk sesi ${active.name}.`,
    };
  }
  const today = Date.now();
  const done = s.logs.some(
    (l) =>
      l.sessionId === active.id &&
      l.checkpointId === checkpointId &&
      l.officerName === officerName &&
      l.status !== "Ditolak" &&
      isSameDay(l.timestamp, today),
  );
  if (done) {
    return {
      ok: false,
      code: "ALREADY_DONE",
      message: "Anda sudah menyelesaikan check-in untuk titik ini di sesi ini.",
    };
  }
  // Cek urutan checkpoint - semua titik dengan urutan < checkpoint.urutan harus sudah di-scan
  // oleh officer ini pada sesi ini.
  const sortedCps = [...s.checkpoints].sort((a, b) => a.urutan - b.urutan);
  const prevCps = sortedCps.filter((c) => c.urutan < checkpoint.urutan);
  const missing = prevCps.find(
    (prev) =>
      !s.logs.some(
        (l) =>
          l.sessionId === active.id &&
          l.checkpointId === prev.id &&
          l.officerName === officerName &&
          l.status !== "Ditolak" &&
          isSameDay(l.timestamp, today),
      ),
  );
  if (missing) {
    return {
      ok: false,
      code: "WRONG_ORDER",
      message: `Urutan salah! Harap scan Titik ${missing.name} terlebih dahulu.`,
    };
  }
  return { ok: true, session: active, checkpoint };
}

export function sessionProgressToday(session: PatrolSession): { done: number; total: number } {
  const s = store.get();
  const today = Date.now();
  const total = s.checkpoints.length;
  const done = s.checkpoints.filter((cp) =>
    s.logs.some(
      (l) =>
        l.sessionId === session.id &&
        l.checkpointId === cp.id &&
        l.status !== "Ditolak" &&
        isSameDay(l.timestamp, today),
    ),
  ).length;
  return { done, total };
}

/** Progress for a specific date (not just today) */
export function sessionProgressForDate(
  session: PatrolSession,
  date: Date,
): { done: number; total: number } {
  const s = store.get();
  const dateMs = date.getTime();
  const total = s.checkpoints.length;
  const done = s.checkpoints.filter((cp) =>
    s.logs.some(
      (l) =>
        l.sessionId === session.id &&
        l.checkpointId === cp.id &&
        l.status !== "Ditolak" &&
        isSameDay(l.timestamp, dateMs),
    ),
  ).length;
  return { done, total };
}

// Progress per officer in a given session today
export function officerProgressToday(
  session: PatrolSession,
  officerName: string,
): { done: number; total: number; doneCps: Checkpoint[] } {
  const s = store.get();
  const today = Date.now();
  const total = s.checkpoints.length;
  const doneCps = s.checkpoints.filter((cp) =>
    s.logs.some(
      (l) =>
        l.sessionId === session.id &&
        l.checkpointId === cp.id &&
        l.officerName === officerName &&
        l.status !== "Ditolak" &&
        isSameDay(l.timestamp, today),
    ),
  );
  return { done: doneCps.length, total, doneCps };
}

/** Progress per officer in a given session for a specific date */
export function officerProgressForDate(
  session: PatrolSession,
  officerName: string,
  date: Date,
): { done: number; total: number; doneCps: Checkpoint[]; lateCps: Checkpoint[] } {
  const s = store.get();
  const dateMs = date.getTime();
  const total = s.checkpoints.length;
  const doneCps = s.checkpoints.filter((cp) =>
    s.logs.some(
      (l) =>
        l.sessionId === session.id &&
        l.checkpointId === cp.id &&
        l.officerName === officerName &&
        l.status !== "Ditolak" &&
        isSameDay(l.timestamp, dateMs),
    ),
  );
  const lateCps = s.checkpoints.filter((cp) =>
    s.logs.some(
      (l) =>
        l.sessionId === session.id &&
        l.checkpointId === cp.id &&
        l.officerName === officerName &&
        l.status === "Terlambat" &&
        isSameDay(l.timestamp, dateMs),
    ),
  );
  return { done: doneCps.length, total, doneCps, lateCps };
}
