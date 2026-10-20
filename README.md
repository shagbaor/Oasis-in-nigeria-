# OASIS website

Landing page for **OASIS — Outreach for Affirming Spaces, Inclusion and Sustainability**.

Plain HTML, CSS and JavaScript with no build step.

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo.
3. Keep the defaults (Framework Preset: **Other**, no build command, output directory `.`) and click **Deploy**.

Each push to `main` redeploys automatically.

## Editing content

- Text: `index.html`
- Colours and fonts: the variables at the top of `styles.css`
- Contact email: `CONTACT_EMAIL` in `script.js`, plus the email link in the Contact section of `index.html`
