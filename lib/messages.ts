import "server-only";
import { query } from "./db";

export type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: Date;
};

export type MessageInput = Pick<Message, "name" | "email" | "subject" | "message">;

export async function createMessage(input: MessageInput) {
  await query("INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)", [
    input.name,
    input.email,
    input.subject,
    input.message,
  ]);
}

export function listMessages(q = "") {
  if (!q) return query<Message>("SELECT * FROM messages ORDER BY created_at DESC LIMIT 500");
  const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
  return query<Message>(
    `SELECT * FROM messages
     WHERE name ILIKE $1 OR email ILIKE $1 OR subject ILIKE $1 OR message ILIKE $1
     ORDER BY created_at DESC LIMIT 500`,
    [pattern]
  );
}

export async function countUnreadMessages() {
  const rows = await query<{ count: string }>("SELECT count(*) FROM messages WHERE NOT is_read");
  return Number(rows[0].count);
}

export async function setMessageRead(id: number, isRead: boolean) {
  await query("UPDATE messages SET is_read = $2 WHERE id = $1", [id, isRead]);
}

export async function deleteMessage(id: number) {
  await query("DELETE FROM messages WHERE id = $1", [id]);
}
