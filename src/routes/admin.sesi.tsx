import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useStore,
  store,
} from "@/lib/store/patrol-store";
import { sessionProgressToday } from "@/lib/helpers/validation";
import type { PatrolSession } from "@/lib/types";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/sesi")({
  component: SesiPage,
});

type Draft = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  officerNames: string[];
};

function SesiPage() {
  const sessions = useStore((s) => s.sessions);
  const officers = useStore((s) => s.officers);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setDraft({ id: "", name: "", startTime: "08:00", endTime: "10:00", officerNames: [] });
    setIsNew(true);
  };

  const openEdit = (s: PatrolSession) => {
    setDraft({ ...s });
    setIsNew(false);
  };

  const toggleOfficer = (name: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      officerNames: draft.officerNames.includes(name)
        ? draft.officerNames.filter((c) => c !== name)
        : [...draft.officerNames, name],
    });
  };

  const save = () => {
    if (!draft) return;
    if (!draft.name.trim()) return toast.error("Nama sesi wajib diisi.");
    if (draft.startTime >= draft.endTime) return toast.error("Waktu mulai harus lebih awal dari waktu selesai.");
    if (draft.officerNames.length === 0) return toast.error("Pilih minimal 1 satpam yang bertugas.");
    if (isNew) {
      store.addSession({
        name: draft.name,
        startTime: draft.startTime,
        endTime: draft.endTime,
        officerNames: draft.officerNames,
      });
      toast.success("Sesi patroli ditambahkan.");
    } else {
      store.updateSession(draft.id, draft);
      toast.success("Sesi patroli diperbarui.");
    }
    setDraft(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Sesi Patroli</h1>
          <p className="text-sm text-slate-500">
            Atur jadwal ronde dan personel satpam yang bertugas tiap sesi.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-1" /> Tambah Sesi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Sesi</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Sesi</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead>Satpam Bertugas</TableHead>
                <TableHead>Status Hari Ini</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => {
                const prog = sessionProgressToday(s);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.startTime}</TableCell>
                    <TableCell>{s.endTime}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {s.officerNames.map((o) => (
                          <span
                            key={o}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100"
                          >
                            {o}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-semibold ${
                          prog.done === prog.total ? "text-blue-600" : "text-amber-600"
                        }`}
                      >
                        {prog.done}/{prog.total} Selesai
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => setDeleteId(s.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? "Tambah Sesi Patroli" : "Edit Sesi Patroli"}</DialogTitle>
            <DialogDescription>
              Tentukan rentang waktu dan satpam yang bertugas dalam sesi ini.
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nama Sesi</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Ronde Malam"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Waktu Mulai</Label>
                  <Input
                    type="time"
                    value={draft.startTime}
                    onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Waktu Selesai</Label>
                  <Input
                    type="time"
                    value={draft.endTime}
                    onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pilih Satpam ({draft.officerNames.length} dipilih)</Label>
                <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                  {officers.map((o) => {
                    const checked = draft.officerNames.includes(o);
                    return (
                      <label
                        key={o}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50"
                      >
                        <Checkbox checked={checked} onCheckedChange={() => toggleOfficer(o)} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{o}</p>
                          <p className="text-xs text-slate-500">Petugas keamanan</p>
                        </div>
                      </label>
                    );
                  })}
                  {officers.length === 0 && (
                    <p className="p-4 text-sm text-slate-500 text-center">
                      Belum ada satpam terdaftar.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Batal
            </Button>
            <Button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white">
              Simpan Sesi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus sesi patroli?</AlertDialogTitle>
            <AlertDialogDescription>
              Riwayat patroli yang sudah tercatat tetap tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) store.deleteSession(deleteId);
                toast.success("Sesi dihapus.");
                setDeleteId(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}