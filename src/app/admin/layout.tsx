import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Панель владельца", template: "%s · Панель «Светотени»" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100svh] bg-paper">{children}</div>;
}
