import React, { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { classNames, Icon } from "../lib/ui.jsx";

function NavPill({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        classNames(
          "rounded-full px-4 py-2 text-xs font-semibold transition",
          isActive
            ? "bg-white text-zinc-900"
            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default function SiteLayout() {
  const location = useLocation();
  const [showTop, setShowTop] = useState(false);

  const links = useMemo(
    () => [
      { label: "Home", to: "/", icon: "home" },
      { label: "Menu", to: "/menu", icon: "utensils" },
      { label: "Promotions", to: "/promotions", icon: "ticket" },
    ],
    [],
  );

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-brand-hot/25 blur-3xl" />
          <div className="absolute top-32 left-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-mustard/15 blur-3xl" />
          <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-brand-ember/20 blur-3xl" />
        </div>

        <header className="sticky top-0 z-50">
          <div className="border-b border-white/10 bg-zinc-950/60 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Frenzy & Fiery Fries"
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                />
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-tight text-white">
                    Frenzy &amp; Fiery Fries
                  </div>
                  <div className="text-xs text-white/60">
                    Fast. Fresh. Fiery.
                  </div>
                </div>
              </Link>

              <nav className="hidden md:block">
                <div className="rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
                  <div className="flex items-center gap-1">
                    {links.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.to === "/"}
                        className={({ isActive }) =>
                          classNames(
                            "rounded-full px-4 py-2 text-sm font-semibold transition",
                            isActive
                              ? "bg-white text-zinc-900 shadow-sm"
                              : "text-white/75 hover:bg-white/10 hover:text-white",
                          )
                        }
                      >
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </nav>

              <div className="flex items-center gap-2">
                <a
                  href="https://frenzyfieryfries-webshop.delivergate.com/food-menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-white/90"
                >
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="relative">
          <div className="pb-24 md:pb-0">
            <Outlet />
          </div>

          <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden" style={{background: "rgba(9,9,11,0.97)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.07)"}}>
            <div className="flex items-stretch justify-around">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className="relative flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors duration-200"
                  style={{minHeight: "62px"}}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-10 rounded-full"
                          style={{
                            background: "linear-gradient(90deg, #ff4500, #ff8c00)",
                            boxShadow: "0 0 10px 2px rgba(255,80,0,0.55)"
                          }}
                        />
                      )}
                      <Icon
                        name={l.icon}
                        className={classNames(
                          "h-[22px] w-[22px] transition-all duration-200",
                          isActive ? "text-orange-500" : "text-zinc-500"
                        )}
                      />
                      <span
                        className={classNames(
                          "text-[10px] font-semibold tracking-wide transition-colors duration-200",
                          isActive ? "text-white" : "text-zinc-500"
                        )}
                      >
                        {l.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          <button
            type="button"
            onClick={goTop}
            className={classNames(
              "fixed bottom-24 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur transition hover:bg-white/15 md:bottom-5",
              showTop ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-label="Go to top"
          >
            <span className="text-lg">↑</span>
          </button>

          <footer className="border-t border-white/10 bg-zinc-950 pt-16 pb-8">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
                <div className="md:col-span-2 lg:col-span-2">
                  <Link to="/" className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Frenzy & Fiery Fries"
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <div className="text-lg font-bold tracking-tight text-white">
                        Frenzy &amp; Fiery Fries
                      </div>
                      <div className="text-sm font-medium text-brand-hot">
                        Every crunch, a burst of heat.
                      </div>
                    </div>
                  </Link>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
                    Experience the ultimate fusion of fast, fresh, and fiery flavors.
                    Our signature fries and mouth-watering meals are crafted to ignite your taste buds.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
                  <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                    <li><Link to="/" className="transition hover:text-white">Home</Link></li>
                    <li><Link to="/menu" className="transition hover:text-white">Our Menu</Link></li>
                    <li><Link to="/promotions" className="transition hover:text-white">Promotions</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
                  <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                    <li className="leading-relaxed">
                      25 The Parade, Staines Rd W,<br />
                      Sunbury-on-Thames, TW16 7AB
                    </li>
                    <li>
                      <a href="mailto:frenzyfirey.fries@gmail.com" className="transition hover:text-white">
                        frenzyfirey.fries@gmail.com
                      </a>
                    </li>
                    <li>
                      <a href="tel:01932364818" className="transition hover:text-white">
                        01932364818
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="md:col-span-4 lg:col-span-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Get the App</h3>
                  <p className="mt-4 text-sm text-zinc-400 lg:hidden">
                    Download our mobile app for exclusive deals and faster ordering!
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 sm:flex-nowrap lg:flex-col">
                    <a href="#" className="flex h-[3.25rem] w-40 items-center justify-center gap-2.5 rounded-xl bg-zinc-900 ring-1 ring-white/10 transition hover:bg-zinc-800 hover:ring-white/20">
                      <svg viewBox="0 0 384 512" fill="currentColor" className="h-7 w-7 text-white">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-medium leading-none text-zinc-400">Download on the</span>
                        <span className="text-sm font-semibold leading-tight text-white">App Store</span>
                      </div>
                    </a>
                    <a href="#" className="flex h-[3.25rem] w-40 items-center justify-center gap-2.5 rounded-xl bg-zinc-900 ring-1 ring-white/10 transition hover:bg-zinc-800 hover:ring-white/20">
                      <svg viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6 text-white">
                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                      </svg>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-medium leading-none text-zinc-400">GET IT ON</span>
                        <span className="text-sm font-semibold leading-tight text-white">Google Play</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 sm:flex-row">
                <div className="flex flex-col items-center gap-2 sm:items-start">
                  <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Frenzy &amp; Fiery Fries. All rights reserved.</p>
                  <p className="text-xs text-zinc-500">
                    Powered by <a href="https://www.delivergate.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition hover:text-white">Delivergate Ltd</a>
                  </p>
                </div>
                <div className="mt-4 flex gap-4 sm:mt-0">
                  <a href="https://www.facebook.com/p/Frenzy-Fiery-Fries-61577615966889/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition hover:text-white" aria-label="Facebook">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/frenzyfieryfries" target="_blank" rel="noopener noreferrer" className="text-zinc-500 transition hover:text-white" aria-label="Instagram">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

