import type { Metadata } from "next";
import { CommunicationsClient } from "./CommunicationsClient";

export const metadata: Metadata = {
  title: "Communications Hub — Hemut",
  description: "Unified inbox for dispatch alerts, driver check-ins, compliance events, and customer updates.",
};

export default function CommunicationsPage() {
  return <CommunicationsClient />;
}
