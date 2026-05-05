import { NextRequest, NextResponse } from "next/server";
import db, { taskQueries } from "@/lib/db";
import { broadcast } from "@/lib/sse";
import { newId, now } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const tasks = taskQueries.getAll.all();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description = "", status = "todo", assignee = "", due_date = "", priority = "medium", source = "manual" } = body;

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const id = newId();
  const ts = now();
  taskQueries.insert.run(id, title, description, status, assignee, due_date, priority, source, ts, ts);

  const task = taskQueries.getById.get(id);
  broadcast("task_created", task);
  return NextResponse.json(task, { status: 201 });
}
