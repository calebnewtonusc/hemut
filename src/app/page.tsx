import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Hemut - Fleet & Team Operations",
  description: "Manage fleet operations, onboarding, dispatch, and compliance for your trucking team.",
};

export default function Home() {
  redirect("/dashboard");
}
