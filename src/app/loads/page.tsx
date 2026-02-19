import type { Metadata } from "next";
import { LoadsClient } from "./LoadsClient";

export const metadata: Metadata = {
  title: "Load Board — Hemut",
  description: "View and manage all active, in-transit, delayed, and delivered loads with real-time AI risk scoring.",
};

export default function LoadsPage() {
  return <LoadsClient />;
}
