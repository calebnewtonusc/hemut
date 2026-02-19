import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In — Hemut",
  description: "Sign in to Hemut AI Logistics OS — Operations Command and Fleet Intelligence.",
};

export default function LoginPage() {
  return <LoginClient />;
}
