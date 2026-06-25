import {
  createFileRoute,
  Outlet,
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, store } from "@/lib/store/patrol-store";
import {
  LayoutDashboard,
  Map,
  QrCode,
  CalendarClock,
  ClipboardList,
  LogOut,
  Shield,
  Menu,
  Users as UsersIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationBell } from "@/components/NotificationBell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Sistem Patroli" }] }),
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/peta", label: "Peta Layout Live", icon: Map },
  { to: "/admin/titik", label: "Titik Patroli", icon: QrCode },
  { to: "/admin/sesi", label: "Sesi Patroli", icon: CalendarClock },
  { to: "/admin/users", label: "Manajemen Pengguna", icon: UsersIcon },
  { to: "/admin/riwayat", label: "Riwayat & Laporan", icon: ClipboardList },
];

function AdminLayout() {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  if (!user) return null;

  const logout = () => {
    store.setUser(null);
    navigate({ to: "/" });
  };

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-slate-200">
      <div className="flex flex-col min-h-0">
        <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Patroli Admin</p>
            <p className="text-xs text-slate-400 truncate">Sistem Check Point</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-3 border-t border-slate-800 shrink-0">
        <div className="px-2 py-2 mb-2">
          <p className="text-xs text-slate-400">Masuk sebagai</p>
          <p className="text-sm text-white font-medium truncate">{user.name}</p>
        </div>
        <button
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col">
        <SidebarInner />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-slate-900 text-white px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm font-semibold truncate">Patroli Admin</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="[&_button]:text-white [&_button:hover]:bg-slate-800">
            <NotificationBell />
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Buka menu"
              className="p-2 rounded-md hover:bg-slate-800 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-72 bg-slate-900 border-slate-800 text-slate-200"
          >
            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="md:ml-64 min-h-screen pt-14 md:pt-0 overflow-x-hidden">
        <div className="hidden md:flex sticky top-0 z-20 bg-white border-b items-center justify-end px-6 h-14">
          <NotificationBell />
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}