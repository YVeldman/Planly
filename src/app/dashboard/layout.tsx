import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardNavDesktop, DashboardNavMobile } from "@/components/dashboard/Nav";
import { TopBar } from "@/components/dashboard/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const family = await prisma.family.findUnique({
    where: { id: user.familyId },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-cream-100">
      <TopBar
        familyName={family?.name ?? "Ons gezin"}
        members={family?.members ?? []}
        currentUserId={user.id}
      />
      <div className="flex flex-1">
        <DashboardNavDesktop />
        <main className="flex-1 px-5 pb-24 pt-6 md:px-8 md:pb-8">{children}</main>
      </div>
      <DashboardNavMobile />
    </div>
  );
}
