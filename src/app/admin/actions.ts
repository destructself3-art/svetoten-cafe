"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { createBooking, setBookingStatus } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUSES, bookingInput, fieldErrors, type BookingStatus } from "@/lib/validation";

export type FormState = { error?: string; fields?: Record<string, string>; ok?: string } | null;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Пароль не подошёл" };
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function updateStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as BookingStatus;
  if (!id || !BOOKING_STATUSES.includes(status)) return;
  await setBookingStatus(id, status);
  revalidatePath("/admin");
}

export async function toggleStock(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return;
  await prisma.menuItem.update({ where: { id }, data: { inStock: !item.inStock } });
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");
}

/** A booking taken by phone: same rules and the same double-booking protection as the site. */
export async function createPhoneBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const tableId = String(formData.get("tableId") ?? "");
  const parsed = bookingInput.safeParse({
    date: formData.get("date"),
    time: formData.get("time"),
    guests: formData.get("guests"),
    tableId: tableId || undefined,
    name: formData.get("name"),
    phone: formData.get("phone"),
    comment: formData.get("comment") || undefined,
    consent: true,
  });
  if (!parsed.success) return { error: "Проверьте поля", fields: fieldErrors(parsed.error) };
  const result = await createBooking(parsed.data, "admin");
  if (!result.ok) return { error: result.message };
  revalidatePath("/admin");
  return { ok: `Бронь ${result.code} создана` };
}
