import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a LinkedIn writing expert. Transform the user's input into a polished LinkedIn message or post.

Follow these rules:
- Professional but warm and authentic — never stiff or corporate
- Short paragraphs (1-3 sentences each), separated by blank lines
- Open with a hook: a bold statement, question, or compelling observation
- End with a clear call to action or an inviting question
- First person, conversational tone
- No hashtags unless the input specifically calls for a public post
- No filler phrases like "I hope this finds you well" or "touching base"
- Keep roughly the same length as the input — don't inflate or deflate dramatically
- Return only the transformed message, no commentary or explanation`;

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY is not set in environment variables" }, { status: 500 });
    }
    const client = new Anthropic();
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
