import React, { useEffect, useMemo, useState } from "react";
import { PROMOTIONS } from "../data/promotions.js";
import { Icon, classNames } from "../lib/ui.jsx";
import {
  fetchDelivergateOffers,
  fetchDelivergatePromotions,
  normalizeDelivergateOffers,
  normalizeDelivergatePromotions,
} from "../lib/delivergate.js";

function formatTime(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

function PromoCard({ promo, active, onToggle }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 backdrop-blur">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-ember/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-semibold text-white">{promo.title}</div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
            {promo.badge}
          </span>
        </div>
        <div className="mt-2 text-sm text-white/70">{promo.body}</div>

        <button
          type="button"
          onClick={onToggle}
          className={classNames(
            "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
            active
              ? "bg-white text-zinc-900 hover:bg-white/90"
              : "border border-white/15 bg-white/5 text-white hover:bg-white/10",
          )}
        >
          {active ? "Applied" : "Apply deal"}
          <span className={active ? "text-zinc-900/70" : "text-white/70"}>
            {active ? "✓" : "+"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Promotions() {
  // A simple “deal stack” simulator (dynamic content)
  const [applied, setApplied] = useState(() => new Set());

  const [remoteStatus, setRemoteStatus] = useState("loading"); // loading | ready | error
  const [remotePromos, setRemotePromos] = useState([]);
  const [remoteOffers, setRemoteOffers] = useState([]);

  useEffect(() => {
    const ac = new AbortController();
    setRemoteStatus("loading");

    Promise.all([
      fetchDelivergatePromotions({ signal: ac.signal }),
      fetchDelivergateOffers({ signal: ac.signal }),
    ])
      .then(([promosJson, offersJson]) => {
        setRemotePromos(normalizeDelivergatePromotions(promosJson));
        setRemoteOffers(normalizeDelivergateOffers(offersJson));
        setRemoteStatus("ready");
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        setRemoteStatus("error");
        void e;
      });

    return () => ac.abort();
  }, []);

  const promos = useMemo(() => {
    if (remoteStatus === "ready" && remotePromos.length) return remotePromos;
    return PROMOTIONS;
  }, [remotePromos, remoteStatus]);

  const offers = useMemo(() => {
    if (remoteStatus === "ready") return remoteOffers;
    return [];
  }, [remoteOffers, remoteStatus]);

  // “Flash drop” countdown (dynamic content)
  const [now, setNow] = useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const dropEndsAt = useMemo(() => {
    // Next local hour
    const d = new Date();
    d.setMinutes(60, 0, 0);
    return d.getTime();
  }, []);

  const remaining = dropEndsAt - now;

  const appliedCount = applied.size;

  function toggle(id) {
    setApplied((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            <Icon name="bolt" className="h-4 w-4 text-brand-mustard" />
            Deals &amp; offers
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Promotions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Apply and stack promotions (demo behaviour), plus a live countdown
            for a “flash drop” deal.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Applied
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {appliedCount} deal{appliedCount === 1 ? "" : "s"} selected
          </div>
        </div>
      </div>

      {remoteStatus === "loading" ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur">
          Loading promotions…
        </div>
      ) : null}

      {remoteStatus === "error" ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur">
          <div className="font-semibold text-white">
            Something went wrong
          </div>
          <div className="mt-2 text-white/70">
            We couldn’t load promotions right now. Please try again in a moment.
          </div>
          <div className="mt-3 text-xs text-white/50">
            Showing fallback promotions for now.
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.55fr]">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {promos.map((p) => (
              <PromoCard
                key={p.id}
                promo={p}
                active={applied.has(p.id)}
                onToggle={() => toggle(p.id)}
              />
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Offers
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Reservation offers (live)
                </div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                {offers.length} active
              </span>
            </div>

            {offers.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {offers.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-3xl border border-white/10 bg-zinc-950/35 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold text-white">
                        {o.title}
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                        {o.badge}
                      </span>
                    </div>
                    {o.body ? (
                      <div className="mt-2 text-sm text-white/70">{o.body}</div>
                    ) : (
                      <div className="mt-2 text-sm text-white/50">
                        No description provided.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-950/35 p-5 text-sm text-white/70">
                No active offers found for this shop right now.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-hot/25 via-white/5 to-brand-mustard/15 p-6 backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Flash drop
          </div>
          <div className="mt-2 text-lg font-semibold text-white">
            Spicy combo ends in
          </div>
          <div className="mt-3 rounded-3xl border border-white/10 bg-zinc-950/35 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Icon name="clock" className="h-4 w-4 text-white/70" />
                Countdown
              </div>
              <div className="text-xs font-medium text-white/60">
                Resets every hour
              </div>
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {formatTime(remaining)}
            </div>
            <p className="mt-2 text-sm text-white/70">
              Swap this timer to match your real promotions schedule.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950/30 p-5">
            <div className="text-sm font-semibold text-white">
              Next steps (when you’re ready)
            </div>
            <ul className="mt-3 grid gap-2 text-sm text-white/75">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-mustard" />
                Connect to your real offers system
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-mustard" />
                Track redemptions + promo codes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-mustard" />
                Personalize deals per customer
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

