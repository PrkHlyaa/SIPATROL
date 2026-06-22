import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { u as useStore, s as store } from "./patrol-store-BUYc-TMj.js";
import { g as getActiveSession } from "./time-kPAIYBDk.js";
import { v as validateScan } from "./validation-8MUzf_fY.js";
import { B as Button } from "./button-BYu9da6g.js";
import { C as Card, d as CardContent } from "./card-BgL4lcMZ.js";
import { ArrowLeft, ScanLine, AlertTriangle, Camera, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./router-CcXwsZvQ.js";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
function ScannerPage() {
  const user = useStore((s) => s.user);
  const checkpoints = useStore((s) => s.checkpoints);
  const sessions = useStore((s) => s.sessions);
  const navigate = useNavigate();
  const [step, setStep] = useState("scanning");
  const [result, setResult] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [completedLog, setCompletedLog] = useState(null);
  const webcamRef = useRef(null);
  useEffect(() => {
    if (!user) navigate({
      to: "/"
    });
  }, [user, navigate]);
  const performScan = (cpId) => {
    const r = validateScan(cpId, user?.name ?? "");
    setResult(r);
    if (r.ok) {
      setStep("capture");
      toast.success(`QR valid: ${r.checkpoint.name}`);
    } else {
      setStep("denied");
      toast.error(r.message);
      if (user) {
        const cp = checkpoints.find((c) => c.id === cpId);
        if (cp) {
          store.addLog({
            sessionId: "-",
            sessionName: "Ditolak",
            checkpointId: cp.id,
            checkpointCode: cp.code,
            checkpointName: cp.name,
            officerName: user.name,
            timestamp: Date.now(),
            status: "Ditolak",
            note: r.message
          });
        }
      }
    }
  };
  const simulateScan = () => {
    const active = getActiveSession(sessions);
    let targetId = checkpoints[0]?.id;
    if (active && user) {
      const remaining = checkpoints.find((cp) => validateScan(cp.id, user.name).ok)?.id;
      targetId = remaining ?? checkpoints[0]?.id;
    }
    if (!targetId) return;
    performScan(targetId);
  };
  const takePhoto = () => {
    if (!webcamRef.current || !result?.ok) return;
    const img = webcamRef.current.getScreenshot();
    if (!img) {
      toast.error("Gagal mengambil foto, periksa izin kamera.");
      return;
    }
    setPhoto(img);
    const now = Date.now();
    const ts = /* @__PURE__ */ new Date();
    const [sh, sm] = result.session.startTime.split(":").map(Number);
    const [eh, em] = result.session.endTime.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const nowMin = ts.getHours() * 60 + ts.getMinutes();
    const status = nowMin <= startMin + (endMin - startMin) * 0.7 ? "Tepat Waktu" : "Terlambat";
    store.addLog({
      sessionId: result.session.id,
      sessionName: result.session.name,
      checkpointId: result.checkpoint.id,
      checkpointCode: result.checkpoint.code,
      checkpointName: result.checkpoint.name,
      officerName: user?.name ?? "Petugas",
      timestamp: now,
      status,
      photo: img
    });
    setCompletedLog({
      timestamp: now,
      checkpointName: result.checkpoint.name,
      sessionName: result.session.name,
      photo: img
    });
    setStep("done");
    toast.success("Check-in berhasil dicatat.");
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-4 py-5 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate({
        to: "/petugas"
      }), children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-slate-900", children: "Scan QR Titik Patroli" })
    ] }),
    step === "scanning" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center", children: [
        /* @__PURE__ */ jsx(Webcam, { audio: false, ref: webcamRef, screenshotFormat: "image/jpeg", videoConstraints: {
          facingMode: "environment"
        }, className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-8 border-2 border-blue-400 rounded-2xl pointer-events-none" }),
        /* @__PURE__ */ jsx(ScanLine, { className: "absolute text-blue-400 w-8 h-8 animate-pulse" })
      ] }),
      /* @__PURE__ */ jsx(Button, { onClick: simulateScan, size: "lg", className: "w-full bg-blue-600 hover:bg-blue-700 text-white", children: "Simulasi Scan Berhasil" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mb-2", children: "Atau pilih titik untuk simulasi:" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: checkpoints.map((cp) => /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => performScan(cp.id), className: "justify-start", children: [
          /* @__PURE__ */ jsx("span", { className: "font-mono text-xs mr-1", children: cp.code }),
          cp.name
        ] }, cp.id)) })
      ] })
    ] }),
    step === "denied" && result && !result.ok && /* @__PURE__ */ jsx(Card, { className: "border-red-200 bg-red-50", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-7 h-7 text-red-600" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-red-700", children: "Akses Ditolak" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700/90", children: result.message }),
      /* @__PURE__ */ jsx(Button, { onClick: () => {
        setStep("scanning");
        setResult(null);
      }, variant: "outline", className: "border-red-300 text-red-700", children: "Coba Lagi" })
    ] }) }),
    step === "capture" && result?.ok && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-slate-900 rounded-2xl relative overflow-hidden", children: [
        /* @__PURE__ */ jsx(Webcam, { audio: false, ref: webcamRef, screenshotFormat: "image/jpeg", videoConstraints: {
          facingMode: "environment"
        }, className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 to-transparent p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-300 uppercase tracking-wide", children: result.session.name }),
          /* @__PURE__ */ jsx("p", { className: "text-white font-semibold", children: result.checkpoint.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-white/70 font-mono", children: result.checkpoint.code })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: takePhoto, size: "lg", className: "w-full h-14 bg-blue-600 hover:bg-blue-700 text-white", children: [
        /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5 mr-2" }),
        " Ambil Foto Bukti"
      ] })
    ] }),
    step === "done" && completedLog && /* @__PURE__ */ jsx(Card, { className: "border-blue-200", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5 space-y-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-9 h-9 text-blue-600" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Check-in Berhasil" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-600", children: [
          completedLog.sessionName,
          " · ",
          completedLog.checkpointName
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: new Date(completedLog.timestamp).toLocaleString("id-ID") })
      ] }),
      photo && /* @__PURE__ */ jsx("img", { src: photo, alt: "Bukti patroli", className: "rounded-lg w-full max-h-64 object-cover border" }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "w-full bg-blue-600 hover:bg-blue-700 text-white", children: /* @__PURE__ */ jsx(Link, { to: "/petugas", children: "Kembali ke Dashboard" }) })
    ] }) })
  ] });
}
export {
  ScannerPage as component
};
