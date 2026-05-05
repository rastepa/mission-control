import { NextRequest, NextResponse } from "next/server";
import { taskQueries } from "@/lib/db";
import { broadcast } from "@/lib/sse";
import { newId, now } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Agent posts here to sync NanoClaw task state into the dashboard.
// Payload: { action: "create"|"update"|"delete", task: {...} }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, task } = body;

  if (!action || !task) {
    return NextResponse.json({ error: "action and task required" }, { status: 400 });
  }

  if (action === "create" || action === "upsert") {
    const id = task.id ?? newId();
    const ts = now();
    const existing = taskQueries.getById.get(id);

    if (existing) {
      taskQueries.update.run(
        task.title ?? existing.title,
        task.description ?? existing.description,
        task.status ?? existing.status,
        task.assignee ?? existing.assignee,
        task.due_date ?? existing.due_date,
        task.priority ?? existing.priority,
        ts,
        id
      );
      const updated = taskQueries.getById.get(id);
      broadcast("task_updated", updated);
      return NextResponse.json(updated);
    } else {
      taskQueries.insert.run(
        id,
        task.title ?? "Untitled",
        task.description ?? "",
        task.status ?? "in_progress",
        task.assignee ?? "agent",
        task.due_date ?? "",
        task.priority ?? "medium",
        "nanoclaw",
        ts,
        ts
      );
      const created = taskQueries.getById.get(id);
      broadcast("task_created", created);
      return NextResponse.json(created, { status: 201 });
    }
  }

  if (action === "update") {
    const existing = taskQueries.getById.get(task.id);
    if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
    taskQueries.update.run(
      task.title ?? existing.title,
      task.description ?? existing.description,
      task.status ?? existing.status,
      task.assignee ?? existing.assignee,
      task.due_date ?? existing.due_date,
      task.priority ?? existing.priority,
      now(),
      task.id
    );
    const updated = taskQueries.getById.get(task.id);
    broadcast("task_updated", updated);
    return NextResponse.json(updated);
  }

  if (action === "delete") {
    taskQueries.delete.run(task.id);
    broadcast("task_deleted", { id: task.id });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
