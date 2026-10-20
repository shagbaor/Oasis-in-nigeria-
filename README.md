# OASIS website

Website for **OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability**.

Built with [Next.js](https://nextjs.org) (React) and a [Neon](https://neon.tech) Postgres database, deployed on [Vercel](https://vercel.com).

- `/` — home: motto, vision and mission, objectives, latest research and blog, contact form (messages are saved to the database)
- `/about` — the name, motto, political philosophy and principles
- `/our-work` — thematic focus, the five objectives, OASIS Safe Ground
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

Server code runs in Frankfurt (`fra1`, set in `vercel.json`) to sit next to the Neon database in `aws-eu-central-1`, the closest region to Nigeria.

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

Images and PDFs are stored in the Neon database, split into 2 MB chunks so each upload stays under Vercel's request size limit. Files are served from `/files/<id>/<name>` and cached by the browser and Vercel's CDN. When a post is deleted, or an image or PDF is removed from it, the file is deleted too. The admin dashboard shows how much storage files use; check the Neon console for your plan's limit.

## Brand

The design and wording follow the *OASIS Founding Identity* (October 2026) and the *OASIS Official Colour Palette*.

- **Wording** — vision, mission, objectives, philosophy, principles and proverbs live in `lib/identity.ts`. Edit them there; the pages read from that file.
- **Colours** — defined once at the top of `app/globals.css`. Text follows the palette's contrast table: Terracotta text only at 24px and above, never on Forest Green; buttons are Forest Green with white text.
- **Type** — TeX Gyre Pagella, as in the identity document, self-hosted from `app/fonts/` (GUST Font License, see `app/fonts/LICENSE-TeX-Gyre.txt`). Noto Serif fills in the Hausa letters ɗ and ƙ that Pagella lacks.
- **Pattern and border** — `public/patterns/tile.svg` (circles, waves, dots, leaf) and `public/patterns/band.svg` (triangle border) recreate the identity artwork.

The logos in `public/` (`oasis-logo.svg`, `oasis-logo-reversed.svg` for dark backgrounds) and the favicon (`app/icon.svg`) are vector versions traced from the official artwork and filled with the exact palette colours. If you have the original vector logo files, drop them in to replace these.

## Project layout

```
app/(site)/          public pages: home, about, our work, blog, research
app/admin/           admin login, dashboard, post editor, messages
app/admin/actions.ts admin Server Actions (all check the session first)
components/          shared UI
lib/                 database, queries, session helpers, identity text
db/schema.sql        database tables
```

`DATABASE_URL` pointing at `localhost` uses a local Postgres instead of Neon, which is handy for offline development.
