import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
          404
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-white/70">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-white/90"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

