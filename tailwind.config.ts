import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "560px",
      md: "820px",
      lg: "1100px",
      xl: "1360px",
    },
    extend: {
      colors: {
        paper: token("paper"),
        surface: token("surface"),
        sunk: token("sunk"),
        stone: token("stone"),
        ink: token("ink"),
        "ink-2": token("ink-2"),
        "ink-3": token("ink-3"),
        line: token("line"),
        honey: token("honey"),
        "honey-ink": token("honey-ink"),
        wine: token("wine"),
        brass: token("brass"),
        zinc: token("zinc"),
      },
      // Names with spaces or digits must be quoted: Tailwind 3 prints them as-is,
      // and one invalid name drops the whole font-family declaration.
      fontFamily: {
        display: ["var(--font-display)", "Didot", '"Bodoni 72"', '"Times New Roman"', "serif"],
        sans: ["var(--font-sans)", '"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"],
        label: ["var(--font-label)", '"Arial Narrow"', "var(--font-sans)", "sans-serif"],
        mono: ["ui-monospace", '"Cascadia Mono"', "SFMono-Regular", "Consolas", "monospace"],
      },
      fontSize: {
        // Type scale: display sizes are fluid, text sizes fixed
        "d-1": ["clamp(3.4rem, 9.5vw, 9.5rem)", { lineHeight: "0.86", letterSpacing: "-0.01em" }],
        "d-2": ["clamp(2.6rem, 6vw, 6rem)", { lineHeight: "0.92", letterSpacing: "-0.005em" }],
        "d-3": ["clamp(2rem, 3.6vw, 3.4rem)", { lineHeight: "1", letterSpacing: "0" }],
        "d-4": ["clamp(1.5rem, 2.2vw, 2.1rem)", { lineHeight: "1.08", letterSpacing: "0" }],
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        page: "1360px",
      },
    },
  },
  plugins: [],
} satisfies Config;
