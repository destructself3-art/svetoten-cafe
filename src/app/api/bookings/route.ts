import { after, NextResponse, type NextRequest } from "next/server";
import { createBooking, getBookingByCode } from "@/lib/booking";
import { notifyNewBooking } from "@/lib/telegram";
import { bookingInput, fieldErrors } from "@/lib/validation";

/** Creates a booking. 201 with the code, 422 for invalid fields, 409 when the table or time is gone. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать форму" }, { status: 400 });
  }

  const parsed = bookingInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Проверьте поля формы", fields: fieldErrors(parsed.error) }, { status: 422 });
  }

  const result = await createBooking(parsed.data, "site");
  if (!result.ok) {
    const status = result.reason === "unavailable" ? 422 : 409;
    return NextResponse.json({ error: result.message, reason: result.reason }, { status });
  }

  after(async () => {
    const booking = await getBookingByCode(result.code);
    if (booking) await notifyNewBooking(booking);
  });

  return NextResponse.json({ code: result.code }, { status: 201 });
}
