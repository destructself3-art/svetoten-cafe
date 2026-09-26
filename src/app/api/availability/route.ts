import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAvailability } from "@/lib/booking";
import { MAX_GUESTS } from "@/lib/booking-rules";

const query = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.coerce.number().int().min(1).max(MAX_GUESTS),
});

/** Free time slots for a date and party size. */
export async function GET(request: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Нужны дата и число гостей" }, { status: 400 });
  const slots = await getAvailability(parsed.data.date, parsed.data.guests);
  return NextResponse.json({ ...parsed.data, slots }, { headers: { "cache-control": "no-store" } });
}
