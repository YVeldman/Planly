# Planly — Plan life together

De alles-in-één gezinsplanner: agenda, taken en gezinsleden in één rustige, overzichtelijke app.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite
- NextAuth (Credentials provider)

## Aan de slag

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Maak een account aan via "Gratis starten" om een gezin op te zetten.

## Projectstructuur

- `src/app` — pagina's (landing, login/signup, dashboard)
- `src/components` — UI-componenten (landing, auth, dashboard)
- `src/lib/actions` — server actions (auth, events, tasks, family)
- `prisma/schema.prisma` — datamodel (Family, User, Event, Task)
