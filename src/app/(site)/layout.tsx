import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <TransitionProvider>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </TransitionProvider>
    </SmoothScroll>
  );
}
