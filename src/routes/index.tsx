import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/store/patrol-store";
import { DUMMY_ACCOUNTS } from "@/lib/types";
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
      { title: "Login — SIPATROL" },
      { name: "description", content: "Sistem patroli keamanan perumahan." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState<string>(DUMMY_ACCOUNTS[0].name);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = DUMMY_ACCOUNTS.find((a) => a.name === accountName);
    if (!acc) return;
    store.setUser({ name: acc.name, role: acc.role, email: acc.email });
    toast.success(`Selamat datang, ${acc.name}`);
    const dest = acc.role === "admin" ? "/admin" : acc.role === "warga" ? "/warga" : "/petugas";
    navigate({ to: dest });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-10">
      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-900">SIPATROL</CardTitle>
          <CardDescription>Sistem Patroli Keamanan Perumahan — masuk dengan akun demo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label>Pilih Akun</Label>
              <Select value={accountName} onValueChange={setAccountName}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DUMMY_ACCOUNTS.map((a) => (
                    <SelectItem key={a.name} value={a.name}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Pilih akun untuk masuk sesuai perannya (Satpam / Warga / Admin).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd">Kata Sandi</Label>
              <Input id="pwd" type="password" placeholder="••••••••" defaultValue="demo123" />
            </div>

            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Masuk
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
