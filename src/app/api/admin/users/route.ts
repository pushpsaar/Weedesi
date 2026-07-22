import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USER_FILE = path.join(DATA_DIR, "users.json");

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isBlocked?: boolean;
}

async function readUsers(): Promise<UserRecord[]> {
  const raw = await fs.readFile(USER_FILE, "utf-8");
  return JSON.parse(raw) as UserRecord[];
}

async function writeUsers(users: UserRecord[]) {
  await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const users = await readUsers();
  const filtered = users.filter((user) => {
    if (!query) return true;
    return [user.name, user.email].some((value) => value.toLowerCase().includes(query));
  });

  return NextResponse.json({ users: filtered });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  const users = await readUsers();
  const next = users.filter((user) => user.id !== id);
  await writeUsers(next);
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  const body = await request.json();
  const users = await readUsers();
  const target = users.find((user) => user.id === id);
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const updated = users.map((user) => user.id === id ? { ...user, isBlocked: Boolean(body?.isBlocked), updatedAt: new Date().toISOString() } : user);
  await writeUsers(updated);
  return NextResponse.json({ ok: true });
}
