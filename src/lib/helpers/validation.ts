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
