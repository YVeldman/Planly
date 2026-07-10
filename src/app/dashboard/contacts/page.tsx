import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ContactCard } from "@/components/dashboard/ContactCard";
import { AddContactForm } from "@/components/dashboard/AddContactForm";

export default async function ContactsPage() {
  const user = await requireUser();

  const contacts = await prisma.contact.findMany({
    where: { familyId: user.familyId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900">Contacten</h1>
        <p className="mt-1 text-sm text-ink-500">
          Belangrijke contacten voor het hele gezin, zoals huisarts, school of oppas.
        </p>
      </div>

      <div className="mb-4 space-y-3">
        {contacts.length === 0 && (
          <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
            Nog geen contacten opgeslagen.
          </p>
        )}
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      <AddContactForm />
    </div>
  );
}
