# Hébergement — Namecheap, Spaceship et ce projet Next.js

Ce site (**Next.js 16**, API routes, Prisma, Stripe, Auth) doit tourner sur un **hébergeur Node.js**, pas sur un hébergement mutualisé « classique » souvent limité au PHP.

Tu peux très bien **acheter le nom de domaine** chez [Namecheap](https://www.namecheap.com/) ou [Spaceship](https://www.spaceship.com/) (écosystème orienté domaines / DNS moderne), puis **pointer le domaine** vers l’endroit où l’application est déployée.

---

## Approche recommandée (simple)

| Rôle | Où | Pourquoi |
|------|----|----------|
| **Nom de domaine + DNS** | Namecheap ou Spaceship | Prix, gestion des enregistrements A / CNAME |
| **Application Next.js** | [Vercel](https://vercel.com) (ou équivalent Node) | Support natif Next.js, HTTPS, déploiements depuis Git |
| **Base PostgreSQL** | [Neon](https://neon.tech), [Supabase](https://supabase.com), [Vercel Postgres](https://vercel.com/storage/postgres), etc. | Prisma a besoin de PostgreSQL en production |

L’hébergement **web mutualisé Namecheap** (Stellar, etc.) convient surtout à des sites statiques ou PHP ; pour ce repo, prévoir **VPS + Node** si tu veux tout chez Namecheap, ou plus simplement **Vercel + DB managée**.

---

## 1. Acheter le domaine (Namecheap ou Spaceship)

1. Crée un compte et enregistre ton domaine (ex. `maisonbleuroyale.ca`).
2. Repère la section **DNS** du domaine (chez Namecheap : *Domain List* → *Manage* → *Advanced DNS* ; chez Spaceship : gestion DNS du domaine selon leur interface actuelle).
3. Ne active pas de redirection Web « cheap » à la place de la config DNS décrite ci‑dessous si tu relies à Vercel.

---

## 2. Relier le domaine à Vercel (exemple)

1. Sur Vercel : projet → **Settings** → **Domains** → ajoute `tondomaine.com` et `www.tondomaine.com`.
2. Vercel indique des enregistrements à créer (souvent **CNAME** pour `www`, **A** ou alias pour la racine).
3. Dans Namecheap / Spaceship, crée ces enregistrements **exactement** comme indiqué (TTL automatique ou 300 s).
4. Attends la propagation DNS (quelques minutes à quelques heures).

Documentation Vercel : [Domains](https://vercel.com/docs/concepts/projects/domains).

---

## 3. Variables d’environnement en production

Copie `.env.example` vers les **Environment Variables** de ton hébergeur (ex. Vercel → *Settings* → *Environment Variables*).

À ajuster pour la prod :

| Variable | Rappel |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | URL publique `https://tondomaine.com` (sans slash final de préférence) |
| `AUTH_URL` | Même URL de base que le site (HTTPS) |
| `AUTH_SECRET` | `openssl rand -base64 32` (ne jamais réutiliser une valeur de dev) |
| `DATABASE_URL` | URL PostgreSQL de ton fournisseur |
| Clés **Stripe** | Passe en `sk_live_` / `pk_live_` quand tu es prêt |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook pointant vers `https://tondomaine.com/api/...` (chemin exact selon ton code) |
| `RESEND_API_KEY`, `EMAIL_FROM` | Si tu envoies les courriels de réservation |
| Crisp / Tawk | IDs `NEXT_PUBLIC_*` si tu utilises le chat |

Puis : build + migrations Prisma sur la base prod (`npx prisma migrate deploy` depuis un environnement qui a `DATABASE_URL`).

---

## 4. Si tu héberges ailleurs (VPS Namecheap ou autre)

- Installe **Node.js LTS**, clone le projet, `npm ci`, `npm run build`, `npm run start` (ou utilise **PM2** / systemd).
- Mets **Nginx** (ou Caddy) en reverse proxy HTTPS vers le port Node.
- Configure `NEXT_PUBLIC_APP_URL`, `AUTH_URL`, pare-feu, et sauvegardes PostgreSQL.

C’est plus de maintenance qu’un PaaS type Vercel.

---

## 5. Courriel au même domaine

- Pour **contact@tondomaine.com**, Namecheap propose du **Private Email** ou tu peux utiliser **Google Workspace**, **Microsoft 365**, etc.
- **Resend** (ou autre) : vérifie ton domaine (SPF, DKIM) pour envoyer les mails transactionnels sans atterrir en spam.

---

## Liens utiles

- [Namecheap — Knowledgebase DNS](https://www.namecheap.com/support/knowledgebase/subcategory.aspx/10/domains)
- [Spaceship — Centre d’aide](https://www.spaceship.com/support/) (DNS selon l’offre choisie)
- [Next.js — Deployment](https://nextjs.org/docs/app/building-your-application/deploying)

---

*Les interfaces Namecheap / Spaceship évoluent : en cas de doute, cherche « add CNAME record » ou « connect domain to Vercel » dans leur aide ou sur YouTube.*
