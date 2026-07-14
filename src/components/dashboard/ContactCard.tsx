"use client";

import { useActionState, useState, useTransition } from "react";
import { Trash2, Phone, Mail, User, Pencil } from "lucide-react";
import { deleteContactAction, updateContactAction } from "@/lib/actions/contacts";
import { Modal } from "@/components/dashboard/Modal";

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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setEditing(false);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setEditing(false);
            setOpen(true);
          }
        }}
        className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-sage-200 bg-white p-4 text-left transition hover:border-sage-300"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">{contact.name}</p>
          {contact.role && <p className="text-xs text-ink-500">{contact.role}</p>}
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            {contact.phone && (
              <span className="flex items-center gap-1 text-xs font-medium text-sage-600">
                <Phone className="h-3 w-3" /> {contact.phone}
              </span>
            )}
            {contact.email && (
              <span className="flex items-center gap-1 text-xs font-medium text-sage-600">
                <Mail className="h-3 w-3" /> {contact.email}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => void deleteContactAction(contact.id));
          }}
          className="shrink-0 rounded-lg p-2 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
          aria-label={`Verwijder ${contact.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Contact bewerken" : contact.name}>
        {editing ? (
          <ContactEditForm contact={contact} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
        ) : (
          <div className="space-y-3">
            {contact.role && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Rol</p>
                <p className="text-sm text-ink-900">{contact.role}</p>
              </div>
            )}
            {contact.phone && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Telefoon</p>
                <a href={`tel:${contact.phone}`} className="text-sm text-sage-600 hover:underline">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.email && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">E-mail</p>
                <a href={`mailto:${contact.email}`} className="text-sm text-sage-600 hover:underline">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.notes && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Notities</p>
                <p className="whitespace-pre-wrap text-sm text-ink-900">{contact.notes}</p>
              </div>
            )}
            {!contact.role && !contact.phone && !contact.email && !contact.notes && (
              <p className="text-sm text-ink-500">Geen extra details.</p>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700"
            >
              <Pencil className="h-3.5 w-3.5" /> Bewerken
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

function ContactEditForm({
  contact,
  onDone,
  onCancel,
}: {
  contact: Contact;
  onDone: () => void;
  onCancel: () => void;
}) {
  const updateWithId = updateContactAction.bind(null, contact.id);
  const [state, formAction, pending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const result = await updateWithId(prevState as never, formData);
    if (!result?.error) onDone();
    return result;
  }, undefined);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && <p className="text-sm text-[#a35b36]">{state.error}</p>}
      <input
        name="name"
        defaultValue={contact.name}
        placeholder="Naam"
        required
        autoFocus
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <input
        name="role"
        defaultValue={contact.role ?? ""}
        placeholder="Rol (bijv. huisarts, school, oppas)"
        className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          name="phone"
          defaultValue={contact.phone ?? ""}
          placeholder="Telefoonnummer"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
        <input
          name="email"
          type="email"
          defaultValue={contact.email ?? ""}
          placeholder="E-mailadres"
          className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
        />
      </div>
      <textarea
        name="notes"
        defaultValue={contact.notes ?? ""}
        placeholder="Notities (optioneel)"
        rows={2}
        className="w-full resize-none rounded-lg border border-sage-200 px-3 py-2 text-sm outline-none focus:border-sage-400"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border border-sage-200 py-2 text-sm font-medium text-ink-700 transition hover:bg-sage-100"
        >
          Annuleren
        </button>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:opacity-60"
        >
          {pending ? "Bezig..." : "Opslaan"}
        </button>
      </div>
    </form>
  );
}
