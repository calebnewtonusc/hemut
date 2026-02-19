import type { Metadata } from "next";
import DashboardClient from "./_dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Operations Command — Hemut",
  description: "Live fleet map, load pipeline, driver HOS board, and AI-powered ops intelligence for Hemut Logistics OS.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
