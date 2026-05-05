"use client";

import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import type { TeamMember, Task } from "@/lib/db";

export default function TeamPage() {
  const { tasks, loading } = useTasks();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/members").then((r) => r.json()).then(setMembers);
  }, []);

  const tasksByMember = (name: string) =>
    tasks.filter((t) => t.assignee?.toLowerCase() === name.toLowerCase());

  const statusColor: Record<string, string> = {
    todo: "bg-gray-700 text-gray-300",
    in_progress: "bg-blue-900/50 text-blue-300",
    awaiting_approval: "bg-yellow-900/50 text-yellow-300",
    done: "bg-green-900/50 text-green-300",
  };

  const statusLabel: Record<string, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    awaiting_approval: "Awaiting Approval",
    done: "Done",
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500 text-sm">Loading…</div>;
  }

  const unassigned = tasks.filter((t) => !t.assignee || t.assignee.trim() === "");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Team</h1>
        <p className="text-sm text-gray-500 mt-0.5">{members.length} members · {tasks.length} total tasks</p>
      </div>

      <div className="space-y-6">
        {members.map((m) => {
          const mt = tasksByMember(m.name);
          return (
            <div key={m.id} className="bg-[#141414] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-violet-700 flex items-center justify-center text-sm font-semibold text-white">
                  {m.avatar || m.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role}</p>
                </div>
                <div className="ml-auto flex gap-3 text-center">
                  {["todo", "in_progress", "awaiting_approval", "done"].map((s) => (
                    <div key={s} className="text-center">
                      <p className="text-lg font-semibold text-white leading-none">
                        {mt.filter((t) => t.status === s).length}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{statusLabel[s]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {mt.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No tasks assigned</p>
              ) : (
                <div className="space-y-2">
                  {mt.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 py-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[t.status]}`}>
                        {statusLabel[t.status]}
                      </span>
                      <span className="text-sm text-gray-300 truncate">{t.title}</span>
                      {t.due_date && (
                        <span className="text-xs text-gray-600 ml-auto shrink-0">
                          {new Date(t.due_date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {unassigned.length > 0 && (
          <div className="bg-[#141414] border border-white/6 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-400">
                ?
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Unassigned</p>
                <p className="text-xs text-gray-600">{unassigned.length} task{unassigned.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="space-y-2">
              {unassigned.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[t.status]}`}>
                    {statusLabel[t.status]}
                  </span>
                  <span className="text-sm text-gray-400 truncate">{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
