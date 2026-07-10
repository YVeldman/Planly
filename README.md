# Planly — Plan life together

De alles-in-één gezinsplanner: agenda, taken en gezinsleden in één rustige, overzichtelijke app.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Credentials provider)
- Web Push (taak-notificaties) via `web-push`

## Lokaal draaien

Je hebt een lokale of remote PostgreSQL-database nodig (bijv. via `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`).

```bash
cp .env.example .env
# vul DATABASE_URL (en DIRECT_URL, zie hieronder) in
npm install
npx prisma migrate dev
npm run dev
```

Lokaal (of met een niet-pooled database) mogen `DATABASE_URL` en `DIRECT_URL` gewoon dezelfde waarde hebben.

Open [http://localhost:3000](http://localhost:3000).

## Deployen naar Vercel

1. **Database**

   Optie A — **Neon** (via Vercel Storage tab): Project → **Storage** → **Create Database** → **Postgres**. Zet automatisch `DATABASE_URL`; vul dan `DIRECT_URL` met dezelfde waarde (Neon's pooler werkt ook voor migraties).

   Optie B — **Supabase**: maak een project op [supabase.com](https://supabase.com) → **Project Settings → Database → Connection string**:
   - Kopieer de **Transaction pooler**-string (poort `6543`, bevat `?pgbouncer=true`) → dit wordt `DATABASE_URL`.
   - Kopieer de **Session pooler** of directe verbinding (poort `5432`) → dit wordt `DIRECT_URL` (nodig omdat Prisma-migraties niet door de transaction pooler heen werken).

2. **Repo importeren**
   - Ga naar [vercel.com/new](https://vercel.com/new) en importeer deze GitHub-repo.
   - Framework preset: Next.js (wordt automatisch gedetecteerd).
   - Build command / output: standaard laten staan.

3. **Environment variables** (Project → Settings → Environment Variables):

   | Variabele | Waarde |
   |---|---|
   | `DATABASE_URL` | pooled connection string (zie stap 1) |
   | `DIRECT_URL` | directe (non-pooled) connection string (zie stap 1) |
   | `AUTH_SECRET` | genereer met `openssl rand -base64 32` |
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | genereer met `npx web-push generate-vapid-keys` |
   | `VAPID_PRIVATE_KEY` | idem, het private deel |
   | `VAPID_SUBJECT` | `mailto:jouw-email@domein.nl` |

   Vul elke variabele apart in via **"+ Add More"** (Key + Value), of gebruik de link **"paste the .env contents"** om er meerdere in één keer uit een geplakt blok te laten splitsen — plak dat blok niet in het Value-veld van één handmatige variabele.

4. **Database-schema**: dit gebeurt automatisch — de `build`-script draait `prisma migrate deploy` vóór `next build`, dus zolang `DATABASE_URL`/`DIRECT_URL` als env var staan, hoef je niets extra te configureren.

5. **Deploy**. Vercel bouwt en publiceert automatisch bij elke push naar de gekoppelde branch.

## Agenda koppelen met Apple of Google Agenda

Via **Instellingen → Agenda koppelen** kun je:

- **Exporteren**: kopieer de persoonlijke iCal-link en voeg die toe als agenda-abonnement in Apple Agenda of Google Agenda (Instellingen → Agenda toevoegen → Op URL abonneren). Alle Planly-afspraken verschijnen dan automatisch in die app.
- **Importeren**: plak de geheime iCal-link van je eigen Apple- of Google Agenda om die afspraken in Planly te tonen. Gebruik de sync-knop om handmatig te verversen.

## Projectstructuur

- `src/app` — pagina's (landing, login/signup, dashboard)
- `src/app/api/calendar/[token]` — publieke iCal-exportfeed per gezin
- `src/components` — UI-componenten (landing, auth, dashboard)
- `src/lib/actions` — server actions (auth, events, tasks, family, contacts, calendarSync, profile)
- `src/lib/push.ts` — Web Push verzending
- `src/lib/ics.ts` / `src/lib/icsParser.ts` — iCalendar export/import
- `prisma/schema.prisma` — datamodel (Family, User, Event, Task, Contact, ExternalCalendarFeed, PushSubscription)
