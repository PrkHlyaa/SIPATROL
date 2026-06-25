import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStore } from "@/lib/store/patrol-store";
import { getActiveSession, toMinutes, nowMinutes } from "@/lib/helpers/time";
import { sessionProgressToday } from "@/lib/helpers/validation";
import type { PatrolSession } from "@/lib/types";

type Notif = {
  id: string;
  title: string;
  message: string;
  tone: "warning" | "danger" | "info";
};

export function buildNotifications(sessions: PatrolSession[], now: Date): Notif[] {
  const notifs: Notif[] = [];
  const active = getActiveSession(sessions, now);
  for (const s of sessions) {
    const prog = sessionProgressToday(s);
    const end = toMinutes(s.endTime);
    const start = toMinutes(s.startTime);
    const cur = nowMinutes(now);
    if (active?.id === s.id && cur > start + (end - start) * 0.7 && prog.done < prog.total) {
      notifs.push({
        id: `late-${s.id}`,
        title: `Sesi ${s.name} mendekati batas waktu`,
        message: `Progres ${prog.done}/${prog.total}. Segera lengkapi titik tersisa.`,
        tone: "warning",
      });
    }
    if (cur > end && prog.done < prog.total) {
      notifs.push({
        id: `missed-${s.id}`,
        title: `Sesi ${s.name} terlewat`,
        message: `Hanya ${prog.done}/${prog.total} titik diselesaikan.`,
        tone: "danger",
      });
    }
  }
  return notifs;
}

export function NotificationBell() {
  const sessions = useStore((s) => s.sessions);
  useStore((s) => s.logs);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const notifs = buildNotifications(sessions, now);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifikasi"
          className="relative p-2 rounded-md hover:bg-slate-100 text-slate-700 transition"
        >
          <Bell className="w-5 h-5" />
          {notifs.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {notifs.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b">
          <p className="font-semibold text-slate-900">Notifikasi</p>
          <p className="text-xs text-slate-500">Peringatan keterlambatan sesi patroli.</p>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y">
          {notifs.length === 0 && (
            <p className="p-4 text-sm text-slate-500 text-center">
              Tidak ada notifikasi.
            </p>
          )}
          {notifs.map((n) => (
            <div key={n.id} className="p-3 flex gap-3">
              <span
                className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  n.tone === "danger"
                    ? "bg-red-600"
                    : n.tone === "warning"
                      ? "bg-amber-500"
                      : "bg-blue-600"
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-600">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
