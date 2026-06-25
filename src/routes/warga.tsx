import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useStore,
  store,
} from "@/lib/store/patrol-store";
import {
  getActiveSession,
  isSameDay,
  toMinutes,
} from "@/lib/helpers/time";
import {
  sessionProgressToday,
  sessionProgressForDate,
  officerProgressForDate,
} from "@/lib/helpers/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LogOut,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

export const Route = createFileRoute("/warga")({
  head: () => ({ meta: [{ title: "Warga — SIPATROL" }] }),
  component: WargaPage,
});

function WargaPage() {
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);
  const logs = useStore((s) => s.logs);
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!user || user.role !== "warga") navigate({ to: "/" });
  }, [user, navigate]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!user) return null;

  const active = getActiveSession(sessions, now);
  const todayLogs = logs.filter(
    (l) => isSameDay(l.timestamp, Date.now()) && l.status !== "Ditolak",
  );

  const logout = () => {
    store.setUser(null);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">SIPATROL · Warga</p>
              <p className="text-xs text-slate-500">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Status Patroli Hari Ini</h1>
          <p className="text-sm text-slate-500">
            Pantauan ringkas keamanan perumahan (read-only).
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Sesi Aktif"
            value={active ? active.name : "Tidak ada"}
            tone="blue"
            sub={active ? `${active.startTime} - ${active.endTime}` : "Menunggu sesi berikutnya"}
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Total Check-in Hari Ini"
            value={String(todayLogs.length)}
            tone="slate"
            sub={`${todayLogs.filter((l) => l.status === "Terlambat").length} terlambat`}
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Sesi Terjadwal"
            value={String(sessions.length)}
            tone="amber"
            sub="Sesi rutin per hari"
          />
        </div>

        <PatrolSessionReport />

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Sesi Patroli Hari Ini</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {[...sessions]
              .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
              .map((s) => {
                const prog = sessionProgressToday(s);
                const isActive = active?.id === s.id;
                return (
                  <div key={s.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{s.name}</p>
                        {isActive && (
                          <Badge className="bg-blue-100 text-blue-700 border-0">Aktif</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {s.startTime} - {s.endTime}
                        <span className="mx-1">·</span>
                        <Users className="w-3 h-3" /> {s.officerNames.join(", ") || "—"}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        prog.done === prog.total ? "text-blue-600" : "text-amber-600"
                      }`}
                    >
                      {prog.done}/{prog.total}
                    </span>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "blue" | "slate" | "amber";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${tones[tone]}`}>
          {icon}
        </div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

/** Laporan Sesi Patroli — with 7-day date picker */
export function PatrolSessionReport() {
  const sessions = useStore((s) => s.sessions);
  useStore((s) => s.logs);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const isToday = isSameDay(selectedDate.getTime(), Date.now());

  const formatDate = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatShortDate = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const navigateDate = (direction: -1 | 1) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    // Only allow within 7-day range
    const oldest = last7Days[last7Days.length - 1];
    const newest = last7Days[0];
    if (newDate >= oldest && newDate <= newest) {
      setSelectedDate(newDate);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <CardTitle>
              Laporan Sesi Patroli — {isToday ? "Hari Ini" : formatDate(selectedDate)}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateDate(-1)}
              disabled={isSameDay(selectedDate.getTime(), last7Days[last7Days.length - 1].getTime())}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateDate(1)}
              disabled={isSameDay(selectedDate.getTime(), last7Days[0].getTime())}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Date pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mt-3">
          {last7Days.map((d) => {
            const isSelected = isSameDay(d.getTime(), selectedDate.getTime());
            const isDayToday = isSameDay(d.getTime(), Date.now());
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isDayToday ? "Hari Ini" : formatShortDate(d)}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...sessions]
          .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
          .map((session) => {
            const prog = sessionProgressForDate(session, selectedDate);
            const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0;
            return (
              <div key={session.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`border-0 ${
                        pct === 100
                          ? "bg-blue-100 text-blue-700"
                          : pct > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {session.name}
                    </Badge>
                    <p className="text-xs text-slate-500">
                      {session.startTime} - {session.endTime}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      pct === 100 ? "text-blue-600" : pct > 0 ? "text-amber-600" : "text-slate-400"
                    }`}
                  >
                    {prog.done}/{prog.total}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct === 100 ? "bg-blue-600" : "bg-amber-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Per-officer breakdown */}
                <div className="grid sm:grid-cols-2 gap-2">
                  {session.officerNames.map((officer) => {
                    const op = officerProgressForDate(session, officer, selectedDate);
                    const opPct = op.total ? Math.round((op.done / op.total) * 100) : 0;
                    return (
                      <div key={officer} className="bg-slate-50 rounded-lg p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">
                            Petugas: {officer}
                          </p>
                          <span className="text-xs font-semibold text-blue-700">
                            {op.done}/{op.total}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${opPct}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600">
                          {op.doneCps.length
                            ? `${op.doneCps.map((c) => c.name).join(", ")} selesai`
                            : "Belum ada titik yang diselesaikan."}
                          {op.lateCps.length > 0 && (
                            <span className="text-amber-600 ml-1">
                              ({op.lateCps.length} terlambat)
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
