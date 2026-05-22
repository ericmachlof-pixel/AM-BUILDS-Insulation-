# AM Builders — Insulation & Rat Proofing Website

A modern, Awwwards-caliber marketing website for **AM Builders**, California's premier insulation and rodent exclusion specialists.

Built with **Node.js + Express + EJS** on the backend and **vanilla HTML/CSS/JS + GSAP + Lenis** on the frontend.

---

## Quick Start

```bash
# 1. Clone / copy the project
cd ambuilders

# 2. Install dependencies
npm install

# 3. Copy the env example and fill in your SMTP credentials
cp .env.example .env

# 4. Start the dev server (auto-restarts on file changes)
npm run dev

# 5. Open http://localhost:3000
```

---

## Environment Variables

Copy `.env.example` → `.env` and fill in:

| Variable     | Description                          | Example                    |
|--------------|--------------------------------------|----------------------------|
| `PORT`       | Server port                          | `3000`                     |
| `SMTP_HOST`  | SMTP server hostname                 | `smtp.gmail.com`           |
| `SMTP_PORT`  | SMTP port                            | `587`                      |
| `SMTP_USER`  | SMTP username / email address        | `you@gmail.com`            |
| `SMTP_PASS`  | SMTP password / app password         | `your_app_password`        |
| `CONTACT_TO` | Address that receives contact emails | `info@ambuildersca.com`    |

### Gmail setup

If using Gmail, create an **App Password** (not your account password):
1. Enable 2-Step Verification on your Google account
2. Go to **myaccount.google.com → Security → App Passwords**
3. Generate a password for "Mail" → paste it as `SMTP_PASS`

---

## Project Structure

```
ambuilders/
├── server.js                 # Express app entry point
├── package.json
├── .env.example
├── /routes
│   ├── index.js              # Page routes (/, /services, /about, /contact)
│   └── contact.js            # POST /contact — validation + Nodemailer
├── /views
│   ├── partials/
│   │   ├── head.ejs          # <head> + meta + JSON-LD + CSS links
│   │   ├── header.ejs        # Sticky nav + mobile menu
│   │   ├── footer.ejs        # Full footer with sitemap
│   │   └── preloader.ejs     # Page-load preloader overlay
│   ├── index.ejs             # Home page (hero, services, process, stats, CTA)
│   ├── services.ejs          # Full service detail pages
│   ├── about.ejs             # Company story, team, certifications
│   ├── contact.ejs           # Contact form + map
│   └── 404.ejs               # 404 error page
└── /public
    ├── /css
    │   ├── main.css           # All layout, components, responsive
    │   └── animations.css     # GSAP/scroll animation initial states
    ├── /js
    │   ├── preloader.js       # Preloader counter + curtain wipe
    │   ├── cursor.js          # Custom orange cursor + follower ring
    │   ├── lenis-init.js      # Lenis smooth scroll setup
    │   ├── gsap-init.js       # All GSAP/ScrollTrigger animations
    │   ├── main.js            # Nav, mobile menu, magnetic btns, carousel
    │   └── contact-form.js    # Form validation + async submit
    ├── /img
    │   └── favicon.svg
    └── /fonts                 # (Poppins loaded via Google Fonts CDN)
```

---

## Pages

| Route       | Description                                           |
|-------------|-------------------------------------------------------|
| `/`         | Home — hero, services grid, process, stats, CTA       |
| `/services` | Detailed service sections (attic, spray foam, rats)   |
| `/about`    | Story, team cards, certifications                     |
| `/contact`  | Floating-label form, map embed, contact info          |
| `*`         | 404 page (on-brand, playful)                          |

---

## Features

- **GSAP + ScrollTrigger** — word-by-word split text, clip-path reveals, stat counters, stagger
- **Lenis** — buttery smooth scroll
- **Custom cursor** — orange dot + ghost ring, scales on hover
- **Magnetic CTA buttons** — drift toward cursor
- **Preloader** — 0–100% counter + curtain wipe reveal
- **Page transitions** — orange curtain wipe between routes
- **Draggable testimonial carousel** — mouse drag + touch swipe + arrow buttons
- **Sticky shrinking nav** — changes height + adds blur on scroll
- **Infinite marquee** — service tags strip in hero
- **SEO** — per-page meta, OpenGraph, JSON-LD LocalBusiness schema
- **Sitemap** — `/sitemap.xml` auto-generated
- **Robots** — `/robots.txt`
- **Rate limiting** — 5 contact submissions per 15 min per IP
- **Honeypot** — invisible field silently discards bot submissions
- **Reduced motion** — all heavy animations disabled via `prefers-reduced-motion`
- **Fully responsive** — mobile-first, breakpoints at 640, 1024, 1440px
- **Accessibility** — ARIA labels, roles, `focus-visible` outline, semantic HTML

---

## Deployment

### Render (recommended)

1. Push to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add all env vars in the Render dashboard
6. Done — auto-deploys on every push

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
# Set env vars in Railway dashboard
```

### Vercel (serverless-compatible)

Add a `vercel.json`:
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```
Then `vercel --prod`.

> **Note:** Vercel's free tier doesn't support Nodemailer SMTP well due to serverless cold starts. Prefer Render or Railway for email functionality.

---

## Swapping Placeholder Images

The site currently uses Unsplash URLs for service images. Before launch:

1. Add your photography to `/public/img/`
2. Replace `src="https://images.unsplash.com/..."` in the EJS files with `/img/your-image.jpg`
3. Add OG images: `og-home.jpg`, `og-services.jpg`, `og-about.jpg`, `og-contact.jpg` (1200×630px)

---

## Customization

- **Colors** — Edit CSS custom properties in `:root` block in `main.css`
- **Phone / email / address** — Edit `app.locals.siteData` in `server.js`
- **Service area** — Update text in `index.ejs`, `services.ejs`, and `server.js`
- **Social links** — Update `siteData.social` in `server.js`
- **SMTP** — Change `.env` variables

---

## License

Private / commercial project — AM Builders, California. All rights reserved.
