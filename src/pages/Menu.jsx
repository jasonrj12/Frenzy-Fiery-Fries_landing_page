import React, { useEffect, useMemo, useState } from "react";
import { Icon, classNames } from "../lib/ui.jsx";
import {
  fetchDelivergateCategories,
  fetchDelivergateMenu,
  normalizeDelivergateCategories,
  normalizeDelivergateMenu,
} from "../lib/delivergate.js";
import { MENU_CATEGORIES, MENU_ITEMS } from "../data/menu.js";

function priceGBP(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "£0.00";
  return `£${n.toFixed(2)}`;
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-full px-4 py-2 text-xs font-semibold transition",
        active
          ? "bg-white text-zinc-900"
          : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function ItemCard({ item, onAdd }) {
  const modifierCount = useMemo(() => {
    const mods = Array.isArray(item.modifiers) ? item.modifiers : [];
    return mods.length;
  }, [item.modifiers]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-white">{item.name}</div>
            {item.availability === 1 ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/70">
                Available
              </span>
            ) : (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/50">
                Unavailable
              </span>
            )}
            {item.containsAlcohol ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/60">
                18+
              </span>
            ) : null}
          </div>
          <div className="mt-2 text-sm leading-6 text-white/70">
            {item.description}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {item.category}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {modifierCount} modifier{modifierCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <div className="text-sm font-semibold text-white">
          {priceGBP(item.price)}
        </div>
      </div>

      {item.imageUrl ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onAdd(item)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white/90"
        disabled={item.availability !== 1}
      >
        Add to order
        <span className="text-zinc-900/70">+</span>
      </button>
    </div>
  );
}

export default function Menu() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [sort, setSort] = useState("featured"); // featured | priceAsc | priceDesc
  const [cart, setCart] = useState(() => new Map());

  const [remoteStatus, setRemoteStatus] = useState("loading"); // loading | ready | error
  const [remoteCategories, setRemoteCategories] = useState([]);
  const [remoteItems, setRemoteItems] = useState([]);

  useEffect(() => {
    const ac = new AbortController();
    setRemoteStatus("loading");

    Promise.all([
      fetchDelivergateMenu({ signal: ac.signal }),
      fetchDelivergateCategories({ signal: ac.signal }),
    ])
      .then(([menuJson, categoriesJson]) => {
        const normalizedMenu = normalizeDelivergateMenu(menuJson);
        const normalizedCategories =
          normalizeDelivergateCategories(categoriesJson);

        setRemoteItems(normalizedMenu.items);
        setRemoteCategories(
          normalizedCategories.map((c) => c.title) || normalizedMenu.categories,
        );
        setRemoteStatus("ready");
      })
      .catch((e) => {
        if (ac.signal.aborted) return;
        setRemoteStatus("error");
        void e;
      });

    return () => ac.abort();
  }, []);

  const itemsSource = useMemo(() => {
    if (remoteStatus === "ready" && remoteItems.length) return "delivergate";
    return "placeholder";
  }, [remoteItems.length, remoteStatus]);

  const items = useMemo(() => {
    if (itemsSource === "delivergate") return remoteItems;
    return MENU_ITEMS.map((i) => ({
      id: i.id,
      category: MENU_CATEGORIES.find((c) => c.id === i.category)?.label ?? i.category,
      name: i.name,
      description: i.description,
      imageUrl: null,
      price: i.price,
      availability: 1,
      containsAlcohol: false,
      modifiers: [],
    }));
  }, [itemsSource, remoteItems]);

  const categories = useMemo(() => {
    if (itemsSource === "delivergate") return remoteCategories;
    return MENU_CATEGORIES.map((c) => c.label);
  }, [itemsSource, remoteCategories]);

  const cartCount = useMemo(() => {
    let c = 0;
    cart.forEach((qty) => {
      c += qty;
    });
    return c;
  }, [cart]);

  const cartTotal = useMemo(() => {
    let total = 0;
    cart.forEach((qty, id) => {
      const item = items.find((x) => x.id === id);
      if (item) total += item.price * qty;
    });
    return total;
  }, [cart, items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = items.filter((i) => {
      if (availableOnly && i.availability !== 1) return false;
      if (category !== "all" && i.category !== category) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        String(i.category).toLowerCase().includes(q)
      );
    });

    if (sort === "featured") {
      out = out.slice().sort((a, b) => {
        const aHasImg = a.imageUrl ? 1 : 0;
        const bHasImg = b.imageUrl ? 1 : 0;
        return bHasImg - aHasImg;
      });
    }
    if (sort === "priceAsc") out = out.slice().sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") out = out.slice().sort((a, b) => b.price - a.price);
    return out;
  }, [availableOnly, category, items, query, sort]);

  function addToCart(item) {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(item.id, (next.get(item.id) || 0) + 1);
      return next;
    });
  }

  function clearCart() {
    setCart(new Map());
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            <Icon name="spark" className="h-4 w-4 text-brand-mustard" />
            {itemsSource === "delivergate" ? "Menu" : "Menu"}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Menu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Search items, filter by category, and sort by price.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Your order
              </div>
              <div className="mt-1 text-sm font-semibold text-white">
                {cartCount} item{cartCount === 1 ? "" : "s"} •{" "}
                {priceGBP(cartTotal)}
              </div>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
              disabled={cartCount === 0}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {remoteStatus === "loading" ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur">
          Loading menu…
        </div>
      ) : null}

      {remoteStatus === "error" ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur">
          <div className="font-semibold text-white">
            Something went wrong
          </div>
          <div className="mt-2 text-white/70">
            We couldn’t load the menu right now. Please try again in a moment.
          </div>
          <div className="mt-3 text-xs text-white/50">
            Showing a limited menu for now.
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.55fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “loaded”, “dip”, “spicy”…"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-brand-mustard/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-white outline-none ring-brand-mustard/30 focus:ring-2"
              >
                <option value="featured">Featured</option>
                <option value="priceAsc">Price: low to high</option>
                <option value="priceDesc">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap gap-2">
              <Chip active={category === "all"} onClick={() => setCategory("all")}>
                All
              </Chip>
              {categories.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Availability
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {availableOnly ? "Available only" : "Show all items"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAvailableOnly((v) => !v)}
                className={classNames(
                  "rounded-full px-4 py-2 text-xs font-semibold transition",
                  availableOnly
                    ? "bg-white text-zinc-900"
                    : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                {availableOnly ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-hot/20 via-white/5 to-brand-mustard/15 p-6 backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Tip
          </div>
          <div className="mt-2 text-lg font-semibold text-white">
            Make it your menu
          </div>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Replace the menu data source whenever you’re ready.
          </p>
          <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-950/30 p-5">
            <div className="text-sm font-semibold text-white">
              Showing {filtered.length} item{filtered.length === 1 ? "" : "s"}
            </div>
            <p className="mt-2 text-sm text-white/70">
              Use search + filters to narrow it down.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ItemCard key={item.id} item={item} onAdd={addToCart} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70 backdrop-blur">
          No items match your filters. Try clearing the search or raising the
          heat cap.
        </div>
      ) : null}
    </div>
  );
}

