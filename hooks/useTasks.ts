"use client";

import { useEffect, useState, useCallback } from "react";
import type { Task } from "@/lib/db";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();

    const es = new EventSource("/api/stream");

    es.addEventListener("task_created", (e) => {
      const task: Task = JSON.parse(e.data);
      setTasks((prev) => [task, ...prev.filter((t) => t.id !== task.id)]);
    });

    es.addEventListener("task_updated", (e) => {
      const task: Task = JSON.parse(e.data);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });

    es.addEventListener("task_deleted", (e) => {
      const { id } = JSON.parse(e.data);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

    return () => es.close();
  }, [fetchTasks]);

  const updateStatus = useCallback(async (id: string, status: Task["status"]) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }, []);

  const createTask = useCallback(async (data: Partial<Task>) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }, []);

  return { tasks, loading, updateStatus, createTask, deleteTask, refetch: fetchTasks };
}
