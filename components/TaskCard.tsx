"use client";

import { Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/db";

const priorityDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-gray-500",
};

const sourceTag: Record<string, string> = {
  nanoclaw: "text-violet-400",
  manual: "text-gray-500",
};

interface Props {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const overdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <div className="group bg-[#1a1a1a] border border-white/6 rounded-lg p-3.5 hover:border-white/12 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-0.5", priorityDot[task.priority] ?? "bg-gray-500")}
          />
          <p className="text-sm text-gray-100 leading-snug truncate">{task.title}</p>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mt-1.5 ml-3.5 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mt-2.5 ml-3.5">
        {task.assignee && (
          <span className="text-[10px] bg-white/6 text-gray-400 px-1.5 py-0.5 rounded font-medium">
            {task.assignee}
          </span>
        )}
        {task.due_date && (
          <span className={cn("flex items-center gap-1 text-[10px]", overdue ? "text-red-400" : "text-gray-500")}>
            <Clock size={9} />
            {new Date(task.due_date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
          </span>
        )}
        <span className={cn("text-[10px] ml-auto", sourceTag[task.source] ?? "text-gray-600")}>
          {task.source === "nanoclaw" ? "⚡ agent" : "manual"}
        </span>
      </div>
    </div>
  );
}
