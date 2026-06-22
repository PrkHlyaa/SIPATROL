import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useStore,
} from "@/lib/store/patrol-store";
import {
  getActiveSession,
  isSameDay,
  toMinutes,
  nowMinutes,
} from "@/lib/helpers/time";
import { sessionProgressToday } from "@/lib/helpers/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const sessions = useStore((s) => s.sessions);
  const logs = useStore((s) => s.logs);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const active = getActiveSession(sessions, now);
  const todayLogs = logs.filter((l) => isSameDay(l.timestamp, Date.now()) && l.status !== "Ditolak");
  const missed = sessions.filter((s) => {
    if (toMinutes(s.endTime) > nowMinutes(now)) return false; // belum lewat
    const prog = sessionProgressToday(s);
    return prog.done < prog.total;
  });

  const chartData = sessions.map((s) => {
    const prog = sessionProgressToday(s);
    const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0;
    return { name: s.name, Kepatuhan: pct };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Patroli</h1>
        <p className="text-sm text-slate-500">Ringkasan operasional patroli hari ini.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Sesi Aktif Saat Ini"
          value={active ? active.name : "Tidak ada"}
          tone="emerald"
          sub={active ? `${active.startTime} - ${active.endTime}` : "Sesi berikutnya akan tampil"}
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
          label="Sesi Terlewat"
          value={String(missed.length)}
          tone="amber"
          sub={missed.map((m) => m.name).join(", ") || "Belum ada"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tingkat Kepatuhan Patroli per Sesi (Hari Ini)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: "#475569", fontSize: 12 }}
                />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="Kepatuhan" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {logs.slice(0, 6).map((l) => (
            <div key={l.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {l.officerName} · {l.checkpointName}
                </p>
                <p className="text-xs text-slate-500">
                  {l.sessionName} · {new Date(l.timestamp).toLocaleTimeString("id-ID")}
                </p>
              </div>
              <StatusBadge status={l.status} />
            </div>
          ))}
        </CardContent>
      </Card>
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
  tone: "emerald" | "slate" | "amber";
}) {
  const tones = {
    emerald: "bg-blue-50 text-blue-700",
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

export function StatusBadge({ status }: { status: "Tepat Waktu" | "Terlambat" | "Ditolak" }) {
  if (status === "Tepat Waktu")
    return <Badge className="bg-blue-100 text-blue-700 border-0">Tepat Waktu</Badge>;
  if (status === "Terlambat")
    return <Badge className="bg-amber-100 text-amber-700 border-0">Terlambat</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-0">Ditolak</Badge>;
}