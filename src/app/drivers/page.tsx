import type { Metadata } from "next";
import { DriversClient } from "./DriversClient";

export const metadata: Metadata = {
  title: "Drivers — Hemut",
  description: "Monitor all driver HOS clocks, CSA scores, locations, and AI-powered compliance recommendations.",
};

export default function DriversPage() {
  return <DriversClient />;
}
