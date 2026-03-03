import { randomUUID } from "crypto";
import path from "path";
import { writeFile } from "fs/promises";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { requireAdmin } from "@/server/auth/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "missing_file" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const id = randomUUID();
    const originalRelPath = `/uploads/original/${id}.webp`;
    const thumbRelPath = `/uploads/thumbs/${id}.webp`;
    const originalAbs = path.join(process.cwd(), "public", originalRelPath);
    const thumbAbs = path.join(process.cwd(), "public", thumbRelPath);

    const converted = await sharp(buffer).webp({ quality: 86 }).toBuffer();
    const metadata = await sharp(converted).metadata();
    await writeFile(originalAbs, converted);
    const thumb = await sharp(converted).resize({ width: 480 }).webp({ quality: 80 }).toBuffer();
    await writeFile(thumbAbs, thumb);

    const media = await prisma.media.create({
      data: {
        originalPath: originalRelPath,
        thumbPath: thumbRelPath,
        mimeType: "image/webp",
        width: metadata.width ?? null,
        height: metadata.height ?? null,
        sizeBytes: converted.byteLength
      }
    });
    return NextResponse.json({ ok: true, media });
  } catch {
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
