import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store/patrol-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/riwayat")({
  component: RiwayatPage,
});

function StatusBadge({ status }: { status: "Tepat Waktu" | "Terlambat" | "Ditolak" }) {
  if (status === "Tepat Waktu")
    return <Badge className="bg-blue-100 text-blue-700 border-0">Tepat Waktu</Badge>;
  if (status === "Terlambat")
    return <Badge className="bg-amber-100 text-amber-700 border-0">Terlambat</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-0">Ditolak</Badge>;
}

function RiwayatPage() {
  const logs = useStore((s) => s.logs);
  const sessions = useStore((s) => s.sessions);

  const officers = useMemo(
    () => Array.from(new Set(logs.map((l) => l.officerName))),
    [logs],
  );

  const [date, setDate] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [officerFilter, setOfficerFilter] = useState("all");
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const filtered = logs.filter((l) => {
    if (sessionFilter !== "all" && l.sessionId !== sessionFilter) return false;
    if (officerFilter !== "all" && l.officerName !== officerFilter) return false;
    if (date) {
      const d = new Date(l.timestamp);
      const sel = new Date(date);
      if (
        d.getFullYear() !== sel.getFullYear() ||
        d.getMonth() !== sel.getMonth() ||
        d.getDate() !== sel.getDate()
      )
        return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ["Tanggal", "Sesi", "Petugas", "Kode", "Checkpoint", "Waktu", "Status", "Catatan"];
    const rows = filtered.map((l) => {
      const d = new Date(l.timestamp);
      return [
        d.toLocaleDateString("id-ID"),
        l.sessionName,
        l.officerName,
        l.checkpointCode,
        l.checkpointName,
        d.toLocaleTimeString("id-ID"),
        l.status,
        (l.note ?? "").replace(/"/g, '""'),
      ];
    });
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riwayat-patroli-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File CSV diunduh.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat & Laporan Patroli</h1>
          <p className="text-sm text-slate-500">
            Telusuri seluruh catatan check-in dan ekspor sebagai CSV.
          </p>
        </div>
        <Button onClick={exportCsv} className="bg-slate-900 hover:bg-slate-800 text-white">
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Tanggal</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Sesi</Label>
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua sesi</SelectItem>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
                <SelectItem value="-">Ditolak / Di luar sesi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Petugas</Label>
            <Select value={officerFilter} onValueChange={setOfficerFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua petugas</SelectItem>
                {officers.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Sesi</TableHead>
                <TableHead>Petugas</TableHead>
                <TableHead>Checkpoint</TableHead>
                <TableHead>Waktu Scan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Foto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => {
                const d = new Date(l.timestamp);
                return (
                  <TableRow key={l.id}>
                    <TableCell>{d.toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>{l.sessionName}</TableCell>
                    <TableCell>{l.officerName}</TableCell>
                    <TableCell>
                      <div className="font-medium">{l.checkpointName}</div>
                      <div className="text-xs text-slate-500 font-mono">{l.checkpointCode}</div>
                    </TableCell>
                    <TableCell>{d.toLocaleTimeString("id-ID")}</TableCell>
                    <TableCell>
                      <StatusBadge status={l.status} />
                    </TableCell>
                    <TableCell>
                      {l.photo ? (
                        <button
                          onClick={() => setPhotoSrc(l.photo!)}
                          className="text-blue-700 hover:underline text-sm inline-flex items-center gap-1"
                        >
                          <ImageIcon className="w-4 h-4" /> Lihat
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    Tidak ada data sesuai filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!photoSrc} onOpenChange={(o) => !o && setPhotoSrc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Foto Bukti Patroli</DialogTitle>
          </DialogHeader>
          {photoSrc && <img src={photoSrc} alt="Bukti patroli" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}