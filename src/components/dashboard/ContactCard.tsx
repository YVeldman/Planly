"use client";

import { useTransition } from "react";
import { Trash2, Phone, Mail, User } from "lucide-react";
import { deleteContactAction } from "@/lib/actions/contacts";

type Contact = {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export function ContactCard({ contact }: { contact: Contact }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        <User className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">{contact.name}</p>
        {contact.role && <p className="text-xs text-ink-500">{contact.role}</p>}
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1 text-xs font-medium text-sage-600 hover:underline"
            >
              <Phone className="h-3 w-3" /> {contact.phone}
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1 text-xs font-medium text-sage-600 hover:underline"
            >
              <Mail className="h-3 w-3" /> {contact.email}
            </a>
          )}
        </div>
        {contact.notes && <p className="mt-1.5 text-xs text-ink-500">{contact.notes}</p>}
      </div>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            void deleteContactAction(contact.id);
          })
        }
        className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
        aria-label={`Verwijder ${contact.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
