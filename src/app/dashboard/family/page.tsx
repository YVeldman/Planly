import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MemberCard } from "@/components/dashboard/MemberCard";
import { AddMemberForm } from "@/components/dashboard/AddMemberForm";
import { NotificationToggle } from "@/components/dashboard/NotificationToggle";

export default async function FamilyPage() {
  const user = await requireUser();

  const family = await prisma.family.findUnique({
    where: { id: user.familyId },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900">{family?.name}</h1>
        <p className="mt-1 text-sm text-ink-500">
          {family?.members.length} {family?.members.length === 1 ? "gezinslid" : "gezinsleden"}
        </p>
      </div>

      <NotificationToggle />

      <div className="mb-4 space-y-3">
        {family?.members.map((member) => (
          <MemberCard key={member.id} member={member} isSelf={member.id === user.id} />
        ))}
      </div>

      <AddMemberForm />
    </div>
  );
}
