import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGroq, JOB_PARSE_SYSTEM_PROMPT } from "@/lib/groq";
import { v4 as uuidv4 } from "uuid";

function extractJson(content: string): string {
  let s = content.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```[\s\n]*$/m, "");
  }
  return s.trim();
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: JOB_PARSE_SYSTEM_PROMPT },
        { role: "user", content: `Parse this job description: "${transcript}"` },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No content from Groq");

    const parsed = JSON.parse(extractJson(content)) as {
      line_items: Array<Record<string, unknown>>;
    };

    parsed.line_items = parsed.line_items.map((item) => ({
      ...item,
      id: uuidv4(),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
