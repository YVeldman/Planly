# Planly — Plan life together

De alles-in-één gezinsplanner: agenda, taken en gezinsleden in één rustige, overzichtelijke app.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Credentials provider) met verplichte e-mailbevestiging
- Web Push (taak-notificaties) via `web-push`
- Resend voor transactionele e-mail (accountbevestiging)

## Lokaal draaien

Je hebt een lokale of remote PostgreSQL-database nodig (bijv. via `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`).

```bash
cp .env.example .env
# vul DATABASE_URL in (zie hierboven)
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Zonder een echte `RESEND_API_KEY` wordt de bevestigingslink gewoon in de server-console gelogd, zodat je lokaal kunt testen zonder e-maildienst.

## Deployen naar Vercel

1. **Database (Neon Postgres)**
   - Ga naar je project in Vercel → tab **Storage** → **Create Database** → kies **Postgres** (aangedreven door Neon).
   - Vercel zet automatisch een `DATABASE_URL` env var voor je project.

2. **Repo importeren**
   - Ga naar [vercel.com/new](https://vercel.com/new) en importeer deze GitHub-repo.
   - Framework preset: Next.js (wordt automatisch gedetecteerd).
   - Build command / output: standaard laten staan.

3. **Environment variables** (Project → Settings → Environment Variables):

   | Variabele | Waarde |
   |---|---|
   | `DATABASE_URL` | (automatisch gezet door de Neon-integratie, of je eigen Postgres-connection string) |
   | `AUTH_SECRET` | genereer met `openssl rand -base64 32` |
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | genereer met `npx web-push generate-vapid-keys` |
   | `VAPID_PRIVATE_KEY` | idem, het private deel |
   | `VAPID_SUBJECT` | `mailto:jouw-email@domein.nl` |
   | `RESEND_API_KEY` | API-key uit je [Resend](https://resend.com) account |
   | `EMAIL_FROM` | bijv. `Planly <onboarding@resend.dev>` (zie hieronder) |
   | `NEXT_PUBLIC_APP_URL` | de definitieve URL van je Vercel-deployment, bijv. `https://planly.vercel.app` |

4. **Database-schema**: dit gebeurt automatisch — de `build`-script draait `prisma migrate deploy` vóór `next build`, dus zolang `DATABASE_URL` als env var staat, hoef je niets extra te configureren.

5. **Resend-domein**: zonder een geverifieerd eigen domein kan Resend alleen naar het e-mailadres van je eigen Resend-account mailen (testmodus). Voor echte gebruikers: voeg in Resend een domein toe (Domains → Add Domain) en zet de gevraagde DNS-records (SPF/DKIM) bij je domeinregistrar. Gebruik daarna bijv. `EMAIL_FROM="Planly <noreply@jouwdomein.nl>"`.

6. **Deploy**. Vercel bouwt en publiceert automatisch bij elke push naar de gekoppelde branch.

## Projectstructuur

- `src/app` — pagina's (landing, login/signup, e-mailverificatie, dashboard)
- `src/components` — UI-componenten (landing, auth, dashboard)
- `src/lib/actions` — server actions (auth, events, tasks, family)
- `src/lib/email.ts` — Resend-integratie voor transactionele e-mail
- `src/lib/verification.ts` — aanmaken/versturen van e-mailverificatietokens
- `src/lib/push.ts` — Web Push verzending
- `prisma/schema.prisma` — datamodel (Family, User, Event, Task, PushSubscription, VerificationToken)
