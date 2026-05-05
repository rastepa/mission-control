import { NextRequest, NextResponse } from "next/server";
import { taskQueries } from "@/lib/db";
import { broadcast } from "@/lib/sse";
import { now } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = taskQueries.getById.get(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await req.json();
  const title = body.title ?? existing.title;
  const description = body.description ?? existing.description;
  const status = body.status ?? existing.status;
  const assignee = body.assignee ?? existing.assignee;
  const due_date = body.due_date ?? existing.due_date;
  const priority = body.priority ?? existing.priority;

  taskQueries.update.run(title, description, status, assignee, due_date, priority, now(), id);
  const updated = taskQueries.getById.get(id);
  broadcast("task_updated", updated);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  taskQueries.delete.run(id);
  broadcast("task_deleted", { id });
  return NextResponse.json({ ok: true });
}
