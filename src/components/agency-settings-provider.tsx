"use client";

import { createContext, useContext } from "react";
import type { PublicAgencySettings } from "@/lib/getAgencySettings";

const AgencySettingsContext = createContext<PublicAgencySettings | null>(null);

export function AgencySettingsProvider({ settings, children }: { settings: PublicAgencySettings; children: React.ReactNode }) {
  return <AgencySettingsContext.Provider value={settings}>{children}</AgencySettingsContext.Provider>;
}

export function useAgencySettings() {
  const settings = useContext(AgencySettingsContext);
  if (!settings) throw new Error("Agency settings are unavailable.");
  return settings;
}
