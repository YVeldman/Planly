import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-sage-200 bg-cream-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-ink-500">
              De alles-in-één gezinsplanner die schema&apos;s, taken en boodschappen
              samenbrengt in één rustige, overzichtelijke app.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold text-ink-900">Product</p>
              <ul className="space-y-2 text-ink-500">
                <li><a href="#features" className="hover:text-sage-600">Functies</a></li>
                <li><a href="#how-it-works" className="hover:text-sage-600">Hoe het werkt</a></li>
                <li><a href="#faq" className="hover:text-sage-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-ink-900">Account</p>
              <ul className="space-y-2 text-ink-500">
                <li><Link href="/login" className="hover:text-sage-600">Inloggen</Link></li>
                <li><Link href="/signup" className="hover:text-sage-600">Gratis starten</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-sage-200 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Planly. Plan life together.</p>
          <p>Gemaakt met 🌿 voor gezinnen overal.</p>
        </div>
      </div>
    </footer>
  );
}
