import { createFileRoute } from "@tanstack/react-router";
import {
  useStore,
} from "@/lib/store/patrol-store";
import {
  getActiveSession,
  isSameDay,
} from "@/lib/helpers/time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/admin/peta")({
  component: PetaPage,
});

// Fixed pin positions on a stylised area map (% of container)
const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  "cp-1": { x: 12, y: 80 },
  "cp-2": { x: 45, y: 30 },
  "cp-3": { x: 75, y: 65 },
  "cp-4": { x: 30, y: 50 },
  "cp-5": { x: 85, y: 20 },
};

function PetaPage() {
  const checkpoints = useStore((s) => s.checkpoints);
  const sessions = useStore((s) => s.sessions);
  const logs = useStore((s) => s.logs);
  const active = getActiveSession(sessions);

  const isDoneToday = (cpId: string) =>
    active
      ? logs.some(
          (l) =>
            l.checkpointId === cpId &&
            l.sessionId === active.id &&
            l.status !== "Ditolak" &&
            isSameDay(l.timestamp, Date.now()),
        )
      : false;

  const pinColor = (cpId: string) => {
    if (!active) return "bg-slate-400";
    return isDoneToday(cpId) ? "bg-blue-600" : "bg-amber-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Peta Layout Live</h1>
        <p className="text-sm text-slate-500">
          {active
            ? `Sesi aktif: ${active.name} (${active.startTime} - ${active.endTime})`
            : "Tidak ada sesi aktif. Semua pin abu-abu."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perumahan Block A–C</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100">
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 70 L100 70" stroke="#94a3b8" strokeWidth="0.4" />
              <path d="M30 0 L30 100" stroke="#94a3b8" strokeWidth="0.4" />
              <path d="M70 0 L70 100" stroke="#94a3b8" strokeWidth="0.4" />
              <rect x="35" y="10" width="25" height="15" fill="#cbd5e1" />
              <rect x="35" y="75" width="25" height="15" fill="#cbd5e1" />
              <rect x="75" y="40" width="20" height="20" fill="#cbd5e1" />
            </svg>

            {checkpoints.map((cp) => {
              const pos = PIN_POSITIONS[cp.id] ?? { x: 50, y: 50 };
              return (
                <div
                  key={cp.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${pinColor(
                      cp.id,
                    )} text-white flex items-center justify-center shadow-lg ring-4 ring-white`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="mt-1 px-2 py-0.5 bg-white/90 rounded text-[10px] font-medium text-slate-700 shadow">
                    {cp.code}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-600">
            <LegendDot color="bg-blue-600" label="Sudah dicek" />
            <LegendDot color="bg-amber-500" label="Sesi berjalan – belum dicek" />
            <LegendDot color="bg-slate-400" label="Belum waktunya" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}