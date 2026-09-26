import { NextResponse, type NextRequest } from "next/server";
import { cancelByGuest } from "@/lib/booking";
import { cancelInput, fieldErrors } from "@/lib/validation";

/** A guest cancels their own booking by confirming the last four digits of the phone. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const parsed = cancelInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: fieldErrors(parsed.error).phoneLast4 ?? "Проверьте цифры" }, { status: 422 });
  }
  const result = await cancelByGuest(code.toUpperCase(), parsed.data.phoneLast4);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: 409 });
  return NextResponse.json({ ok: true });
}
