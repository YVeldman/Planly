"use client";

import { useTransition } from "react";
import { Trash2, Crown } from "lucide-react";
import { removeFamilyMemberAction } from "@/lib/actions/family";

type Member = { id: string; name: string; email: string; color: string; role: string };

export function MemberCard({ member, isSelf }: { member: Member; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-sage-200 bg-white p-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: member.color }}
      >
        {member.name[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-ink-900">
            {member.name} {isSelf && <span className="font-normal text-ink-400">(jij)</span>}
          </p>
          {member.role === "owner" && <Crown className="h-3.5 w-3.5 shrink-0 text-peach-300" />}
        </div>
        <p className="truncate text-xs text-ink-500">{member.email}</p>
      </div>
      {!isSelf && (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              void removeFamilyMemberAction(member.id);
            })
          }
          className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
          aria-label={`Verwijder ${member.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
