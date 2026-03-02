"use client";

import { AppointmentsProvider } from "@/lib/ui-lab/appointments-context";
import type { ReactNode } from "react";

export function UILabProviders({ children }: { children: ReactNode }) {
  return <AppointmentsProvider>{children}</AppointmentsProvider>;
}
