import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { listMessages } from "@/lib/messages";
import { formatDate } from "@/lib/format";
import { removeMessage, toggleMessageRead } from "../../actions";
import { ConfirmButton } from "../ConfirmButton";
import { SearchBox } from "@/components/SearchBox";
import { Highlight } from "@/components/Highlight";

async function MessageList({ searchParams }: { searchParams: PageProps<"/admin/messages">["searchParams"] }) {
  await requireAdmin();
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 100);
  const messages = await listMessages(q);
  const mark = (text: string) => (q ? <Highlight text={text} query={q} /> : text);

  if (messages.length === 0) {
    return (
      <p className="muted">
        {q
          ? `No messages match “${q}”.`
          : "No messages yet. Messages sent through the website's contact form appear here."}
      </p>
    );
  }

  return (
    <>
    {q && (
      <p className="search-summary" role="status">
        {messages.length} {messages.length === 1 ? "message" : "messages"} matching “{q}”
      </p>
    )}
    <ul className="message-list">
      {messages.map((m) => (
        <li key={m.id} className={`message${m.is_read ? "" : " unread"}`}>
          <div className="message-head">
            <div>
              <strong>{mark(m.name)}</strong> · <a href={`mailto:${m.email}`}>{mark(m.email)}</a>
              <div className="small muted">
                {mark(m.subject)} · {formatDate(m.created_at)}
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
                <ConfirmButton message="Delete this message? This cannot be undone." className="link-button danger">
                  Delete
                </ConfirmButton>
              </form>
            </div>
          </div>
          <p className="message-body">{mark(m.message)}</p>
        </li>
      ))}
    </ul>
    </>
  );
}

export default function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  return (
    <>
      <h1>Messages</h1>
      <div className="admin-search">
        <Suspense fallback={<div className="search-box" />}>
          <SearchBox label="Search messages" placeholder="Search by name, email, subject or message…" />
        </Suspense>
      </div>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <MessageList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
