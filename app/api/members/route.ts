import { NextRequest, NextResponse } from "next/server";
import { memberQueries } from "@/lib/db";
import { newId, now } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(memberQueries.getAll.all());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, role = "", avatar = "" } = body;
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const id = newId();
  memberQueries.insert.run(id, name, role, avatar || name[0].toUpperCase(), now());
  return NextResponse.json({ id, name, role, avatar }, { status: 201 });
}
