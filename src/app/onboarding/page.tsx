import type { Metadata } from "next";
import { OnboardingClient } from "./OnboardingClient";

export const metadata: Metadata = {
  title: "Onboarding — Hemut",
  description: "DOT-compliant structured onboarding framework for CDL drivers, dispatchers, finance, and admin roles.",
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
