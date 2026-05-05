import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "mission.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'todo',
    assignee TEXT DEFAULT '',
    due_date TEXT DEFAULT '',
    priority TEXT DEFAULT 'medium',
    source TEXT DEFAULT 'manual',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  INSERT OR IGNORE INTO team_members (id, name, role, avatar, created_at) VALUES
    ('raman', 'Raman', 'Owner', 'R', datetime('now')),
    ('agent', 'Masha (Agent)', 'AI Assistant', 'M', datetime('now'));
`);

export default db;

export type TaskStatus = "todo" | "in_progress" | "done" | "awaiting_approval";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  due_date: string;
  priority: Priority;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  created_at: string;
}

export const taskQueries = {
  getAll: db.prepare<[], Task>("SELECT * FROM tasks ORDER BY updated_at DESC"),
  getById: db.prepare<[string], Task>("SELECT * FROM tasks WHERE id = ?"),
  insert: db.prepare<[string, string, string, string, string, string, string, string, string, string], Task>(`
    INSERT INTO tasks (id, title, description, status, assignee, due_date, priority, source, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare<[string, string, string, string, string, string, string, string], void>(`
    UPDATE tasks SET title=?, description=?, status=?, assignee=?, due_date=?, priority=?, updated_at=?
    WHERE id=?
  `),
  delete: db.prepare<[string], void>("DELETE FROM tasks WHERE id = ?"),
};

export const memberQueries = {
  getAll: db.prepare<[], TeamMember>("SELECT * FROM team_members ORDER BY created_at ASC"),
  insert: db.prepare<[string, string, string, string, string], void>(`
    INSERT INTO team_members (id, name, role, avatar, created_at) VALUES (?, ?, ?, ?, ?)
  `),
};
