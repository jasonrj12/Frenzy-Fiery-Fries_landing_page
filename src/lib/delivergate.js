export const DELIVERGATE_MENU_URL =
  "https://pos.delivergate.com/api/v1/webshop/main-menu/3/categories/webshop-brand/1/shop/2";
export const DELIVERGATE_CATEGORIES_URL =
  "https://pos.delivergate.com/api/v1/webshop/categories/webshop-brand/1/shop/2";
export const DELIVERGATE_PROMOTIONS_URL =
  "https://webshop.delivergate.com/api/v1/webshop-brand/1/promotion?outlet_id=2";
export const DELIVERGATE_OFFERS_URL =
  "https://reservation.delivergate.com/api/v1/offers?shop_id=2&status=1";
export const DELIVERGATE_ORDER_METHODS_URL =
  "https://webshop.delivergate.com/api/v1/webshop-brand/1/outlet/2/order-methods";

export const DELIVERGATE_TENANT_CODE = "frenzyfieryfries";
export const DELIVERGATE_WEBSHOP_URL = "https://frenzyfieryfries-webshop.delivergate.com/";

export async function fetchDelivergateMenu({ signal } = {}) {
  const res = await fetch(DELIVERGATE_MENU_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant-code": DELIVERGATE_TENANT_CODE,
    },
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Menu request failed (${res.status}). ${body ? body.slice(0, 200) : ""}`.trim(),
    );
  }

  return res.json();
}

export async function fetchDelivergateCategories({ signal } = {}) {
  const res = await fetch(DELIVERGATE_CATEGORIES_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant-code": DELIVERGATE_TENANT_CODE,
    },
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Categories request failed (${res.status}). ${
        body ? body.slice(0, 200) : ""
      }`.trim(),
    );
  }

  return res.json();
}

export async function fetchDelivergatePromotions({ signal } = {}) {
  const res = await fetch(DELIVERGATE_PROMOTIONS_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant-code": DELIVERGATE_TENANT_CODE,
    },
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Promotions request failed (${res.status}). ${
        body ? body.slice(0, 200) : ""
      }`.trim(),
    );
  }

  return res.json();
}

export async function fetchDelivergateOffers({ signal } = {}) {
  const res = await fetch(DELIVERGATE_OFFERS_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant-code": DELIVERGATE_TENANT_CODE,
    },
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Offers request failed (${res.status}). ${body ? body.slice(0, 200) : ""}`.trim(),
    );
  }

  return res.json();
}

export async function fetchDelivergateOrderMethods({ signal } = {}) {
  const res = await fetch(DELIVERGATE_ORDER_METHODS_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-tenant-code": DELIVERGATE_TENANT_CODE,
    },
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Order methods request failed (${res.status}). ${
        body ? body.slice(0, 200) : ""
      }`.trim(),
    );
  }

  return res.json();
}

export function normalizeDelivergateCategories(payload) {
  const cats = payload?.data?.categories;
  if (!Array.isArray(cats)) return [];
  return cats
    .map((c) => ({
      id: c?.id ?? null,
      title: String(c?.title ?? "").trim(),
      priority: Number(c?.priority ?? 0),
    }))
    .filter((c) => c.title)
    .sort((a, b) => a.priority - b.priority);
}

export function normalizeDelivergateMenu(payload) {
  const data = payload?.data;
  if (!data || typeof data !== "object") return { categories: [], items: [] };

  const categories = Object.keys(data);
  const items = [];

  for (const catName of categories) {
    const arr = Array.isArray(data[catName]) ? data[catName] : [];
    for (const p of arr) {
      items.push({
        id: String(p?.id ?? `${catName}-${p?.title ?? "item"}`),
        category: catName,
        name: String(p?.title ?? "Item"),
        description: String(p?.description ?? ""),
        imageUrl: p?.image_url ?? null,
        price: Number(p?.price ?? 0),
        availability: Number(p?.availability ?? 1),
        containsAlcohol: Boolean(p?.contains_alcohol),
        modifiers: Array.isArray(p?.modifiers) ? p.modifiers : [],
        raw: p,
      });
    }
  }

  return { categories, items };
}

export function normalizeMenuOffers(payload) {
  const data = payload?.data;
  if (!data || typeof data !== "object") return [];

  const offers = [];
  const seen = new Set();

  for (const catName of Object.keys(data)) {
    const arr = Array.isArray(data[catName]) ? data[catName] : [];
    for (const p of arr) {
      const isSale = Number(p?.is_sale) === 1;
      const isBogo = Number(p?.has_bogo_offer) === 1;
      if (!isSale && !isBogo) continue;

      const itemId = String(p?.id ?? `menu-offer-${p?.title}`);
      if (seen.has(itemId)) continue; // skip duplicates across categories
      seen.add(itemId);

      const price = Number(p?.price ?? 0);
      const salePrice = p?.sale_price != null ? Number(p.sale_price) : null;
      const badgeLabel = isBogo
        ? "BOGO"
        : salePrice != null && salePrice < price
        ? `Was £${price.toFixed(2)}`
        : "On Sale";

      // Build a clean webshop URL for this item
      const itemUrl = `https://frenzyfieryfries-webshop.delivergate.com/?category=${encodeURIComponent(catName)}&item=${encodeURIComponent(String(p?.title ?? ""))}`;

      offers.push({
        id: itemId,
        title: String(p?.title ?? "Special Offer"),
        body: String(p?.description ?? "").trim(),
        badge: badgeLabel,
        price,
        salePrice,
        imageUrl: p?.image_url ?? null,
        category: catName,
        isBogo,
        isSale,
        itemUrl,
      });
    }
  }

  return offers;
}

export function normalizeDelivergatePromotions(payload) {
  const arr = payload?.data;
  if (!Array.isArray(arr)) return [];

  return arr
    .map((p) => {
      const descArr = Array.isArray(p?.description) ? p.description : [];
      const lines = descArr
        .map((d) => (typeof d?.p === "string" ? d.p.trim() : ""))
        .filter(Boolean);
      const body = lines.join(" ");

      return {
        id: String(p?.id ?? p?.ref ?? p?.heading ?? "promo"),
        title: String(p?.heading ?? "Promotion").trim(),
        body,
        badge: p?.ref ? String(p.ref) : "Promotion",
        isRealTime: Boolean(p?.real_time),
        raw: p,
      };
    })
    .filter((p) => p.title);
}

export function normalizeDelivergateOffers(payload) {
  const arr = payload?.data;
  if (!Array.isArray(arr)) return [];

  return arr
    .map((o) => ({
      id: String(o?.id ?? o?.ref ?? o?.title ?? "offer"),
      title: String(o?.title ?? o?.heading ?? o?.name ?? "Offer").trim(),
      body: String(o?.description ?? o?.body ?? "").trim(),
      badge: String(o?.type ?? "Offer"),
      raw: o,
    }))
    .filter((o) => o.title);
}

export function normalizeDelivergateOrderMethods(payload) {
  const arr = payload?.data;
  if (!Array.isArray(arr)) return [];

  return arr.map((m) => ({
    type: String(m?.type ?? ""),
    localizedType: String(m?.localized_type ?? m?.type ?? ""),
    duration: String(m?.duration ?? ""),
    minDuration: Number(m?.min_duration ?? 0),
    maxDuration: Number(m?.max_duration ?? 0),
    icon: String(m?.icon ?? ""),
    raw: m,
  }));
}

