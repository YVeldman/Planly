import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/lib/actions/signout";

type Member = { id: string; name: string; color: string };

export function TopBar({
  familyName,
  members,
  currentUserId,
}: {
  familyName: string;
  members: Member[];
  currentUserId: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-sage-200 bg-cream-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <Logo className="hidden md:flex" />
        <div className="md:ml-2 md:border-l md:border-sage-200 md:pl-4">
          <p className="text-xs text-ink-500">Gezin</p>
          <p className="text-sm font-semibold text-ink-900">{familyName}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {members.slice(0, 6).map((member) => (
            <div
              key={member.id}
              title={member.name}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold text-white ${
                member.id === currentUserId ? "border-sage-600" : "border-white"
              }`}
              style={{ backgroundColor: member.color }}
            >
              {member.name[0]?.toUpperCase()}
            </div>
          ))}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full border border-sage-200 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-sage-100"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Uitloggen</span>
          </button>
        </form>
      </div>
    </header>
  );
}
