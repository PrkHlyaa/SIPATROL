import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, User, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store, useStore } from "@/lib/store/patrol-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login — Sistem Patroli Keamanan" },
      { name: "description", content: "Sistem check point keamanan perumahan berbasis sesi patroli." },
      { property: "og:title", content: "Sistem Patroli Keamanan" },
      { property: "og:description", content: "Guard tour system berbasis sesi patroli." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const officers = useStore((s) => s.officers);
  const [role, setRole] = useState<"petugas" | "admin">("petugas");
  const [officer, setOfficer] = useState<string>(officers[0] ?? "Satpam A");
  const [adminName, setAdminName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName =
      role === "admin" ? adminName.trim() || "Admin Perumahan" : officer;
    store.setUser({ name: displayName, role });
    toast.success(`Selamat datang, ${displayName}`);
    navigate({ to: role === "admin" ? "/admin" : "/petugas" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-10">
      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Sistem Patroli Keamanan</CardTitle>
          <CardDescription>Masuk untuk memulai sesi patroli atau mengelola sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setRole("petugas")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${
                  role === "petugas"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                <User className="w-4 h-4" /> Petugas Keamanan
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${
                  role === "admin" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>

            {role === "petugas" ? (
              <div className="space-y-2">
                <Label>Pilih Satpam</Label>
                <Select value={officer} onValueChange={setOfficer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {officers.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Jadwal sesi akan otomatis menyesuaikan satpam yang dipilih.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="name">Nama Admin</Label>
                <Input
                  id="name"
                  placeholder="Admin Perumahan"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="pwd">Kata Sandi</Label>
              <Input id="pwd" type="password" placeholder="••••••••" defaultValue="demo123" />
            </div>

            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Masuk sebagai {role === "admin" ? "Admin" : "Petugas"}
            </Button>
            <p className="text-xs text-center text-slate-500">
              Mode demo — kata sandi tidak divalidasi.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
