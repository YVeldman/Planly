import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TaskRow } from "@/components/dashboard/TaskRow";
import { AddTaskForm } from "@/components/dashboard/AddTaskForm";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ member?: string }>;
}) {
  const user = await requireUser();
  const { member } = await searchParams;

  const members = await prisma.user.findMany({
    where: { familyId: user.familyId },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  const assigneeFilter =
    member === "me" ? user.id : member && member !== "all" ? member : undefined;

  const tasks = await prisma.task.findMany({
    where: {
      familyId: user.familyId,
      ...(assigneeFilter ? { assigneeId: assigneeFilter } : {}),
    },
    include: { assignee: true },
    orderBy: [{ done: "asc" }, { createdAt: "desc" }],
  });

  const openTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  const filters = [
    { key: "all", label: "Alle" },
    { key: "me", label: "Mijn taken" },
    ...members.filter((m) => m.id !== user.id).map((m) => ({ key: m.id, label: m.name })),
  ];
  const activeFilter = member ?? "all";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-ink-900">Taken</h1>
        <p className="text-sm text-ink-500">{openTasks.length} openstaand</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/dashboard/tasks" : `/dashboard/tasks?member=${f.key}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeFilter === f.key
                ? "bg-sage-600 text-white"
                : "border border-sage-200 text-ink-700 hover:bg-sage-100"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mb-4">
        <AddTaskForm members={members} />
      </div>

      <div className="space-y-2">
        {openTasks.length === 0 && (
          <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 shadow-sm">
            Geen openstaande taken. Goed bezig! 🎉
          </p>
        )}
        {openTasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>

      {doneTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
            Afgerond ({doneTasks.length})
          </h2>
          <div className="space-y-2">
            {doneTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
