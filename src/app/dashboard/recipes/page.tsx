import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { RecipeCard } from "@/components/dashboard/RecipeCard";
import { todayDateStringInAppTimezone } from "@/lib/timezone";

export default async function RecipesPage() {
  const user = await requireUser();

  const recipes = await prisma.meal.findMany({
    where: { familyId: user.familyId, favorite: true },
    orderBy: { date: "desc" },
    distinct: ["title"],
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900">Mijn recepten</h1>
        <p className="mt-1 text-sm text-ink-500">
          Je favoriete maaltijden, klaar om zo weer op een dag in te plannen.
        </p>
      </div>

      {recipes.length === 0 ? (
        <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
          Nog geen favorieten. Vink &quot;Favoriet&quot; aan bij een maaltijd om &apos;m hier terug te zien.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} defaultDate={todayDateStringInAppTimezone()} />
          ))}
        </div>
      )}
    </div>
  );
}
