# OASIS website

Website for **OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability**.

Built with [Next.js](https://nextjs.org) (React) and a [Neon](https://neon.tech) Postgres database, deployed on [Vercel](https://vercel.com).

- `/` — landing page with a contact form (messages are saved to the database)
- `/blog` — public blog
- `/admin` — password-protected admin for writing posts and reading messages

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

## Writing posts

Sign in at `/admin`, click **New post**, and write in Markdown. Posts stay as drafts until you tick **Published**. Cover images and inline images use image URLs.

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
