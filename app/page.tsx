"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/TaskCard";
import AddTaskModal from "@/components/AddTaskModal";
import type { Task, TaskStatus } from "@/lib/db";

const COLUMNS: { id: TaskStatus; label: string; accent: string }[] = [
  { id: "todo", label: "To Do", accent: "border-gray-600" },
  { id: "in_progress", label: "In Progress", accent: "border-blue-500" },
  { id: "awaiting_approval", label: "Awaiting Approval", accent: "border-yellow-500" },
  { id: "done", label: "Done", accent: "border-green-500" },
];

export default function BoardPage() {
  const { tasks, loading, updateStatus, createTask, deleteTask } = useTasks();
  const [modal, setModal] = useState<TaskStatus | null>(null);

  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold text-white">Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} · live sync enabled
          </p>
        </div>
        <button
          onClick={() => setModal("todo")}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm px-3.5 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={14} />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 min-h-[70vh]">
        {COLUMNS.map(({ id, label, accent }) => {
          const col = byStatus(id);
          return (
            <div key={id} className="flex flex-col">
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${accent}`}>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</h2>
                <span className="text-xs text-gray-600 bg-white/5 px-1.5 py-0.5 rounded-full ml-auto">
                  {col.length}
                </span>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {col.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <TaskCard task={task} onDelete={deleteTask} />
                  </div>
                ))}

                <div
                  className="flex-1 min-h-16 rounded-lg border-2 border-dashed border-white/4 hover:border-white/10 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const taskId = e.dataTransfer.getData("taskId");
                    if (taskId) updateStatus(taskId, id);
                  }}
                />
              </div>

              <button
                onClick={() => setModal(id)}
                className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 py-1.5 transition-colors"
              >
                <Plus size={12} />
                Add task
              </button>
            </div>
          );
        })}
      </div>

      {modal && (
        <AddTaskModal
          defaultStatus={modal}
          onAdd={createTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
