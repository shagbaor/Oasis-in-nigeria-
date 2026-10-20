import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { listMessages } from "@/lib/messages";
import { formatDate } from "@/lib/format";
import { removeMessage, toggleMessageRead } from "../../actions";
import { ConfirmButton } from "../ConfirmButton";

async function MessageList() {
  await requireAdmin();
  const messages = await listMessages();

  if (messages.length === 0) {
    return <p className="muted">No messages yet. Messages sent through the website&apos;s contact form appear here.</p>;
  }

  return (
    <ul className="message-list">
      {messages.map((m) => (
        <li key={m.id} className={`message${m.is_read ? "" : " unread"}`}>
          <div className="message-head">
            <div>
              <strong>{m.name}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a>
              <div className="small muted">
                {m.subject} · {formatDate(m.created_at)}
              </div>
            </div>
            <div className="row-actions">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>Reply</a>
              <form action={toggleMessageRead}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="is_read" value={String(!m.is_read)} />
                <button type="submit" className="link-button">
                  Mark {m.is_read ? "unread" : "read"}
                </button>
              </form>
              <form action={removeMessage}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton message="Delete this message? This cannot be undone.">Delete</ConfirmButton>
              </form>
            </div>
          </div>
          <p className="message-body">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}

export default function MessagesPage() {
  return (
    <>
      <h1>Messages</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <MessageList />
      </Suspense>
    </>
  );
}
