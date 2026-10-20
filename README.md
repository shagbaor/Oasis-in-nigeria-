# OASIS website

Website for **OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability**.

Built with [Next.js](https://nextjs.org) (React) and a [Neon](https://neon.tech) Postgres database, deployed on [Vercel](https://vercel.com).

- `/` — landing page with a contact form (messages are saved to the database)
- `/blog` — public blog
- `/research` — research articles, each with an optional downloadable PDF
- `/admin` — password-protected admin for writing blog posts and research, uploading images and PDFs, and reading messages

## Setup

### 1. Create the database

1. Create a free project at [console.neon.tech](https://console.neon.tech).
2. Click **Connect** and copy the **pooled** connection string.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Your Neon connection string |
| `ADMIN_PASSWORD` | The password for signing in at `/admin` |
| `SESSION_SECRET` | A random string of 32+ characters (`openssl rand -base64 32`) |

### 3. Create the tables

```sh
npm install
npm run db:migrate
```

This is safe to run again; it only creates tables that don't exist yet.

### 4. Run locally

```sh
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/admin.

## Deploy on Vercel

1. Import this repo at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js automatically.
2. Under **Environment Variables**, add `DATABASE_URL`, `ADMIN_PASSWORD` and `SESSION_SECRET`.
3. Click **Deploy**. Every push to `main` redeploys.

Tip: Vercel's Neon integration (Storage → Create Database → Neon) can create the database and set `DATABASE_URL` for you.

## Writing blog posts and research

Sign in at `/admin` and click **New post**. Choose **Blog post** or **Research**, then write in Markdown.

- **Insert image** uploads a picture and places it where your cursor is. Large photos are shrunk in the browser (max 1800px) before uploading.
- **Upload cover image** sets the picture shown at the top and on cards.
- **Attach PDF** adds a download button at the end of the post (up to 25 MB).

Posts stay as drafts until you tick **Published**.

### How files are stored

Images and PDFs are stored in the Neon database, split into 2 MB chunks so each upload stays under Vercel's request size limit. Files are served from `/files/<id>/<name>` and cached by the browser and Vercel's CDN. When a post is deleted, or an image or PDF is removed from it, the file is deleted too. The admin dashboard shows how much storage files use (Neon's free plan includes 512 MB in total).

## Project layout

```
app/(site)/          public pages: home, blog, blog post
app/admin/           admin login, dashboard, post editor, messages
app/admin/actions.ts admin Server Actions (all check the session first)
components/          shared UI
lib/                 database, queries and session helpers
db/schema.sql        database tables
```

`DATABASE_URL` pointing at `localhost` uses a local Postgres instead of Neon, which is handy for offline development.
