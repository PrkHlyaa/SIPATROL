import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, store } from "@/lib/store/patrol-store";
import type { Checkpoint } from "@/lib/types";
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
import { Pencil, Plus, Trash2, QrCode, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/titik")({
  component: TitikPage,
});

function TitikPage() {
  const checkpoints = useStore((s) => s.checkpoints);
  const [editing, setEditing] = useState<Checkpoint | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [qrCp, setQrCp] = useState<Checkpoint | null>(null);

  const openCreate = () => {
    const nextUrutan = checkpoints.length
      ? Math.max(...checkpoints.map((c) => c.urutan)) + 1
      : 1;
    setEditing({ id: "", code: "", name: "", location: "", urutan: nextUrutan });
    setIsNew(true);
  };

  const save = () => {
    if (!editing) return;
    if (!editing.code.trim() || !editing.name.trim()) {
      toast.error("Kode dan nama wajib diisi.");
      return;
    }
    if (isNew) {
      store.addCheckpoint({
        code: editing.code,
        name: editing.name,
        location: editing.location,
        urutan: editing.urutan,
      });
      toast.success("Titik patroli ditambahkan.");
    } else {
      store.updateCheckpoint(editing.id, editing);
      toast.success("Titik patroli diperbarui.");
    }
    setEditing(null);
    setIsNew(false);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    store.deleteCheckpoint(deleteId);
    toast.success("Titik patroli dihapus.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Titik Patroli</h1>
          <p className="text-sm text-slate-500">
            Kelola checkpoint fisik dan QR code untuk dipasang di lapangan.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-1" /> Tambah Titik
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Titik ({checkpoints.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...checkpoints].sort((a, b) => a.urutan - b.urutan).map((cp) => (
                <TableRow key={cp.id}>
                  <TableCell className="font-mono">{cp.urutan}</TableCell>
                  <TableCell className="font-mono">{cp.code}</TableCell>
                  <TableCell className="font-medium">{cp.name}</TableCell>
                  <TableCell className="text-slate-600">{cp.location}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="outline" size="sm" onClick={() => setQrCp(cp)}>
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(cp);
                        setIsNew(false);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(cp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNew ? "Tambah Titik Patroli" : "Edit Titik Patroli"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Urutan Patroli</Label>
                <Input
                  type="number"
                  min={1}
                  value={editing.urutan}
                  onChange={(e) => setEditing({ ...editing, urutan: Number(e.target.value) || 1 })}
                />
                <p className="text-xs text-slate-500">Satpam wajib scan titik sesuai urutan.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Kode</Label>
                <Input
                  value={editing.code}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  placeholder="CP-006"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nama Titik</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Gerbang Belakang"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Lokasi</Label>
                <Input
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  placeholder="Sisi utara blok D"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Batal
            </Button>
            <Button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!qrCp} onOpenChange={(o) => !o && setQrCp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code Titik Patroli</DialogTitle>
          </DialogHeader>
          {qrCp && (
            <div className="text-center space-y-3">
              <div className="bg-white p-4 rounded-lg border inline-block">
                <QRCodeSVG value={`PATROL:${qrCp.id}`} size={200} level="M" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{qrCp.name}</p>
                <p className="text-sm font-mono text-slate-500">{qrCp.code}</p>
                <p className="text-xs text-slate-500">{qrCp.location}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1" /> Cetak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus titik patroli?</AlertDialogTitle>
            <AlertDialogDescription>
              Titik akan dihapus dari semua sesi patroli. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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