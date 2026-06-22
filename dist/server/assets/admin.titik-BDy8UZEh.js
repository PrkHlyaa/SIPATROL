import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { u as useStore, s as store } from "./patrol-store-BUYc-TMj.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BgL4lcMZ.js";
import { B as Button } from "./button-BYu9da6g.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, i as DialogFooter } from "./dialog-Di2rHfih.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CjkHZ2CH.js";
import { L as Label, I as Input } from "./label-Bf2tA22Q.js";
import { Plus, QrCode, Pencil, Trash2, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import "./router-CcXwsZvQ.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-label";
function TitikPage() {
  const checkpoints = useStore((s) => s.checkpoints);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [qrCp, setQrCp] = useState(null);
  const openCreate = () => {
    setEditing({
      id: "",
      code: "",
      name: "",
      location: ""
    });
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
        location: editing.location
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Manajemen Titik Patroli" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Kelola checkpoint fisik dan QR code untuk dipasang di lapangan." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: openCreate, className: "bg-blue-600 hover:bg-blue-700 text-white", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
        " Tambah Titik"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { children: [
        "Daftar Titik (",
        checkpoints.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Kode" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Nama" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Lokasi" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: checkpoints.map((cp) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono", children: cp.code }),
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: cp.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-slate-600", children: cp.location }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right space-x-1", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setQrCp(cp), children: /* @__PURE__ */ jsx(QrCode, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => {
              setEditing(cp);
              setIsNew(false);
            }, children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setDeleteId(cp.id), className: "text-red-600 hover:text-red-700", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }, cp.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: isNew ? "Tambah Titik Patroli" : "Edit Titik Patroli" }) }),
      editing && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { children: "Kode" }),
          /* @__PURE__ */ jsx(Input, { value: editing.code, onChange: (e) => setEditing({
            ...editing,
            code: e.target.value
          }), placeholder: "CP-006" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { children: "Nama Titik" }),
          /* @__PURE__ */ jsx(Input, { value: editing.name, onChange: (e) => setEditing({
            ...editing,
            name: e.target.value
          }), placeholder: "Gerbang Belakang" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { children: "Lokasi" }),
          /* @__PURE__ */ jsx(Input, { value: editing.location, onChange: (e) => setEditing({
            ...editing,
            location: e.target.value
          }), placeholder: "Sisi utara blok D" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setEditing(null), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { onClick: save, className: "bg-blue-600 hover:bg-blue-700 text-white", children: "Simpan" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!qrCp, onOpenChange: (o) => !o && setQrCp(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "QR Code Titik Patroli" }) }),
      qrCp && /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-lg border inline-block", children: /* @__PURE__ */ jsx(QRCodeSVG, { value: `PATROL:${qrCp.id}`, size: 200, level: "M" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-slate-900", children: qrCp.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-mono text-slate-500", children: qrCp.code }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: qrCp.location })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => window.print(), children: [
        /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4 mr-1" }),
        " Cetak"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Hapus titik patroli?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Titik akan dihapus dari semua sesi patroli. Tindakan ini tidak dapat dibatalkan." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Batal" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-red-600 hover:bg-red-700", children: "Hapus" })
      ] })
    ] }) })
  ] });
}
export {
  TitikPage as component
};
