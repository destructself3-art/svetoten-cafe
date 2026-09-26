/** 1150 -> "1 150 ₽" with a narrow no-break space, as in a printed menu. */
export function rub(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/\s/g, " ")} ₽`;
}

/** Keeps digits only and normalizes a Russian number to 7XXXXXXXXXX. */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 10) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  return digits;
}

/** 79161234567 -> "+7 916 123-45-67" */
export function formatPhone(digits: string): string {
  const d = normalizePhone(digits);
  if (d.length !== 11) return digits;
  return `+${d[0]} ${d.slice(1, 4)} ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

/** Hides the middle of a phone number for lists: "+7 916 •••-••-67" */
export function maskPhone(digits: string): string {
  const d = normalizePhone(digits);
  if (d.length !== 11) return "•••";
  return `+${d[0]} ${d.slice(1, 4)} •••-••-${d.slice(9, 11)}`;
}

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function guestsLabel(n: number): string {
  return `${n} ${plural(n, "гость", "гостя", "гостей")}`;
}
