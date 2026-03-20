Boutique **Maison Bleu Royale** — [Next.js](https://nextjs.org) (App Router, next-intl, Prisma, Stripe).

## Hébergement & domaine (Namecheap / Spaceship)

Ce projet nécessite un hébergeur **Node.js** (ex. **Vercel**) et une base **PostgreSQL**. Tu peux enregistrer le domaine chez **[Namecheap](https://www.namecheap.com/)** ou **[Spaceship](https://www.spaceship.com/)** puis configurer le DNS pour pointer vers ton hébergement.

**Guide détaillé (FR) :** [`docs/HEBERGEMENT.md`](./docs/HEBERGEMENT.md)

Variables d’environnement : voir [`.env.example`](./.env.example).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

- **Recommandé :** [Vercel](https://vercel.com/new) + PostgreSQL managé (Neon, Supabase, etc.) — voir [`docs/HEBERGEMENT.md`](./docs/HEBERGEMENT.md) pour le domaine Namecheap / Spaceship.
- [Next.js — Deploying](https://nextjs.org/docs/app/building-your-application/deploying)
