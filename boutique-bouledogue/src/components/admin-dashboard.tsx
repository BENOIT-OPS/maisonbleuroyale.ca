"use client";

import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";

type PuppyRow = {
  id: string;
  name: string;
  slug: string;
  gender: string;
  color: string;
  city: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "COMING_SOON";
  priceCents: number;
  priceOnRequest?: boolean;
  depositCents: number | null;
  birthDate: string;
  description: string;
  pedigree: string;
  coverImage: string;
  gallery: string[];
  featured: boolean;
};

type ReservationRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string | null;
  depositAmountCents: number | null;
  status: "PENDING" | "PAID" | "CANCELLED";
  stripeCheckoutSession: string | null;
  createdAt: string;
  puppy: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    status: string;
  };
};

type MessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  content: string;
  createdAt: string;
};

const puppyStatusLabels: Record<PuppyRow["status"], string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservé",
    SOLD: "Vendu",
  COMING_SOON: "Portée à venir",
};

const reservationStatusLabels: Record<ReservationRow["status"], string> = {
  PENDING: "En attente",
  PAID: "Payé",
  CANCELLED: "Annulé",
};

type Tab = "puppies" | "orders" | "messages";

export function AdminDashboard({ userEmail }: { userEmail: string }) {
  const [tab, setTab] = useState<Tab>("puppies");
  const [puppies, setPuppies] = useState<PuppyRow[]>([]);
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    gender: "",
    color: "",
    city: "",
    pedigree: "",
    description: "",
    priceCad: "",
    birthDate: "",
    coverImage: "",
    galleryCsv: "",
    depositCad: "",
    priceOnRequest: false,
    featured: false,
    status: "AVAILABLE" as PuppyRow["status"],
  });

  const showNotice = useCallback((msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  }, []);

  const loadPuppies = useCallback(async () => {
    const res = await fetch("/api/admin/puppies");
    if (res.ok) setPuppies(await res.json());
  }, []);

  const loadReservations = useCallback(async () => {
    const res = await fetch("/api/admin/reservations");
    if (res.ok) setReservations(await res.json());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [pRes, rRes, mRes] = await Promise.all([
        fetch("/api/admin/puppies"),
        fetch("/api/admin/reservations"),
        fetch("/api/admin/messages"),
      ]);
      const [pData, rData, mData] = await Promise.all([
        pRes.ok ? pRes.json() : Promise.resolve([]),
        rRes.ok ? rRes.json() : Promise.resolve([]),
        mRes.ok ? mRes.json() : Promise.resolve([]),
      ]);
      if (!cancelled) {
        setPuppies(pData);
        setReservations(rData);
        setMessages(mData);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      slug: "",
      gender: "",
      color: "",
      city: "",
      pedigree: "",
      description: "",
      priceCad: "",
      birthDate: "",
      coverImage: "",
      galleryCsv: "",
      depositCad: "",
      priceOnRequest: false,
      featured: false,
      status: "AVAILABLE",
    });
  }

  function startEdit(p: PuppyRow) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      gender: p.gender,
      color: p.color,
      city: p.city,
      pedigree: p.pedigree,
      description: p.description,
      priceCad: String(p.priceCents / 100),
      birthDate: p.birthDate.split("T")[0] ?? "",
      coverImage: p.coverImage,
      galleryCsv: p.gallery.join(", "),
      depositCad: p.depositCents != null ? String(p.depositCents / 100) : "",
      priceOnRequest: p.priceOnRequest ?? false,
      featured: p.featured,
      status: p.status,
    });
  }

  async function submitPuppy(e: React.FormEvent) {
    e.preventDefault();
    const priceCad = Number(form.priceCad);
    if (!form.priceOnRequest && (!Number.isFinite(priceCad) || priceCad <= 0)) {
      showNotice("Prix invalide ou cochez Sur demande.");
      return;
    }
    const priceCents = form.priceOnRequest ? 0 : Math.round(priceCad * 100);
    const gallery = form.galleryCsv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let depositCents: number | null = null;
    if (form.depositCad.trim()) {
      const d = Number(form.depositCad);
      if (!Number.isFinite(d) || d <= 0) {
        showNotice("Montant dacompte invalide.");
        return;
      }
      depositCents = Math.round(d * 100);
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      gender: form.gender,
      color: form.color,
      city: form.city,
      pedigree: form.pedigree,
      description: form.description,
      priceCents,
      birthDate: new Date(form.birthDate).toISOString(),
      coverImage: form.coverImage,
      gallery,
      featured: form.featured,
      priceOnRequest: form.priceOnRequest,
      depositCents,
    };

    if (editingId) {
      const res = await fetch(`/api/admin/puppies/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          status: form.status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showNotice(typeof data.error === "string" ? data.error : "Erreur mise a jour.");
        return;
      }
      showNotice("Chiot mis a jour.");
      resetForm();
    } else {
      const res = await fetch("/api/admin/puppies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showNotice(typeof data.error === "string" ? data.error : "Erreur creation.");
        return;
      }
      showNotice("Chiot ajoute.");
      resetForm();
    }

    await loadPuppies();
  }

  async function removePuppy(id: string) {
    if (!confirm("Supprimer ce chiot ? Les reservations liees seront supprimees.")) return;
    const res = await fetch(`/api/admin/puppies/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showNotice("Suppression impossible.");
      return;
    }
    if (editingId === id) resetForm();
    showNotice("Chiot supprime.");
    await loadPuppies();
    await loadReservations();
  }

  async function quickStatus(id: string, status: PuppyRow["status"]) {
    const res = await fetch(`/api/admin/puppies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      showNotice("Mise a jour du statut impossible.");
      return;
    }
    await loadPuppies();
    showNotice("Statut mis a jour.");
  }

  async function updateReservationStatus(id: string, status: ReservationRow["status"]) {
    const res = await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      showNotice("Mise a jour commande impossible.");
      return;
    }
    await loadReservations();
    showNotice("Commande mise a jour.");
  }

  return (
    <SiteShell>
      <section className="container-premium py-10">
        <div className="flex flex-col gap-4 border-b border-[#dccdb5] pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Tableau de bord</h1>
            <p className="text-sm text-[#6f6454]">Connecte en tant que {userEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl border border-[#8c6a3f] px-4 py-2 text-sm font-medium text-[#8c6a3f] hover:bg-[#f3ebe0]"
          >
            Deconnexion
          </button>
        </div>

        {notice ? (
          <p className="mt-4 rounded-xl border border-[#c9e2c3] bg-[#f4faf1] px-4 py-2 text-sm text-[#2f5c27]">{notice}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["puppies", "Chiots"],
              ["orders", "Commandes"],
              ["messages", "Messages"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                tab === key ? "bg-[#8c6a3f] text-white" : "bg-white text-[#463d33] ring-1 ring-[#dccdb5]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "puppies" ? (
          <div className="mt-8 space-y-8">
            <div className="rounded-2xl border border-[#dccdb5] bg-white p-6">
              <h2 className="text-lg font-semibold">{editingId ? "Modifier un chiot" : "Ajouter un chiot"}</h2>
              <form onSubmit={submitPuppy} className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-xl border px-3 py-2"
                  placeholder="Nom"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border px-3 py-2"
                  placeholder="Slug URL"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border px-3 py-2"
                  placeholder="Sexe"
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border px-3 py-2"
                  placeholder="Couleur"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border px-3 py-2"
                  placeholder="Ville"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border px-3 py-2"
                  placeholder="Pedigree"
                  value={form.pedigree}
                  onChange={(e) => setForm((f) => ({ ...f, pedigree: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border px-3 py-2 disabled:bg-[#f5f1ea] disabled:text-[#9a8f7f]"
                  placeholder={form.priceOnRequest ? "— (sur demande)" : "Prix (CAD)"}
                  value={form.priceCad}
                  onChange={(e) => setForm((f) => ({ ...f, priceCad: e.target.value }))}
                  disabled={form.priceOnRequest}
                  required={!form.priceOnRequest}
                />
                <div className="md:col-span-2">
                  <input
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="Acompte Stripe (CAD), laisser vide = calcul auto"
                    value={form.depositCad}
                    onChange={(e) => setForm((f) => ({ ...f, depositCad: e.target.value }))}
                  />
                  <p className="mt-1 text-xs text-[#6f6454]">
                    Sinon reglage global : RESERVATION_DEPOSIT_PERCENT et RESERVATION_DEPOSIT_MIN_CENTS.
                  </p>
                </div>
                <input
                  className="rounded-xl border px-3 py-2"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                  required
                />
                <input
                  className="md:col-span-2 rounded-xl border px-3 py-2"
                  placeholder="URL image couverture"
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  required
                />
                <textarea
                  className="md:col-span-2 min-h-[88px] rounded-xl border px-3 py-2"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                />
                <input
                  className="md:col-span-2 rounded-xl border px-3 py-2"
                  placeholder="Galerie (URLs separees par des virgules)"
                  value={form.galleryCsv}
                  onChange={(e) => setForm((f) => ({ ...f, galleryCsv: e.target.value }))}
                />
                <div className="flex flex-wrap gap-6 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.priceOnRequest}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          priceOnRequest: e.target.checked,
                        }))
                      }
                    />
                    Prix sur demande
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    />
                    Mettre en avant (page d&apos;accueil)
                  </label>
                </div>
                {editingId ? (
                  <label className="flex flex-col gap-1 text-sm md:col-span-2">
                    Statut publication
                    <select
                      className="rounded-xl border px-3 py-2"
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value as PuppyRow["status"] }))
                      }
                    >
                      {Object.entries(puppyStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <div className="flex flex-wrap gap-2 md:col-span-2">
                  <button type="submit" className="rounded-xl bg-[#8c6a3f] px-5 py-2 text-white hover:bg-[#715330]">
                    {editingId ? "Enregistrer" : "Creer"}
                  </button>
                  {editingId ? (
                    <button type="button" onClick={resetForm} className="rounded-xl border px-5 py-2">
                      Annuler edition
                    </button>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#dccdb5] bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[#dccdb5] bg-[#faf7f2]">
                  <tr>
                    <th className="p-3 font-semibold">Nom</th>
                    <th className="p-3 font-semibold">Slug</th>
                    <th className="p-3 font-semibold">Prix</th>
                    <th className="p-3 font-semibold">Statut</th>
                    <th className="p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {puppies.map((p) => (
                    <tr key={p.id} className="border-b border-[#efe4d4]">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.slug}</td>
                      <td className="p-3">
                        {p.priceOnRequest ? (
                          <span className="text-[#6f6454]">Sur demande</span>
                        ) : (
                          <>${(p.priceCents / 100).toLocaleString("fr-CA")}</>
                        )}
                      </td>
                      <td className="p-3">
                        <select
                          className="rounded-lg border px-2 py-1"
                          value={p.status}
                          onChange={(e) => quickStatus(p.id, e.target.value as PuppyRow["status"])}
                        >
                          {Object.entries(puppyStatusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="space-x-2 p-3">
                        <button type="button" className="text-[#8c6a3f] hover:underline" onClick={() => startEdit(p)}>
                          Modifier
                        </button>
                        <button type="button" className="text-red-700 hover:underline" onClick={() => removePuppy(p.id)}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {puppies.length === 0 ? <p className="p-6 text-sm text-[#6f6454]">Aucun chiot en base.</p> : null}
            </div>
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-[#dccdb5] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#dccdb5] bg-[#faf7f2]">
                <tr>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Client</th>
                  <th className="p-3 font-semibold">Chiot</th>
                  <th className="p-3 font-semibold">Acompte</th>
                  <th className="p-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-[#efe4d4]">
                    <td className="p-3 whitespace-nowrap">{new Date(r.createdAt).toLocaleString("fr-CA")}</td>
                    <td className="p-3">
                      <div className="font-medium">{r.customerName}</div>
                      <div className="text-xs text-[#6f6454]">{r.customerEmail}</div>
                      <div className="text-xs text-[#6f6454]">{r.customerPhone}</div>
                    </td>
                    <td className="p-3">
                      <div>{r.puppy.name}</div>
                      <div className="text-xs text-[#6f6454]">{r.puppy.slug}</div>
                    </td>
                    <td className="p-3 text-sm">
                      {r.depositAmountCents != null
                        ? `${(r.depositAmountCents / 100).toLocaleString("fr-CA", { style: "currency", currency: "CAD" })}`
                        : "—"}
                    </td>
                    <td className="p-3">
                      <select
                        className="rounded-lg border px-2 py-1"
                        value={r.status}
                        onChange={(e) =>
                          updateReservationStatus(r.id, e.target.value as ReservationRow["status"])
                        }
                      >
                        {Object.entries(reservationStatusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 ? <p className="p-6 text-sm text-[#6f6454]">Aucune commande.</p> : null}
          </div>
        ) : null}

        {tab === "messages" ? (
          <div className="mt-8 space-y-4">
            {messages.map((m) => (
              <article key={m.id} className="rounded-2xl border border-[#dccdb5] bg-white p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{m.subject}</h3>
                  <time className="text-xs text-[#6f6454]">{new Date(m.createdAt).toLocaleString("fr-CA")}</time>
                </div>
                <p className="mt-1 text-sm text-[#463d33]">
                  {m.name} — {m.email}
                  {m.phone ? ` — ${m.phone}` : ""}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-[#4f473d]">{m.content}</p>
              </article>
            ))}
            {messages.length === 0 ? <p className="text-sm text-[#6f6454]">Aucun message.</p> : null}
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}
