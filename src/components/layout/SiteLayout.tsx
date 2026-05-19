import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/layout/Navbar";

export function SiteLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
}
