import { z } from "zod";
import { MAX_GUESTS } from "./booking-rules";
export { BOOKING_STATUSES, STATUS_LABELS, type BookingStatus } from "./booking-rules";
import { OCCASIONS } from "./cafe";
import { normalizePhone } from "./format";

export const bookingInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Выберите дату"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Выберите время"),
  guests: z.coerce.number().int().min(1, "Минимум один гость").max(MAX_GUESTS, `Онлайн бронируем до ${MAX_GUESTS} гостей`),
  tableId: z.string().min(1).optional(),
  name: z.string().trim().min(2, "Напишите, как к вам обращаться").max(60, "Слишком длинное имя"),
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((v) => /^7\d{10}$/.test(v), "Нужен российский номер: +7 и 10 цифр"),
  comment: z.string().trim().max(300, "Комментарий до 300 символов").optional().or(z.literal("")),
  occasion: z.enum(OCCASIONS).optional(),
  eventSlug: z.string().max(40).optional(),
  consent: z.literal(true, { error: "Нужно согласие на обработку персональных данных" }),
});

export type BookingInput = z.infer<typeof bookingInput>;

export const cancelInput = z.object({
  phoneLast4: z.string().regex(/^\d{4}$/, "Введите 4 последние цифры телефона"),
});

/** First error message per field, for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
