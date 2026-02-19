import type { Metadata } from "next";
import { NewsletterClient } from "./NewsletterClient";

export const metadata: Metadata = {
  title: "Newsletter System — Hemut",
  description: "Manage structured communications for drivers, dispatchers, finance, and leadership with AI-assisted drafting.",
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
