import { NextResponse } from "next/server";
import { getAllUsers, deleteUserById, updateUserIsBlocked } from "@/lib/user-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const users = getAllUsers();
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

  deleteUserById(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  const body = await request.json();
  updateUserIsBlocked(id, Boolean(body?.isBlocked));
  return NextResponse.json({ ok: true });
}
