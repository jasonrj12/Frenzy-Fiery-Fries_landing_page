import React, { useMemo, useState, useEffect, useRef } from "react";

import { Icon, classNames } from "../lib/ui.jsx";
import { fetchDelivergateMenu, normalizeDelivergateMenu } from "../lib/delivergate.js";



function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
      <span className="h-2.5 w-2.5 rounded-full bg-brand-mustard" />
      {children}
    </span>
  );
}

function ImageSlider() {
  const images = ["/loaded_fiery_fries_wide.png", "/smash_burger_wide.png", "Web hero.png"];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 aspect-video bg-white/5">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Slide ${index + 1}`}
          className={classNames(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            index === current ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={classNames(
              "h-2 w-2 rounded-full transition-all",
              index === current ? "bg-brand-mustard w-6" : "bg-white/40 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function Section({ eyebrow, title, subtitle, children }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          {eyebrow ? (
            <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
              {eyebrow}
            </div>
          ) : null}
          {title ? (
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Pill({ icon, title, body }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/15 hover:bg-white/7">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-ember/30 to-brand-hot/10 text-brand-mustard ring-1 ring-white/10">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/70">{body}</div>
        </div>
      </div>
    </div>
  );
}

function FeaturedItemCard({ item }) {
  return (
    <a
      href="https://frenzyfieryfries-webshop.delivergate.com/food-menu"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 backdrop-blur transition hover:border-white/15 flex flex-col aspect-square"
    >
      <div className="relative flex-1 w-full overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      <div className="relative -mt-6 p-6 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mt-2 text-lg font-semibold text-white">{item.name}</div>
          </div>
          <div className="text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
            £{Number(item.price).toFixed(2)}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm font-semibold text-white/80 transition-colors group-hover:text-brand-mustard">
          Order Now <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </a>
  );
}

function CategoryCard({ title, tag, accent, glyph }) {
  return (
    <a
      href="https://frenzyfieryfries-webshop.delivergate.com/food-menu"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/7 to-white/3 p-6 backdrop-blur transition hover:border-white/15 aspect-square flex flex-col justify-between"
    >
      <div className="absolute inset-0 opacity-60">
        <div
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
          style={{ background: accent }}
        />
        <div
          className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-2xl"
          style={{ background: accent }}
        />
      </div>
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            {tag}
          </div>
          <div className="mt-2 text-lg font-semibold text-white">{title}</div>
          <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/80">
            Explore
            <span className="transition group-hover:translate-x-0.5">→</span>
          </div>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/8 text-2xl ring-1 ring-white/10">
          {glyph}
        </div>
      </div>
    </a>
  );
}

function ReviewCard({ name, stars, quote, meta }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-white">{name}</div>
        <div className="flex items-center gap-1 text-brand-mustard">
          {Array.from({ length: stars }).map((_, i) => (
            <Icon key={i} name="star" className="h-4 w-4" />
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/75">“{quote}”</p>
      <div className="mt-4 text-xs font-medium text-white/55">{meta}</div>
    </div>
  );
}

function HeatMeter() {
  const [heat, setHeat] = useState(1);
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const levels = [
    { name: "Mild", desc: "Just a tickle.", from: "from-amber-400", to: "to-yellow-500", shadow: "shadow-amber-500/50", emoji: "🌶️", text: "text-amber-400", bg: "bg-amber-500" },
    { name: "Hot", desc: "Feel the burn.", from: "from-orange-500", to: "to-red-500", shadow: "shadow-orange-500/50", emoji: "🔥", text: "text-orange-500", bg: "bg-orange-500" },
    { name: "Fiery", desc: "Sweat it out.", from: "from-red-500", to: "to-rose-600", shadow: "shadow-red-500/50", emoji: "🌋", text: "text-red-500", bg: "bg-red-600" },
    { name: "Frenzy", desc: "Call an ambulance.", from: "from-rose-600", to: "to-purple-700", shadow: "shadow-rose-600/70", emoji: "☠️", text: "text-rose-500", bg: "bg-rose-700" }
  ];

  const current = levels[heat];

  const handleMouseMove = (e) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    glowRef.current.style.transform = `translate(${x}px, ${y}px)`;
    glowRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return;
    cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    glowRef.current.style.opacity = '0';
  };

  return (
    <div className="relative w-full" style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl transition-all duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={classNames(
          "absolute inset-0 bg-gradient-to-br opacity-20 transition-all duration-700",
          current.from, current.to
        )} />

        <div
          ref={glowRef}
          className={classNames(
            "pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-opacity duration-300",
            current.bg
          )}
          style={{ opacity: 0 }}
        />

        <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/80">Dial the Heat</h3>
            <div className={classNames("flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-2xl ring-1 ring-white/10 transition-transform duration-500", heat === 3 ? "scale-110 animate-bounce" : "")}>
              {current.emoji}
            </div>
          </div>

          <div className="my-10 flex justify-center" style={{ transform: 'translateZ(50px)' }}>
            <div className="relative flex h-36 w-36 items-center justify-center">
              <div className={classNames(
                "absolute inset-0 rounded-full bg-gradient-to-br blur-2xl transition-all duration-700",
                current.from, current.to,
                heat === 3 ? "animate-pulse opacity-100 scale-110" : "opacity-40"
              )} />

              <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-zinc-900 shadow-xl transition-all duration-500">
                <span className={classNames(
                  "text-3xl font-black italic tracking-tighter transition-colors duration-500",
                  current.text,
                  heat === 3 ? "drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" : ""
                )}>
                  {heat + 1}
                </span>
              </div>

              <svg className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 8" />
              </svg>
              <svg className={classNames(
                "absolute inset-0 h-full w-full",
                heat > 0 ? "animate-[spin_4s_linear_infinite_reverse]" : "animate-[spin_10s_linear_infinite_reverse]"
              )} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="15 25" className={classNames("transition-colors duration-500", current.text)} />
              </svg>
            </div>
          </div>

          <div style={{ transform: 'translateZ(20px)' }}>
            <div className="flex justify-between gap-2">
              {levels.map((lvl, idx) => (
                <button
                  key={lvl.name}
                  onClick={() => setHeat(idx)}
                  className={classNames(
                    "relative flex-1 overflow-hidden rounded-xl py-2.5 text-xs font-bold transition-all duration-300",
                    heat === idx
                      ? classNames(lvl.bg, "text-white shadow-lg scale-105", lvl.shadow)
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className="relative z-10">{lvl.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 text-center h-5">
              <p className="text-sm font-medium text-white/80 transition-all duration-300">{current.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    setLoadingItems(true);

    fetchDelivergateMenu({ signal: ac.signal })
      .then((menuJson) => {
        const normalizedMenu = normalizeDelivergateMenu(menuJson);
        const availableItems = normalizedMenu.items.filter(
          (item) => item.availability === 1
        );

        let categories = [...new Set(availableItems.map(item => item.category))];

        // Exclude "build your taste"
        categories = categories.filter(c => !c.toLowerCase().includes("build your taste"));

        // Prioritize "wing" or "chicken" categories so they make the top 4
        categories.sort((a, b) => {
          const aPriority = a.toLowerCase().includes("wing") || a.toLowerCase().includes("chicken") ? 1 : 0;
          const bPriority = b.toLowerCase().includes("wing") || b.toLowerCase().includes("chicken") ? 1 : 0;
          return bPriority - aPriority;
        });

        const newFeaturedItems = [];
        const seenNames = new Set();

        categories.forEach(cat => {
          const itemsInCat = availableItems.filter(item => item.category === cat);

          // Prioritize items with images, and explicitly items with "wing"
          itemsInCat.sort((a, b) => {
            const aImage = a.imageUrl ? 1 : 0;
            const bImage = b.imageUrl ? 1 : 0;

            const aWing = a.name.toLowerCase().includes("wing") ? 1 : 0;
            const bWing = b.name.toLowerCase().includes("wing") ? 1 : 0;

            // If one has "wing" and the other doesn't, prioritize "wing"
            if (aWing !== bWing) return bWing - aWing;
            // Otherwise fallback to image priority
            return bImage - aImage;
          });

          const uniqueItem = itemsInCat.find(item => !seenNames.has(item.name));
          if (uniqueItem) {
            seenNames.add(uniqueItem.name);
            newFeaturedItems.push(uniqueItem);
          }
        });

        setFeaturedItems(newFeaturedItems.slice(0, 4));
        setLoadingItems(false);
      })
      .catch((e) => {
        if (!ac.signal.aborted) {
          console.error("Failed to fetch featured menu items:", e);
          setLoadingItems(false);
        }
      });

    return () => ac.abort();
  }, []);

  const fallbackCategories = useMemo(
    () => [
      {
        tag: "Popular",
        title: "Loaded Fiery Fries",
        accent: "rgba(255, 59, 48, 0.35)",
        glyph: "🍟",
      },
      {
        tag: "Street-style",
        title: "Smash Burgers",
        accent: "rgba(251, 191, 36, 0.25)",
        glyph: "🍔",
      },
      {
        tag: "Crispy",
        title: "Hot Chicken",
        accent: "rgba(255, 122, 24, 0.25)",
        glyph: "🍗",
      },
      {
        tag: "Fresh",
        title: "Dips & Sides",
        accent: "rgba(255, 255, 255, 0.15)",
        glyph: "🥤",
      },
    ],
    [],
  );

  const reviews = useMemo(
    () => [
      {
        name: "Ayesha",
        stars: 5,
        quote: "The fries were unreal - spicy, crunchy, and still hot on arrival.",
        meta: "Delivery • 15 - 20 mins",
      },
      {
        name: "Khalid",
        stars: 5,
        quote: "Smash burger + fiery fries combo is my new weekly ritual.",
        meta: "Collection • Ready in 15 mins",
      },
      {
        name: "Sophie",
        stars: 5,
        quote: "Great portions, great flavour. The house dip is addictive.",
        meta: "Delivery • 4.9 rating",
      },
    ],
    [],
  );

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-14 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge>⚡ Fast &amp; Fresh Delivery</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Every crunch, a{" "}
              <span className="bg-gradient-to-r from-brand-mustard via-brand-ember to-brand-hot bg-clip-text text-transparent">
                burst of heat
              </span>
              .
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Hand-cut fries, house-made dips, smash burgers, and spicy
              chicken—crafted for maximum flavour and delivered hot.
            </p>


            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Pill
                icon="bolt"
                title="In-house delivery"
                body="Your order goes straight from kitchen to door."
              />
              <Pill
                icon="star"
                title="5-star favourites"
                body="Top-rated combos and signature dips."
              />
              <Pill
                icon="pin"
                title="Local & fast"
                body="Freshly made, never sitting around."
              />
            </div>
          </div>

          <div className="relative">
            <HeatMeter />
          </div>
        </div>
      </div>

      <Section>
        <ImageSlider />
      </Section>

      <Section
        eyebrow="Featured Menu"
        title="Pick your flavour lane"
        subtitle="Start with the classics, then turn up the heat. Build your own combo in seconds."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loadingItems ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-3xl border border-white/10 bg-white/5 animate-pulse" />
            ))
          ) : featuredItems.length > 0 ? (
            featuredItems.map((item) => (
              <FeaturedItemCard key={item.id} item={item} />
            ))
          ) : (
            fallbackCategories.map((c) => (
              <CategoryCard
                key={c.title}
                title={c.title}
                tag={c.tag}
                accent={c.accent}
                glyph={c.glyph}
              />
            ))
          )}
        </div>


      </Section>

      <Section
        eyebrow="What customers say"
        title="Real reviews, real cravings"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard
              key={r.name}
              name={r.name}
              stars={r.stars}
              quote={r.quote}
              meta={r.meta}
            />
          ))}
        </div>
      </Section>

    </>
  );
}


