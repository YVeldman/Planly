import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { GroceryRow } from "@/components/dashboard/GroceryRow";
import { AddGroceryForm } from "@/components/dashboard/AddGroceryForm";

export default async function GroceriesPage() {
  const user = await requireUser();

  const items = await prisma.groceryItem.findMany({
    where: { familyId: user.familyId },
    orderBy: [{ done: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#c17a52]">Slim inkopen</p>
        <h1 className="font-serif text-2xl font-bold text-ink-900">Boodschappenlijst.</h1>
        <p className="mt-1 text-sm text-ink-500">Een gedeelde lijst voor de volgende winkelronde.</p>
      </div>

      <div className="mb-4">
        <AddGroceryForm />
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
          Nog niks op de lijst.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {items.map((item) => (
            <GroceryRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
