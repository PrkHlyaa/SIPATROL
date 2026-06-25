import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store/patrol-store";

export const Route = createFileRoute("/petugas")({
  head: () => ({ meta: [{ title: "Petugas — Sistem Patroli" }] }),
  component: PetugasLayout,
});

function PetugasLayout() {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.role !== "petugas") navigate({ to: "/" });
  }, [user, navigate]);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  );
}