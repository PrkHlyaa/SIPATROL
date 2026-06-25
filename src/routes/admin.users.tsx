import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, store } from "@/lib/store/patrol-store";
import type { Role, User } from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

type Draft = { originalName: string; name: string; email: string; role: Role; password: string };

function UsersPage() {
  const users = useStore((s) => s.users);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showDraftPassword, setShowDraftPassword] = useState(false);

  const openCreate = () => {
    setDraft({ originalName: "", name: "", email: "", role: "petugas", password: "" });
    setIsNew(true);
    setShowDraftPassword(false);
  };

  const openEdit = (u: User) => {
    setDraft({
      originalName: u.name,
      name: u.name,
      email: u.email ?? "",
      role: u.role,
      password: u.password ?? "",
    });
    setIsNew(false);
    setShowDraftPassword(false);
  };

  const save = () => {
    if (!draft) return;
    if (!draft.name.trim()) return toast.error("Nama wajib diisi.");
    if (!draft.email.trim()) return toast.error("Email/Username wajib diisi.");
    if (!draft.password.trim()) return toast.error("Password wajib diisi.");
    if (isNew) {
      if (users.some((u) => u.name === draft.name)) {
        return toast.error("Nama pengguna sudah ada.");
      }
      store.addUser({ name: draft.name, email: draft.email, role: draft.role, password: draft.password });
      toast.success("Pengguna ditambahkan.");
    } else {
      store.updateUser(draft.originalName, {
        name: draft.name,
        email: draft.email,
        role: draft.role,
        password: draft.password,
      });
      toast.success("Pengguna diperbarui.");
    }
    setDraft(null);
  };

  const togglePasswordVisibility = (name: string) => {
    setShowPasswords((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500">
            Kelola akun Admin, Warga, dan Satpam.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-1" /> Tambah Pengguna
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email/Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.name}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-slate-600">{u.email ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-slate-600 font-mono">
                        {showPasswords[u.name] ? (u.password ?? "—") : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(u.name)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPasswords[u.name] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={u.role} />
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => setDeleteName(u.name)}
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

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isNew ? "Tambah Pengguna Baru" : "Edit Pengguna"}
            </DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nama</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Budi"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email / Username</Label>
                <Input
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="budi@sipatrol.id"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showDraftPassword ? "text" : "password"}
                    value={draft.password}
                    onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                    placeholder="Masukkan password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDraftPassword(!showDraftPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showDraftPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Role Pengguna</Label>
                <Select
                  value={draft.role}
                  onValueChange={(v: Role) => setDraft({ ...draft, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="warga">Warga</SelectItem>
                    <SelectItem value="petugas">Satpam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Batal
            </Button>
            <Button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteName} onOpenChange={(o) => !o && setDeleteName(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengguna akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteName) store.deleteUser(deleteName);
                toast.success("Pengguna dihapus.");
                setDeleteName(null);
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

function RoleBadge({ role }: { role: Role }) {
  if (role === "admin")
    return <Badge className="bg-indigo-100 text-indigo-700 border-0">Admin</Badge>;
  if (role === "warga")
    return <Badge className="bg-slate-100 text-slate-700 border-0">Warga</Badge>;
  return <Badge className="bg-blue-100 text-blue-700 border-0">Satpam</Badge>;
}
