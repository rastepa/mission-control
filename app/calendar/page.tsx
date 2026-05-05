"use client";

import { useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusDot: Record<string, string> = {
  todo: "bg-gray-500",
  in_progress: "bg-blue-500",
  awaiting_approval: "bg-yellow-500",
  done: "bg-green-500",
};

export default function CalendarPage() {
  const { tasks, loading } = useTasks();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach((t) => {
      if (!t.due_date) return;
      const key = t.due_date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const monthName = today.toLocaleString("en-AU", { month: "long", year: "numeric" });

  // Tasks with no due date
  const noDue = tasks.filter((t) => !t.due_date && t.status !== "done");

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500 text-sm">Loading…</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Calendar</h1>
        <p className="text-sm text-gray-500 mt-0.5">{monthName}</p>
      </div>

      {/* Calendar grid */}
      <div className="bg-[#141414] border border-white/6 rounded-xl overflow-hidden mb-8">
        <div className="grid grid-cols-7 border-b border-white/6">
          {DAYS.map((d) => (
            <div key={d} className="py-2.5 text-center text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24 border-r border-b border-white/4 bg-white/1" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayTasks = tasksByDate[dateKey] ?? [];
            const isToday = day === today.getDate();

            return (
              <div
                key={day}
                className={cn(
                  "min-h-24 border-r border-b border-white/4 p-2",
                  isToday && "bg-violet-950/20"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1.5",
                    isToday
                      ? "bg-violet-600 text-white"
                      : "text-gray-500"
                  )}
                >
                  {day}
                </div>

                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-1 py-0.5 px-1 rounded text-[10px] text-gray-300 bg-white/5 truncate"
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusDot[t.status])} />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <p className="text-[10px] text-gray-600 pl-1">+{dayTasks.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* No due date section */}
      {noDue.length > 0 && (
        <div className="bg-[#141414] border border-white/6 rounded-xl p-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">No Due Date</h2>
          <div className="space-y-2">
            {noDue.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className={cn("w-1.5 h-1.5 rounded-full", statusDot[t.status])} />
                <span className="text-sm text-gray-300">{t.title}</span>
                {t.assignee && <span className="text-xs text-gray-600 ml-auto">{t.assignee}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
