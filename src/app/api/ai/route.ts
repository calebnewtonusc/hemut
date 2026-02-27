import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { type, context } = body as {
    type: "reply" | "draft";
    context: Record<string, string>;
  };

  let systemPrompt = "";
  let userPrompt = "";

  if (type === "reply") {
    systemPrompt = `You are a professional operations assistant for Hemut, an AI-powered trucking and logistics OS.
Write concise, professional, actionable replies to messages from drivers, dispatchers, customers, and compliance systems.
Keep responses under 120 words. Be direct. Reference specific names, load numbers, and details from the message.
Sign with the appropriate department (e.g. "— Hemut Dispatch", "— Hemut Safety Dept", "— Hemut Ops Team").`;

    userPrompt = `Write a professional reply to this message:

From: ${context.from}
Channel: ${context.channel}
Subject: ${context.subject}

Message:
${context.fullBody}`;
  } else if (type === "draft") {
    systemPrompt = `You are a communications specialist for Hemut, an AI-powered trucking OS.
Write structured, professional newsletter content for a logistics fleet company.
Use ## for section headers, **bold** for key metrics, and - for bullet points.
Content should be data-driven, specific to trucking operations, and immediately useful.
Keep each section concise (3-5 sentences or bullet points max).`;

    userPrompt = `Write a complete newsletter draft for a "${context.newsletterType}" newsletter.

Audience: ${context.audience}
Sections to cover: ${context.sections}

Use realistic trucking data (RPM, loads, HOS, compliance, etc.) consistent with a growing carrier managing ~50 drivers and 247 loads/week.`;
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json(
      { error: `Anthropic API error: ${String(err)}` },
      { status: 500 }
    );
  }
}
