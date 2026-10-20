# OASIS website

Website for **OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability**.

Built with [Next.js](https://nextjs.org) (React) and a [Neon](https://neon.tech) Postgres database, deployed on [Vercel](https://vercel.com).

- `/` — home: motto, vision and mission, objectives, latest research and blog, with previews linking to every page
- `/about` — the name, motto, political philosophy and principles
- `/our-work` — thematic focus, the five objectives, OASIS Safe Ground
- `/work-with-us` — partnership, funding and research collaboration
- `/contact` — contact form: each message is emailed to talktous@oasisinnigeria.org and saved in the admin; `/contact?subject=Funding` preselects a subject
- `/donate` — what donations support and how to give
- `/policies` — privacy, cookies, safeguarding, and stories and consent
- `/blog` — public blog
- `/research` — research articles, each with an optional downloadable PDF
- `/admin` — password-protected admin for writing blog posts and research, uploading images and PDFs, and reading messages

Live at **https://www.oasisinnigeria.org**. OASIS is based at No. 5 Covenant Avenue, Shelter Afrique, Uyo, Uyo LGA, Akwa Ibom State, Nigeria.

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

## Contact form email

The contact form emails every message to `talktous@oasisinnigeria.org` through [Resend](https://resend.com) and also saves it under **Messages** in the admin, so nothing is lost if email is down.

1. Create a Resend account and add the domain `oasisinnigeria.org` (Resend → Domains). Add the DNS records it shows at your domain registrar and wait for it to verify.
2. Create an API key (Resend → API Keys).
3. In Vercel, add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (for example `OASIS website <website@oasisinnigeria.org>`), then redeploy.

Replying to a message email replies straight to the person who sent it. Without these variables, messages are still saved in the admin.

## Donations

Edit `lib/donate.ts` to add an online giving link (for example a Paystack or Flutterwave payment page) or bank transfer details. The Donate page shows them automatically; until then it asks people to get in touch.

## Writing blog posts and research

Sign in at `/admin` and click **New post**. Choose **Blog post** or **Research**, then write in Markdown.

- **Insert image** uploads a picture and places it where your cursor is. Large photos are shrunk in the browser (max 1800px) before uploading.
- **Upload cover image** sets the picture shown at the top and on cards.
- **Attach PDF** adds a download button at the end of the post (up to 25 MB).

Under **Visibility**, choose:

- **Draft** — saved but hidden from the public site.
- **Publish now** — live as soon as you save. Editing a live post keeps its original date.
- **Schedule** — pick a date and time (Nigeria time, WAT). The post is saved straight away but stays hidden until then, and appears on the blog or research page, the homepage and in search automatically at that time. Picking a time in the past publishes it immediately with that date (useful for backdating).

Drafts and scheduled posts are hidden from visitors (their links show "not found"). Signed in as admin you can open them with **Preview** to see exactly how they will look, with a banner saying they're not public yet. The dashboard shows each post's status, the scheduled time, and has a **Scheduled** filter.

### Finding, editing and deleting posts

- The admin dashboard lists every post with **Edit**, **View** and **Delete**. Search by title, summary or text, and filter by type (blog or research) and status (published, scheduled or draft).
- The edit page has **View live** and a **Delete post** button at the bottom.
- When you're signed in, every published post on the public site shows an **Edit this post** bar at the top.
- **Messages** can be searched by name, email, subject or message.

### Search on the site

`/blog` and `/research` have a search box. It uses Postgres full-text search (titles rank highest, then summaries, then body text, with word forms matched, e.g. "housing" finds "house"), plus partial matches on titles and summaries. Results show a highlighted snippet. Links like `/research?q=floods` can be shared. Drafts never appear in public results.

### How files are stored

Images and PDFs are stored in the Neon database, split into 2 MB chunks so each upload stays under Vercel's request size limit. Files are served from `/files/<id>/<name>` and cached by the browser and Vercel's CDN. When a post is deleted, or an image or PDF is removed from it, the file is deleted too. The admin dashboard shows how much storage files use; check the Neon console for your plan's limit.

## Search engines and link previews

- **Descriptions and titles** — every page sets its own title, description and canonical address with `pageMetadata()` from `lib/seo.ts`. A post's description is its excerpt, or the start of its text if there is no excerpt.
- **Link preview picture** — `app/opengraph-image.tsx` draws the picture shown when a link is shared on WhatsApp, Facebook, LinkedIn, X and so on. Posts with a cover image use the cover instead.
- **Structured data** — `components/StructuredData.tsx` tells Google that OASIS is a non-profit, with its logo (`public/oasis-logo.png`), address, email and Instagram. Research posts are marked as reports and blog posts as articles.
- **Sitemap and robots** — `/sitemap.xml` lists every page and live post, and updates itself when a scheduled post goes live. `/robots.txt` keeps the admin out of search results.
- **Address and domain** — `ADDRESS`, `CONTACT_EMAIL` and `SITE_URL` are in `lib/identity.ts`.

To get the site into Google faster, add `www.oasisinnigeria.org` in [Google Search Console](https://search.google.com/search-console) and submit `https://www.oasisinnigeria.org/sitemap.xml`. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters) if you like.

## Brand

The design and wording follow the *OASIS Founding Identity* (October 2026) and the *OASIS Official Colour Palette*.

- **Wording** — aim, vision, mission, objectives, philosophy, principles and proverbs live in `lib/identity.ts`. Edit them there; the pages read from that file.
- **Colours** — defined once at the top of `app/globals.css`. Text follows the palette's contrast table: Terracotta text only at 24px and above, never on Forest Green; buttons are Forest Green with white text.
- **Type** — Palatino Linotype. Devices that have it (Windows, macOS) use it; others download TeX Gyre Pagella, a free Palatino design, from `public/fonts/` (GUST Font License, see `public/fonts/LICENSE-TeX-Gyre.txt`); the link preview picture uses a cut-down copy in `assets/og-fonts/`. Noto Serif fills in the Hausa letters ɗ and ƙ.
- **Motion** — smooth scrolling (Lenis), scroll-in reveals, parallax and the progress bar live in `components/ScrollEffects.tsx`; page transitions use React's `<ViewTransition>` in `app/(site)/template.tsx`; keyframes are in the Motion section of `app/globals.css`. All of it switches off for visitors who prefer reduced motion.
- **Glass tiles** — the translucent cards and proverbs on dark sections use a frosted-glass style (Glass tiles section of `app/globals.css`), with a solid fallback for browsers without blur and for visitors who prefer reduced transparency.
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
