import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  useStore,
  store,
} from "@/lib/store/patrol-store";
import {
  getActiveSession,
} from "@/lib/helpers/time";
import {
  validateScan,
} from "@/lib/helpers/validation";
import type { ScanValidation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, ScanLine, AlertTriangle, CheckCircle2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/petugas/scan")({
  component: ScannerPage,
});

type Step = "scanning" | "denied" | "capture" | "done";

function ScannerPage() {
  const user = useStore((s) => s.user);
  const checkpoints = useStore((s) => s.checkpoints);
  const sessions = useStore((s) => s.sessions);
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("scanning");
  const [result, setResult] = useState<ScanValidation | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState<number | null>(null);
  const [completedLog, setCompletedLog] = useState<{
    timestamp: number;
    checkpointName: string;
    sessionName: string;
    photo: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, [user, navigate]);

  const requestGeo = () => {
    setGeoError(null);
    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation tidak didukung browser ini.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setGeoError(`Gagal mendapatkan lokasi: ${err.message}.`),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const performScan = (cpId: string) => {
    const r = validateScan(cpId, user?.name ?? "");
    setResult(r);
    if (r.ok) {
      setStep("capture");
      setGeo(null);
      setCaptureTime(null);
      setPhoto(null);
      requestGeo();
      toast.success(`QR valid: ${r.checkpoint.name}`);
    } else {
      setStep("denied");
      toast.error(r.message, { style: { background: "#dc2626", color: "white" } });
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
            note: r.message,
          });
        }
      }
    }
  };

  const simulateScan = () => {
    const active = getActiveSession(sessions);
    let targetId = checkpoints[0]?.id;
    if (active && user) {
      const sorted = [...checkpoints].sort((a, b) => a.urutan - b.urutan);
      const remaining = sorted.find((cp) => validateScan(cp.id, user.name).ok)?.id;
      targetId = remaining ?? sorted[0]?.id;
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
    setCaptureTime(Date.now());
  };

  const submitReport = () => {
    if (!result?.ok || !photo) return;
    const now = captureTime ?? Date.now();
    const ts = new Date();
    const [sh, sm] = result.session.startTime.split(":").map(Number);
    const [eh, em] = result.session.endTime.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const nowMin = ts.getHours() * 60 + ts.getMinutes();
    const status: "Tepat Waktu" | "Terlambat" =
      nowMin <= startMin + (endMin - startMin) * 0.7 ? "Tepat Waktu" : "Terlambat";
    store.addLog({
      sessionId: result.session.id,
      sessionName: result.session.name,
      checkpointId: result.checkpoint.id,
      checkpointCode: result.checkpoint.code,
      checkpointName: result.checkpoint.name,
      officerName: user?.name ?? "Petugas",
      timestamp: now,
      status,
      photo,
      latitude: geo?.lat,
      longitude: geo?.lng,
      sequenceNumber: result.checkpoint.urutan,
    });
    setCompletedLog({
      timestamp: now,
      checkpointName: result.checkpoint.name,
      sessionName: result.session.name,
      photo,
      latitude: geo?.lat,
      longitude: geo?.lng,
    });
    setStep("done");
    toast.success("Check-in berhasil dicatat.");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/petugas" })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900">Scan QR Titik Patroli</h1>
      </div>

      {step === "scanning" && (
        <>
          <div className="aspect-square bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-8 border-2 border-blue-400 rounded-2xl pointer-events-none" />
            <ScanLine className="absolute text-blue-400 w-8 h-8 animate-pulse" />
          </div>

          <Button
            onClick={simulateScan}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Simulasi Scan Berhasil
          </Button>

          <div>
            <p className="text-xs text-slate-500 mb-2">Atau pilih titik untuk simulasi:</p>
            <div className="grid grid-cols-2 gap-2">
              {[...checkpoints].sort((a, b) => a.urutan - b.urutan).map((cp) => (
                <Button
                  key={cp.id}
                  variant="outline"
                  size="sm"
                  onClick={() => performScan(cp.id)}
                  className="justify-start"
                >
                  <span className="font-mono text-xs mr-1">{cp.code}</span>
                  {cp.name}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {step === "denied" && result && !result.ok && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-5 space-y-4 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-red-700">Akses Ditolak</h2>
            <p className="text-sm text-red-700/90">{result.message}</p>
            <Button
              onClick={() => {
                setStep("scanning");
                setResult(null);
              }}
              variant="outline"
              className="border-red-300 text-red-700"
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "capture" && result?.ok && (
        <>
          <div className="aspect-square bg-slate-900 rounded-2xl relative overflow-hidden">
            {photo ? (
              <img src={photo} alt="Bukti" className="w-full h-full object-cover" />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 to-transparent p-3">
              <p className="text-xs text-blue-300 uppercase tracking-wide">{result.session.name}</p>
              <p className="text-white font-semibold">{result.checkpoint.name}</p>
              <p className="text-xs text-white/70 font-mono">
                {result.checkpoint.code} · Urutan {result.checkpoint.urutan}
              </p>
            </div>
          </div>

          <Card className="border-blue-100">
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Koordinat (Geotag)</p>
                  {geo ? (
                    <p className="font-mono text-xs text-slate-600">
                      {geo.lat.toFixed(6)}, {geo.lng.toFixed(6)}
                    </p>
                  ) : geoError ? (
                    <p className="text-xs text-red-600">{geoError}</p>
                  ) : (
                    <p className="text-xs text-slate-500">Mendeteksi lokasi…</p>
                  )}
                  {geoError && (
                    <Button size="sm" variant="outline" className="mt-2" onClick={requestGeo}>
                      Coba lagi
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Clock className="w-4 h-4 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium">Timestamp</p>
                  <p className="font-mono text-xs text-slate-600">
                    {new Date(captureTime ?? Date.now()).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {!photo ? (
            <Button
              onClick={takePhoto}
              size="lg"
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Camera className="w-5 h-5 mr-2" /> Ambil Foto (Live Camera)
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPhoto(null);
                  setCaptureTime(null);
                }}
              >
                Foto Ulang
              </Button>
              <Button
                onClick={submitReport}
                disabled={!geo}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Laporan
              </Button>
            </div>
          )}
          <p className="text-xs text-center text-slate-500">
            Hanya kamera langsung yang diizinkan. Upload dari galeri dinonaktifkan.
          </p>
        </>
      )}

      {step === "done" && completedLog && (
        <Card className="border-blue-200">
          <CardContent className="p-5 space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Check-in Berhasil</h2>
              <p className="text-sm text-slate-600">
                {completedLog.sessionName} · {completedLog.checkpointName}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(completedLog.timestamp).toLocaleString("id-ID")}
              </p>
              {completedLog.latitude !== undefined && (
                <p className="text-xs text-slate-500 font-mono mt-1">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {completedLog.latitude.toFixed(6)},{" "}
                  {completedLog.longitude?.toFixed(6)}
                </p>
              )}
            </div>
            {photo && (
              <img
                src={photo}
                alt="Bukti patroli"
                className="rounded-lg w-full max-h-64 object-cover border"
              />
            )}
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/petugas">Kembali ke Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}