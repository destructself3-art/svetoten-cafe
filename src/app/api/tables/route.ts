import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getTableStates } from "@/lib/booking";
import { MAX_GUESTS } from "@/lib/booking-rules";

const query = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(1).max(MAX_GUESTS),
});

/** Every table with "fits" and "free" for the chosen date, time and party size. */
export async function GET(request: NextRequest) {
  const parsed = query.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Нужны дата, время и число гостей" }, { status: 400 });
  const { date, time, guests } = parsed.data;
  const tables = await getTableStates(date, time, guests);
  return NextResponse.json({ date, time, guests, tables }, { headers: { "cache-control": "no-store" } });
}
