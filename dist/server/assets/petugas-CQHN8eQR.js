import { jsx } from "react/jsx-runtime";
import { useNavigate, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { u as useStore } from "./patrol-store-BUYc-TMj.js";
function PetugasLayout() {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.role !== "petugas") navigate({
      to: "/"
    });
  }, [user, navigate]);
  if (!user) return null;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsx(Outlet, {}) });
}
export {
  PetugasLayout as component
};
