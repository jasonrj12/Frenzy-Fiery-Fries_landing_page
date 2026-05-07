import React, { useEffect, useMemo, useState } from "react";
// import { PROMOTIONS } from "../data/promotions.js";
import { classNames } from "../lib/ui.jsx";
import {
  fetchDelivergatePromotions,
  fetchDelivergateMenu,
  normalizeDelivergatePromotions,
  normalizeMenuOffers,
} from "../lib/delivergate.js";

/* ── Promo banner card ─────────────────────────────────────────────── */
function PromoCard({ promo, index }) {
  const accents = [
    { glow: "from-brand-hot/30 to-brand-ember/10", dot: "bg-brand-hot" },
    { glow: "from-brand-ember/30 to-brand-mustard/10", dot: "bg-brand-ember" },
    { glow: "from-brand-mustard/30 to-brand-hot/10", dot: "bg-brand-mustard" },
  ];
  const accent = accents[index % accents.length];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${accent.glow} border border-white/10 p-6 backdrop-blur-md`}>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5 blur-xl" />

      <div className="relative flex flex-col gap-4">
        {/* Badge */}
        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-900 ${accent.dot}`}>
          {promo.badge}
        </span>
        <div className="text-xl font-bold leading-tight text-white">{promo.title}</div>
        <p className="text-sm leading-relaxed text-white/70">{promo.body}</p>
      </div>
    </div>
  );
}

/* ── Live offer card ───────────────────────────────────────────────── */
function OfferCard({ offer }) {
  return (
    <a
      href={offer.itemUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md transition-all duration-300 hover:border-brand-ember/40 hover:shadow-lg hover:shadow-brand-ember/10 hover:-translate-y-1"
    >
      {/* Image */}
      {offer.imageUrl ? (
        <div className="relative overflow-hidden">
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {/* Badge overlay */}
          <span className={classNames(
            "absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
            offer.isBogo
              ? "bg-brand-mustard text-zinc-900"
              : "bg-brand-ember text-white",
          )}>
            {offer.badge}
          </span>
        </div>
      ) : (
        /* No image — coloured top strip */
        <div className="flex h-16 items-center justify-between bg-gradient-to-r from-brand-ember/30 to-brand-hot/20 px-5">
          <span className={classNames(
            "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
            offer.isBogo ? "bg-brand-mustard text-zinc-900" : "bg-brand-ember text-white",
          )}>
            {offer.badge}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
          {offer.category}
        </div>
        <div className="text-base font-bold text-white leading-snug">{offer.title}</div>
        {offer.body ? (
          <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">{offer.body}</p>
        ) : null}

        {/* Price row */}
        {offer.salePrice != null && offer.salePrice > 0 && offer.salePrice < offer.price ? (
          <div className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="text-2xl font-extrabold text-brand-mustard">
              £{Number(offer.salePrice).toFixed(2)}
            </span>
            <span className="text-sm text-white/40 line-through">
              £{Number(offer.price).toFixed(2)}
            </span>
            <span className="ml-auto rounded-full bg-brand-ember/20 px-2 py-0.5 text-[11px] font-bold text-brand-ember">
              {Math.round((1 - offer.salePrice / offer.price) * 100)}% off
            </span>
          </div>
        ) : offer.salePrice != null && offer.salePrice > 0 && offer.salePrice >= offer.price ? (
          <div className="mt-auto pt-3 text-xl font-bold text-white">
            £{Number(offer.salePrice).toFixed(2)}
          </div>
        ) : offer.price > 0 ? (
          <div className="mt-auto pt-3 text-xl font-bold text-white">
            £{Number(offer.price).toFixed(2)}
          </div>
        ) : null}

        {/* CTA */}
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-ember opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
          Order now <span>→</span>
        </div>
      </div>
    </a>
  );
}

/* ── Skeleton loader ───────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden">
      <div className="h-44 bg-white/5" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function Promotions() {
  const [remoteStatus, setRemoteStatus] = useState("loading");
  const [remotePromos, setRemotePromos] = useState([]);
  const [menuOffers, setMenuOffers] = useState([]);

  useEffect(() => {
    const ac = new AbortController();
    setRemoteStatus("loading");

    Promise.all([
      fetchDelivergatePromotions({ signal: ac.signal }),
      fetchDelivergateMenu({ signal: ac.signal }),
    ])
      .then(([promosJson, menuJson]) => {
        setRemotePromos(normalizeDelivergatePromotions(promosJson));
        setMenuOffers(normalizeMenuOffers(menuJson));
        setRemoteStatus("ready");
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        setRemoteStatus("error");
        void e;
      });

    return () => ac.abort();
  }, []);

  const regularPromos = useMemo(() => {
    if (remoteStatus === "ready" && remotePromos.length) {
      return remotePromos.filter((p) => !p.isRealTime);
    }
    return [];
  }, [remotePromos, remoteStatus]);

  const realTimeOffers = useMemo(() => {
    if (remoteStatus !== "ready") return [];
    const fromPromos = remotePromos.filter((p) => p.isRealTime);
    const seen = new Set(fromPromos.map((o) => o.id));
    return [...fromPromos, ...menuOffers.filter((o) => !seen.has(o.id))];
  }, [remotePromos, menuOffers, remoteStatus]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-hot/20 via-brand-ember/10 to-zinc-900 p-8 sm:p-12 mb-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-hot/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-brand-mustard/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-ember/30 bg-brand-ember/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-ember mb-5">
            🔥 Deals &amp; Offers
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Promotions
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/60 leading-relaxed">
            Our fiery deals, live offers, and on-sale items — all in one place.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-brand-mustard">{regularPromos.length}</span>
              <span className="text-xs text-white/50 mt-0.5">Active promotions</span>
            </div>
            <div className="w-px bg-white/10 self-stretch" />
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-brand-ember">{realTimeOffers.length}</span>
              <span className="text-xs text-white/50 mt-0.5">Live offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Promotions section ── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Current promotions</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regularPromos.map((p, i) => (
            <PromoCard key={p.id} promo={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── Live offers section ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-ember opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-ember"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Live offers</span>
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {remoteStatus === "loading" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => <Skeleton key={n} />)}
          </div>
        ) : remoteStatus === "error" ? (
          <div className="rounded-2xl border border-brand-hot/20 bg-brand-hot/5 p-6 text-sm text-white/60">
            <div className="font-semibold text-white mb-1">Couldn't load live offers</div>
            Please try again later.
          </div>
        ) : realTimeOffers.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {realTimeOffers.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 text-center">
            <div className="text-4xl mb-3">🌶️</div>
            <div className="text-sm font-semibold text-white mb-1">No live offers right now</div>
            <p className="text-sm text-white/50">Check back soon — new deals drop regularly!</p>
          </div>
        )}
      </section>
    </div>
  );
}
