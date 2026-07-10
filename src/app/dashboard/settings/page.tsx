import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MemberCard } from "@/components/dashboard/MemberCard";
import { AddMemberForm } from "@/components/dashboard/AddMemberForm";
import { NotificationToggle } from "@/components/dashboard/NotificationToggle";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { FamilyNameForm } from "@/components/dashboard/FamilyNameForm";
import { CalendarSyncSection } from "@/components/dashboard/CalendarSyncSection";

export default async function SettingsPage() {
  const user = await requireUser();

  const family = await prisma.family.findUnique({
    where: { id: user.familyId },
    include: {
      members: { orderBy: { createdAt: "asc" } },
      externalFeeds: { orderBy: { createdAt: "asc" } },
    },
  });

  const me = family?.members.find((m) => m.id === user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink-900">Instellingen</h1>
        <p className="mt-1 text-sm text-ink-500">
          Beheer je profiel, gezinsleden en agenda-koppelingen.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Profiel</h2>
        {me && <ProfileForm me={{ name: me.name, color: me.color }} />}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Gezin</h2>
        <FamilyNameForm familyName={family?.name ?? ""} />
        <NotificationToggle />
        <div className="space-y-3">
          {family?.members.map((member) => (
            <MemberCard key={member.id} member={member} isSelf={member.id === user.id} />
          ))}
        </div>
        <AddMemberForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
          Agenda koppelen
        </h2>
        <CalendarSyncSection icsToken={family?.icsToken ?? ""} feeds={family?.externalFeeds ?? []} />
      </section>
    </div>
  );
}
