import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useStore,
  store,
} from "@/lib/store/patrol-store";
import {
  getActiveSession,
  getNextSession,
  toMinutes,
  formatCountdown,
} from "@/lib/helpers/time";
import { sessionProgressToday } from "@/lib/helpers/validation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Clock, Users, LogOut, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/petugas/")({
  component: PetugasDashboard,
});

function PetugasDashboard() {
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);
  const checkpoints = useStore((s) => s.checkpoints);
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const active = getActiveSession(sessions, now);
  const next = getNextSession(sessions, now);
  const isAssigned = !!active && !!user && active.officerNames.includes(user.name);

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const logout = () => {
    store.setUser(null);
    navigate({ to: "/" });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Petugas Keamanan</p>
          <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-600">{dateStr}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-slate-600">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {active && isAssigned ? (
        <ActiveSessionCard sessionId={active.id} now={now} />
      ) : active && !isAssigned ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-red-700">
              <ShieldAlert className="w-5 h-5" />
              <p className="font-semibold">Anda tidak dijadwalkan untuk sesi ini.</p>
            </div>
            <p className="text-sm text-red-700/90">
              Sesi aktif: <strong>{active.name}</strong> ({active.startTime} - {active.endTime}). Bertugas: {active.officerNames.join(", ")}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-5 h-5" />
              <p className="font-semibold">Tidak ada sesi patroli aktif saat ini.</p>
            </div>
            {next ? (
              <p className="text-sm text-amber-800">
                Sesi berikutnya: <strong>{next.name}</strong> pukul {next.startTime} - {next.endTime}.
              </p>
            ) : (
              <p className="text-sm text-amber-800">Tidak ada sesi terjadwal hari ini.</p>
            )}
          </CardContent>
        </Card>
      )}

      <Button
        asChild
        size="lg"
        className="w-full h-16 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/30"
      >
        <Link to="/petugas/scan">
          <QrCode className="w-6 h-6 mr-2" /> Scan QR Code
        </Link>
      </Button>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Jadwal Sesi Hari Ini</h2>
        <div className="space-y-2">
          {sessions
            .slice()
            .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
            .map((s) => {
              const prog = sessionProgressToday(s);
              const isActive = active?.id === s.id;
              const mine = !!user && s.officerNames.includes(user.name);
              return (
                <Card key={s.id} className={isActive ? "border-blue-500" : mine ? "border-blue-200" : ""}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{s.name}</p>
                        {isActive && (
                          <Badge className="bg-blue-100 text-blue-700 border-0">Aktif</Badge>
                        )}
                        {mine && (
                          <Badge className="bg-indigo-100 text-indigo-700 border-0">Jadwal Anda</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {s.startTime} - {s.endTime}
                        <span className="mx-1">·</span>
                        <Users className="w-3 h-3" /> {s.officerNames.join(", ") || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Progres</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {prog.done}/{checkpoints.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function ActiveSessionCard({ sessionId, now }: { sessionId: string; now: Date }) {
  const session = useStore((s) => s.sessions.find((x) => x.id === sessionId)!);
  useStore((s) => s.logs);
  const prog = sessionProgressToday(session);
  const end = new Date(now);
  const [eh, em] = session.endTime.split(":").map(Number);
  end.setHours(eh, em, 0, 0);
  const remaining = end.getTime() - now.getTime();
  const pct = Math.round((prog.done / prog.total) * 100) || 0;

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-100/90">Sesi Aktif</p>
            <h2 className="text-2xl font-bold mt-1">{session.name.toUpperCase()}</h2>
            <p className="text-sm text-blue-50/90 flex items-center gap-1 mt-1">
              <Clock className="w-4 h-4" /> {session.startTime} - {session.endTime}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-100/90">Sisa Waktu</p>
            <p className="text-lg font-mono font-bold">{formatCountdown(remaining)}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-blue-50/90">Progres Titik</span>
            <span className="font-semibold">
              {prog.done}/{prog.total} Selesai
            </span>
          </div>
          <div className="w-full h-2 bg-blue-900/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {prog.done === prog.total && (
          <div className="flex items-center gap-2 bg-white/15 rounded-lg p-2 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Semua titik sesi ini sudah dicek.
          </div>
        )}
      </CardContent>
    </Card>
  );
}