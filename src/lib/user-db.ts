import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import os from "os";

const DATA_DIR = path.join(process.cwd(), "data");
const USER_JSON_FILE = path.join(DATA_DIR, "users.json");
const SQLITE_DB_PATH =
  process.env.NODE_ENV === "production"
    ? path.join(os.tmpdir(), "vedesi.sqlite")
    : path.join(DATA_DIR, "vedesi.sqlite");

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isBlocked?: boolean;
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) {
    return db;
  }

  const dir = path.dirname(SQLITE_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(SQLITE_DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastLoginAt TEXT,
      isBlocked INTEGER NOT NULL DEFAULT 0
    );
  `);

  migrateJsonUsers();
  return db;
}

function migrateJsonUsers(): void {
  if (!fs.existsSync(USER_JSON_FILE)) {
    return;
  }

  try {
    const countResult = getDb()
      .prepare("SELECT COUNT(*) AS count FROM users")
      .get() as { count: number };

    if (countResult.count > 0) {
      return;
    }

    const raw = fs.readFileSync(USER_JSON_FILE, "utf-8");
    const users = JSON.parse(raw) as UserRecord[];
    const insert = getDb().prepare(
      `INSERT OR IGNORE INTO users
      (id, name, email, passwordHash, createdAt, updatedAt, lastLoginAt, isBlocked)
      VALUES (@id, @name, @email, @passwordHash, @createdAt, @updatedAt, @lastLoginAt, @isBlocked)`
    );

    const transaction = getDb().transaction((items: UserRecord[]) => {
      for (const item of items) {
        insert.run({
          id: item.id,
          name: item.name,
          email: item.email.toLowerCase(),
          passwordHash: item.passwordHash,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          lastLoginAt: item.lastLoginAt ?? null,
          isBlocked: item.isBlocked ? 1 : 0,
        });
      }
    });

    transaction(users);
  } catch (error) {
    console.error("User DB migration error:", error);
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getUserByEmail(email: string): UserRecord | null {
  const row = getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(normalizeEmail(email));
  if (!row) return null;
  return {
    ...row,
    isBlocked: Boolean(row.isBlocked),
  } as UserRecord;
}

export function getUserById(id: string): UserRecord | null {
  const row = getDb().prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!row) return null;
  return {
    ...row,
    isBlocked: Boolean(row.isBlocked),
  } as UserRecord;
}

export function createUser(user: UserRecord): void {
  getDb()
    .prepare(
      `INSERT INTO users
      (id, name, email, passwordHash, createdAt, updatedAt, lastLoginAt, isBlocked)
      VALUES (@id, @name, @email, @passwordHash, @createdAt, @updatedAt, @lastLoginAt, @isBlocked)`
    )
    .run({
      ...user,
      email: normalizeEmail(user.email),
      lastLoginAt: user.lastLoginAt ?? null,
      isBlocked: user.isBlocked ? 1 : 0,
    });
}

export function getAllUsers(): UserRecord[] {
  const rows = getDb().prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
  return rows.map((row: any) => ({
    ...row,
    isBlocked: Boolean(row.isBlocked),
  })) as UserRecord[];
}

export function deleteUserById(id: string): void {
  getDb().prepare("DELETE FROM users WHERE id = ?").run(id);
}

export function updateUserIsBlocked(id: string, isBlocked: boolean): void {
  getDb()
    .prepare(
      `UPDATE users
      SET isBlocked = @isBlocked,
          updatedAt = @updatedAt
      WHERE id = @id`
    )
    .run({ id, isBlocked: isBlocked ? 1 : 0, updatedAt: new Date().toISOString() });
}

export function updateUserLastLogin(userId: string, timestamp: string): void {
  getDb()
    .prepare(
      `UPDATE users
      SET lastLoginAt = @lastLoginAt,
          updatedAt = @updatedAt
      WHERE id = @id`
    )
    .run({ id: userId, lastLoginAt: timestamp, updatedAt: timestamp });
}
