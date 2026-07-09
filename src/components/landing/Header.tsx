import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/70 bg-cream-100/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-700 md:flex">
          <a href="#features" className="hover:text-sage-600">
            Functies
          </a>
          <a href="#how-it-works" className="hover:text-sage-600">
            Hoe het werkt
          </a>
          <a href="#faq" className="hover:text-sage-600">
            Veelgestelde vragen
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-ink-700 hover:text-sage-600 sm:block"
          >
            Inloggen
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-sage-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sage-700"
          >
            Gratis starten
          </Link>
        </div>
      </div>
    </header>
  );
}
