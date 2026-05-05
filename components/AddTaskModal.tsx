"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/db";

interface Props {
  defaultStatus?: TaskStatus;
  onAdd: (data: Partial<Task>) => void;
  onClose: () => void;
}

export default function AddTaskModal({ defaultStatus = "todo", onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [due_date, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description, assignee, due_date, priority, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <h2 className="text-sm font-semibold">New Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <input
              autoFocus
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider block mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-violet-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="awaiting_approval">Awaiting Approval</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider block mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-violet-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider block mb-1.5">Assignee</label>
              <input
                placeholder="e.g. Raman"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider block mb-1.5">Due Date</label>
              <input
                type="date"
                value={due_date}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-300 px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
