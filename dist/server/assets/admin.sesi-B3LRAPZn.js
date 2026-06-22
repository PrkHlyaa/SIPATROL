import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { u as useStore, s as store } from "./patrol-store-BUYc-TMj.js";
import { s as sessionProgressToday } from "./validation-8MUzf_fY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-BgL4lcMZ.js";
import { B as Button } from "./button-BYu9da6g.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, j as DialogDescription, i as DialogFooter } from "./dialog-Di2rHfih.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CjkHZ2CH.js";
import { L as Label, I as Input } from "./label-Bf2tA22Q.js";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Plus, Pencil, Trash2 } from "lucide-react";
import { c as cn } from "./router-CcXwsZvQ.js";
import { toast } from "sonner";
import "./time-kPAIYBDk.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-alert-dialog";
import "@radix-ui/react-label";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
function SesiPage() {
  const sessions = useStore((s) => s.sessions);
  const officers = useStore((s) => s.officers);
  const [draft, setDraft] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const openCreate = () => {
    setDraft({
      id: "",
      name: "",
      startTime: "08:00",
      endTime: "10:00",
      officerNames: []
    });
    setIsNew(true);
  };
  const openEdit = (s) => {
    setDraft({
      ...s
    });
    setIsNew(false);
  };
  const toggleOfficer = (name) => {
    if (!draft) return;
    setDraft({
      ...draft,
      officerNames: draft.officerNames.includes(name) ? draft.officerNames.filter((c) => c !== name) : [...draft.officerNames, name]
    });
  };
  const save = () => {
    if (!draft) return;
    if (!draft.name.trim()) return toast.error("Nama sesi wajib diisi.");
    if (draft.startTime >= draft.endTime) return toast.error("Waktu mulai harus lebih awal dari waktu selesai.");
    if (draft.officerNames.length === 0) return toast.error("Pilih minimal 1 satpam yang bertugas.");
    if (isNew) {
      store.addSession({
        name: draft.name,
        startTime: draft.startTime,
        endTime: draft.endTime,
        officerNames: draft.officerNames
      });
      toast.success("Sesi patroli ditambahkan.");
    } else {
      store.updateSession(draft.id, draft);
      toast.success("Sesi patroli diperbarui.");
    }
    setDraft(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Manajemen Sesi Patroli" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Atur jadwal ronde dan personel satpam yang bertugas tiap sesi." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: openCreate, className: "bg-blue-600 hover:bg-blue-700 text-white", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
        " Tambah Sesi"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Daftar Sesi" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Nama Sesi" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Mulai" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Selesai" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Satpam Bertugas" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status Hari Ini" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: sessions.map((s) => {
          const prog = sessionProgressToday(s);
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: s.name }),
            /* @__PURE__ */ jsx(TableCell, { children: s.startTime }),
            /* @__PURE__ */ jsx(TableCell, { children: s.endTime }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: s.officerNames.map((o) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100", children: o }, o)) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: `text-sm font-semibold ${prog.done === prog.total ? "text-blue-600" : "text-amber-600"}`, children: [
              prog.done,
              "/",
              prog.total,
              " Selesai"
            ] }) }),
            /* @__PURE__ */ jsxs(TableCell, { className: "text-right space-x-1", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => openEdit(s), children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "text-red-600", onClick: () => setDeleteId(s.id), children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
            ] })
          ] }, s.id);
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!draft, onOpenChange: (o) => !o && setDraft(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: isNew ? "Tambah Sesi Patroli" : "Edit Sesi Patroli" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Tentukan rentang waktu dan satpam yang bertugas dalam sesi ini." })
      ] }),
      draft && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { children: "Nama Sesi" }),
          /* @__PURE__ */ jsx(Input, { value: draft.name, onChange: (e) => setDraft({
            ...draft,
            name: e.target.value
          }), placeholder: "Ronde Malam" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Waktu Mulai" }),
            /* @__PURE__ */ jsx(Input, { type: "time", value: draft.startTime, onChange: (e) => setDraft({
              ...draft,
              startTime: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx(Label, { children: "Waktu Selesai" }),
            /* @__PURE__ */ jsx(Input, { type: "time", value: draft.endTime, onChange: (e) => setDraft({
              ...draft,
              endTime: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { children: [
            "Pilih Satpam (",
            draft.officerNames.length,
            " dipilih)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border rounded-lg divide-y max-h-64 overflow-y-auto", children: [
            officers.map((o) => {
              const checked = draft.officerNames.includes(o);
              return /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50", children: [
                /* @__PURE__ */ jsx(Checkbox, { checked, onCheckedChange: () => toggleOfficer(o) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900", children: o }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Petugas keamanan" })
                ] })
              ] }, o);
            }),
            officers.length === 0 && /* @__PURE__ */ jsx("p", { className: "p-4 text-sm text-slate-500 text-center", children: "Belum ada satpam terdaftar." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDraft(null), children: "Batal" }),
        /* @__PURE__ */ jsx(Button, { onClick: save, className: "bg-blue-600 hover:bg-blue-700 text-white", children: "Simpan Sesi" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Hapus sesi patroli?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Riwayat patroli yang sudah tercatat tetap tersimpan." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Batal" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => {
          if (deleteId) store.deleteSession(deleteId);
          toast.success("Sesi dihapus.");
          setDeleteId(null);
        }, className: "bg-red-600 hover:bg-red-700", children: "Hapus" })
      ] })
    ] }) })
  ] });
}
export {
  SesiPage as component
};
