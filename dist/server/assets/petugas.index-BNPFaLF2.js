import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { u as useStore, s as store } from "./patrol-store-BUYc-TMj.js";
import { g as getActiveSession, a as getNextSession, t as toMinutes, f as formatCountdown } from "./time-kPAIYBDk.js";
import { s as sessionProgressToday } from "./validation-8MUzf_fY.js";
import { C as Card, d as CardContent } from "./card-BgL4lcMZ.js";
import { B as Button } from "./button-BYu9da6g.js";
import { B as Badge } from "./router-CcXwsZvQ.js";
import { LogOut, ShieldAlert, AlertCircle, QrCode, Clock, Users, CheckCircle2 } from "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@tanstack/react-query";
import "sonner";
import "clsx";
import "tailwind-merge";
function PetugasDashboard() {
  const user = useStore((s) => s.user);
  const sessions = useStore((s) => s.sessions);
  const checkpoints = useStore((s) => s.checkpoints);
  const navigate = useNavigate();
  const [now, setNow] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  const active = getActiveSession(sessions, now);
  const next = getNextSession(sessions, now);
  const isAssigned = !!active && !!user && active.officerNames.includes(user.name);
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const logout = () => {
    store.setUser(null);
    navigate({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-4 py-6 space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Petugas Keamanan" }),
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-900", children: user?.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: dateStr })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: logout, className: "text-slate-600", children: /* @__PURE__ */ jsx(LogOut, { className: "w-5 h-5" }) })
    ] }),
    active && isAssigned ? /* @__PURE__ */ jsx(ActiveSessionCard, { sessionId: active.id, now }) : active && !isAssigned ? /* @__PURE__ */ jsx(Card, { className: "bg-red-50 border-red-200", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-red-700", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Anda tidak dijadwalkan untuk sesi ini." })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-700/90", children: [
        "Sesi aktif: ",
        /* @__PURE__ */ jsx("strong", { children: active.name }),
        " (",
        active.startTime,
        " - ",
        active.endTime,
        "). Bertugas: ",
        active.officerNames.join(", "),
        "."
      ] })
    ] }) }) : /* @__PURE__ */ jsx(Card, { className: "bg-amber-50 border-amber-200", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-amber-700", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Tidak ada sesi patroli aktif saat ini." })
      ] }),
      next ? /* @__PURE__ */ jsxs("p", { className: "text-sm text-amber-800", children: [
        "Sesi berikutnya: ",
        /* @__PURE__ */ jsx("strong", { children: next.name }),
        " pukul ",
        next.startTime,
        " - ",
        next.endTime,
        "."
      ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-800", children: "Tidak ada sesi terjadwal hari ini." })
    ] }) }),
    /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "w-full h-16 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/30", children: /* @__PURE__ */ jsxs(Link, { to: "/petugas/scan", children: [
      /* @__PURE__ */ jsx(QrCode, { className: "w-6 h-6 mr-2" }),
      " Scan QR Code"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-slate-700 mb-2", children: "Jadwal Sesi Hari Ini" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: sessions.slice().sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)).map((s) => {
        const prog = sessionProgressToday(s);
        const isActive = active?.id === s.id;
        const mine = !!user && s.officerNames.includes(user.name);
        return /* @__PURE__ */ jsx(Card, { className: isActive ? "border-blue-500" : mine ? "border-blue-200" : "", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-slate-900", children: s.name }),
              isActive && /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-700 border-0", children: "Aktif" }),
              mine && /* @__PURE__ */ jsx(Badge, { className: "bg-indigo-100 text-indigo-700 border-0", children: "Jadwal Anda" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
              " ",
              s.startTime,
              " - ",
              s.endTime,
              /* @__PURE__ */ jsx("span", { className: "mx-1", children: "·" }),
              /* @__PURE__ */ jsx(Users, { className: "w-3 h-3" }),
              " ",
              s.officerNames.join(", ") || "—"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Progres" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900", children: [
              prog.done,
              "/",
              checkpoints.length
            ] })
          ] })
        ] }) }, s.id);
      }) })
    ] })
  ] });
}
function ActiveSessionCard({
  sessionId,
  now
}) {
  const session = useStore((s) => s.sessions.find((x) => x.id === sessionId));
  useStore((s) => s.logs);
  const prog = sessionProgressToday(session);
  const end = new Date(now);
  const [eh, em] = session.endTime.split(":").map(Number);
  end.setHours(eh, em, 0, 0);
  const remaining = end.getTime() - now.getTime();
  const pct = Math.round(prog.done / prog.total * 100) || 0;
  return /* @__PURE__ */ jsx(Card, { className: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-blue-100/90", children: "Sesi Aktif" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mt-1", children: session.name.toUpperCase() }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-50/90 flex items-center gap-1 mt-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
          " ",
          session.startTime,
          " - ",
          session.endTime
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-100/90", children: "Sisa Waktu" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-mono font-bold", children: formatCountdown(remaining) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-50/90", children: "Progres Titik" }),
        /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
          prog.done,
          "/",
          prog.total,
          " Selesai"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-2 bg-blue-900/40 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-white rounded-full transition-all", style: {
        width: `${pct}%`
      } }) })
    ] }),
    prog.done === prog.total && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white/15 rounded-lg p-2 text-sm", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }),
      " Semua titik sesi ini sudah dicek."
    ] })
  ] }) });
}
export {
  PetugasDashboard as component
};
