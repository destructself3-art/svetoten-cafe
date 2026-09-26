import type { Metadata, Viewport } from "next";
import { Noto_Serif_Display, Sofia_Sans, Sofia_Sans_Extra_Condensed } from "next/font/google";
import { ModeProvider } from "@/components/mode/ModeProvider";
import { modeScript } from "@/components/mode/mode-script";
import "./globals.css";

const display = Noto_Serif_Display({
  subsets: ["latin", "cyrillic"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Sofia_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const label = Sofia_Sans_Extra_Condensed({
  subsets: ["latin", "cyrillic"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3100"),
  title: {
    default: "Светотень — кофейня днём, бистро вечером",
    template: "%s · Светотень",
  },
  description:
    "Кофейня-бистро в Нижнем Новгороде: спешелти-кофе и завтраки днём, вино и маленькие тарелки вечером. Меню, афиша и бронь столика онлайн.",
  openGraph: {
    title: "Светотень",
    description: "Кофейня днём, бистро вечером. Бронь столика онлайн.",
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F3F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1011" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      data-mode="day"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${label.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <ModeProvider>{children}</ModeProvider>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
