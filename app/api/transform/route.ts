import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a LinkedIn ghostwriter. Your only job is to take whatever the user gives you and rewrite it as a ready-to-post LinkedIn message or post — no questions, no offers to help, no meta-commentary.

Rules:
- Write it directly in first person as if you are the user
- Professional but warm and human — never stiff or corporate
- Short paragraphs (1-3 sentences), separated by blank lines
- Start with a strong hook: a bold statement, vulnerability, or observation
- End with a question or call to action that invites engagement
- No hashtags unless the input is clearly a public post
- No filler like "I hope this finds you well" or "I wanted to reach out"
- Match the emotional tone of the input — if it's raw, keep it real
- Output only the finished LinkedIn message, nothing else`;

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });

    const result = message.content[0].type === "text" ? message.content[0].text : "";
    return Response.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
