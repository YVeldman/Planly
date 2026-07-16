"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toggleTaskAction, deleteTaskAction } from "@/lib/actions/tasks";
import { getCategory } from "@/lib/categories";
import { TaskDetailModal } from "@/components/dashboard/TaskDetailModal";

type Member = { id: string; name: string };

type Task = {
  id: string;
  title: string;
  done: boolean;
  category: string;
  dueDate: Date | null;
  assignee: { id: string; name: string; color: string } | null;
};

export function TaskRow({
  task,
  members = [],
  showDelete = true,
}: {
  task: Task;
  members?: Member[];
  showDelete?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [detailOpen, setDetailOpen] = useState(false);
  const category = getCategory(task.category);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDetailOpen(true);
          }
        }}
        className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
      >
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(() => toggleTaskAction(task.id, !task.done));
          }}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
            task.done ? "border-sage-500 bg-sage-500" : "border-sage-300 bg-white"
          }`}
          aria-label={task.done ? "Markeer als niet gedaan" : "Markeer als gedaan"}
        >
          {task.done && (
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
              <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${category.bg} ${category.fg}`}>
          <category.icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${task.done ? "text-ink-500 line-through" : "text-ink-900"}`}>
            {task.title}
          </p>
          {task.assignee && <p className="text-xs text-ink-500">{task.assignee.name}</p>}
        </div>
        {showDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startTransition(() => deleteTaskAction(task.id));
            }}
            className="shrink-0 rounded-lg p-1.5 text-ink-400 transition hover:bg-peach-100 hover:text-[#a35b36]"
            aria-label="Verwijder taak"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <TaskDetailModal task={task} members={members} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
}
