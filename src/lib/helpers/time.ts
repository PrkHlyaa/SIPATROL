import type { PatrolSession } from "@/lib/types";

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const nowMinutes = (d = new Date()) => d.getHours() * 60 + d.getMinutes();

export const isSessionActive = (s: PatrolSession, d = new Date()) => {
  const n = nowMinutes(d);
  return n >= toMinutes(s.startTime) && n <= toMinutes(s.endTime);
};

export const getActiveSession = (sessions: PatrolSession[], d = new Date()) =>
  sessions.find((s) => isSessionActive(s, d)) ?? null;

export const getNextSession = (sessions: PatrolSession[], d = new Date()) => {
  const n = nowMinutes(d);
  const upcoming = [...sessions]
    .filter((s) => toMinutes(s.startTime) > n)
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
  return upcoming[0] ?? null;
};

export const formatCountdown = (ms: number) => {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

export const isSameDay = (a: number, b: number) => {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};
