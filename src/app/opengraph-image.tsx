import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Светотень: кофейня днём, бистро вечером";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonts are tiny subsets (only the letters used below), fetched once from Google Fonts into src/app/og-fonts.
const font = (file: string) => readFile(join(process.cwd(), "src/app/og-fonts", file));

export default async function OpenGraphImage() {
  const [light, heavy, italic, sans] = await Promise.all([
    font("display-200.ttf"),
    font("display-800.ttf"),
    font("display-italic-300.ttf"),
    font("sans-600.ttf"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f3f3f0", position: "relative", fontFamily: "Display" }}>
        {/* Sunlight through a window grid, as on the site */}
        <div
          style={{
            position: "absolute",
            left: 520,
            top: -80,
            width: 760,
            height: 820,
            background: "linear-gradient(104deg, rgba(255,214,150,0) 0%, rgba(255,214,150,0.55) 30%, rgba(255,214,150,0.25) 70%, rgba(255,214,150,0) 100%)",
            transform: "skewX(-14deg)",
          }}
        />
        <div style={{ position: "absolute", right: 70, top: 175, width: 280, height: 280, borderRadius: 280, border: "4px solid #1e1d1b", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 210, height: 210, borderRadius: 210, background: "#e39b35", display: "flex", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 146, top: 0, width: 210, height: 210, borderRadius: 210, background: "#1e1d1b" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", color: "#1e1d1b" }}>
          <div style={{ fontFamily: "Sans", fontSize: 24, letterSpacing: 5, color: "#5c5d59" }}>НИЖНИЙ НОВГОРОД · УЛ. СВЕТЛАЯ, 12</div>
          <div style={{ display: "flex", fontSize: 172, lineHeight: 1, marginTop: 24 }}>
            <span style={{ fontWeight: 800 }}>Свето</span>
            <span style={{ fontWeight: 200 }}>тень</span>
          </div>
          <div style={{ fontFamily: "DisplayItalic", fontSize: 58, marginTop: 18, color: "#9a580c" }}>Кофейня днём, бистро вечером</div>
          <div style={{ fontFamily: "Sans", fontSize: 22, letterSpacing: 5, color: "#5c5d59", marginTop: 40 }}>БРОНЬ СТОЛИКА ОНЛАЙН</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: light, weight: 200, style: "normal" },
        { name: "Display", data: heavy, weight: 800, style: "normal" },
        { name: "DisplayItalic", data: italic, weight: 300, style: "italic" },
        { name: "Sans", data: sans, weight: 600, style: "normal" },
      ],
    },
  );
}
