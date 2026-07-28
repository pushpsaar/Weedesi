import { supabaseAdmin, ensureSupabaseSchema } from "./supabase";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  is_blocked: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  isBlocked: boolean;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function mapRowToUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at ?? undefined,
    isBlocked: row.is_blocked,
  };
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from<UserRow>("users")
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToUser(data) : null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from<UserRow>("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToUser(data) : null;
}

export async function createUser(user: UserRecord): Promise<void> {
  await ensureSupabaseSchema();
  const { error } = await supabaseAdmin.from("users").insert({
    id: user.id,
    name: user.name,
    email: normalizeEmail(user.email),
    password_hash: user.passwordHash,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    last_login_at: user.lastLoginAt ?? null,
    is_blocked: user.isBlocked,
  });

  if (error) throw error;
}

export async function getAllUsers(): Promise<UserRecord[]> {
  await ensureSupabaseSchema();
  const { data, error } = await supabaseAdmin
    .from<UserRow>("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRowToUser);
}

export async function deleteUserById(id: string): Promise<void> {
  await ensureSupabaseSchema();
  const { error } = await supabaseAdmin.from("users").delete().eq("id", id);
  if (error) throw error;
}

export async function updateUserIsBlocked(id: string, isBlocked: boolean): Promise<void> {
  await ensureSupabaseSchema();
  const { error } = await supabaseAdmin
    .from("users")
    .update({ is_blocked: isBlocked, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function updateUserLastLogin(userId: string, timestamp: string): Promise<void> {
  await ensureSupabaseSchema();
  const { error } = await supabaseAdmin
    .from("users")
    .update({ last_login_at: timestamp, updated_at: timestamp })
    .eq("id", userId);

  if (error) throw error;
}

