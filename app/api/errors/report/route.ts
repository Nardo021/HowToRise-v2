import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/client";

const schema = z.object({
  scope: z.string(),
  message: z.string(),
  stack: z.string().optional(),
  path: z.string().optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await prisma.errorEvent.create({ data: body });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 400 });
  }
}
