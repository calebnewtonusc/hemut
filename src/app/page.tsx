import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hemut - Freight Management Platform",
  description: "Manage freight operations, loads, drivers, and communications in one place.",
};

export default function Home() {
  redirect("/communications");
}
