import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { tutorialUpsertSchema } from "@/server/content/schemas";
import { getAdminTutorialList, upsertTutorial } from "@/server/content/admin-repository";
import { revalidateTutorialContent } from "@/server/cache/revalidate";

export async function GET() {
  try {
    await requireAdmin();
    const items = await getAdminTutorialList();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const payload = tutorialUpsertSchema.parse(await req.json());
    const tutorial = await upsertTutorial(payload);
    revalidateTutorialContent(tutorial.slug);
    return NextResponse.json({ ok: true, tutorial });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "save_failed" }, { status: 400 });
  }
}
