import Link from "next/link";
import {
  Users,
  CalendarDays,
  CheckCircle2,
  ShoppingCart,
  UtensilsCrossed,
  Heart,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/Header";
import { LandingFooter } from "@/components/landing/Footer";
import { PhonePreview } from "@/components/landing/PhonePreview";

const features = [
  {
    icon: Users,
    title: "Voor het hele gezin",
    description: "Voeg iedereen toe: ouders, kinderen en zelfs oma en opa. Elk gezinslid krijgt een eigen kleur en profiel.",
  },
  {
    icon: CalendarDays,
    title: "Overzicht van de week",
    description: "Eén gedeelde agenda voor school, werk, sport en afspraken. Zie in één oogopslag wie wat doet en wanneer.",
  },
  {
    icon: CheckCircle2,
    title: "Taken en klusjes",
    description: "Verdeel huishoudelijke taken en klusjes, wijs ze toe aan gezinsleden en vink ze samen af.",
  },
  {
    icon: ShoppingCart,
    title: "Boodschappen gemaakt makkelijk",
    description: "Eén gedeelde boodschappenlijst die altijd up-to-date is, waar je ook bent.",
  },
  {
    icon: UtensilsCrossed,
    title: "Maaltijdplanning",
    description: "Plan het weekmenu samen en voorkom het dagelijkse 'wat eten we vanavond?'.",
  },
  {
    icon: Heart,
    title: "Meer tijd samen",
    description: "Minder plannen, meer leven. Planly houdt overzicht zodat jullie meer tijd voor elkaar hebben.",
  },
];

const steps = [
  {
    number: "1",
    title: "Maak jullie gezin aan",
    description: "Start een gratis account en geef jullie gezin een naam.",
  },
  {
    number: "2",
    title: "Nodig gezinsleden uit",
    description: "Voeg partner, kinderen en andere gezinsleden toe met hun eigen profiel en kleur.",
  },
  {
    number: "3",
    title: "Plan samen, leef rustiger",
    description: "Voeg afspraken en taken toe en houd iedereen automatisch op de hoogte.",
  },
];

const faqs = [
  {
    question: "Is Planly gratis te gebruiken?",
    answer: "Ja. Je kunt gratis een gezin aanmaken, gezinsleden toevoegen en de agenda en taken gebruiken.",
  },
  {
    question: "Hoeveel gezinsleden kan ik toevoegen?",
    answer: "Zoveel als je wilt — van een gezin met twee personen tot een groot huishouden met opa's en oma's erbij.",
  },
  {
    question: "Zijn onze gegevens veilig?",
    answer: "Jullie gezinsgegevens zijn alleen zichtbaar voor de leden van jullie eigen gezin en worden versleuteld opgeslagen.",
  },
  {
    question: "Werkt Planly op mijn telefoon?",
    answer: "Planly werkt in elke moderne browser, op telefoon, tablet en computer — zonder installatie.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-peach-100/50 blur-3xl" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-1.5 text-xs font-semibold text-sage-700">
                <Sparkles className="h-3.5 w-3.5" />
                De gezinsplanner voor rustige weken
              </span>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
                Plan life together.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-700">
                Planly is de alles-in-één gezinsplanner die agenda&apos;s, taken,
                boodschappen en maaltijden samenbrengt in één rustige, overzichtelijke
                app — voor jou en de rest van je gezin.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-full bg-sage-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-sage-700"
                >
                  Gratis starten
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-full border border-sage-300 px-7 py-3.5 text-center text-sm font-semibold text-ink-900 transition hover:bg-sage-50"
                >
                  Hoe het werkt
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-500">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sage-500" /> Voor het hele gezin
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-sage-500" /> Gedeelde agenda
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sage-500" /> Taken en klusjes
                </div>
              </div>
            </div>
            <PhonePreview />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-cream-50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
                Alles wat jullie gezin nodig heeft
              </h2>
              <p className="mt-4 text-ink-700">
                Geen losse appjes en briefjes op de koelkast meer. Planly brengt alles
                samen op één rustige plek.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-sage-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sage-100 text-sage-600">
                    <feature.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-semibold text-ink-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
                Binnen 2 minuten aan de slag
              </h2>
              <p className="mt-4 text-ink-700">
                Geen ingewikkelde installatie. Maak een account, nodig je gezin uit en
                begin met plannen.
              </p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative rounded-2xl bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sage-600 font-serif text-lg font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner */}
        <section className="bg-sage-700 py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              Less planning. <em className="italic text-peach-200">More living.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sage-100">
              Planly regelt het overzicht, zodat jullie meer tijd overhouden voor
              waar het echt om draait: elkaar.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-sage-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Privacy voorop
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Werkt op elk apparaat
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Gemaakt voor gezinnen
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
              Veelgestelde vragen
            </h2>
            <div className="mt-12 divide-y divide-sage-200 rounded-2xl border border-sage-200 bg-white">
              {faqs.map((faq) => (
                <details key={faq.question} className="group p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink-900">
                    {faq.question}
                    <span className="ml-4 text-sage-500 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="mx-auto max-w-4xl rounded-3xl bg-cream-200 px-8 py-14 text-center">
            <h2 className="font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
              Klaar om rustiger te plannen?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink-700">
              Maak vandaag nog een gratis account voor jullie gezin.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-full bg-sage-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-sage-700"
            >
              Gratis starten
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
