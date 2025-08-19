"use client";

import { useCartStore } from "@/store/cart/cart/cartStore";
import { useUIStore } from "@/store/ui-store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import ThemeController from "./ThemeController";
import { FiShoppingBag } from "react-icons/fi";
import { FloatingDockDemo } from "./FloatingDockDemo";

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 sm:px-8 lg:px-12 py-4 z-50">
      {/* Left: Logo */}

      <div className="flex items-center gap-2 flex-1">
        <Link
          href="/"
          className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
        >
          <FiShoppingBag className="text-primary text-2xl" />
        </Link>
      </div>
      {/* Center: Menu links (desktop only) */}
      <div className="hiden md:flex gap-2">
        <FloatingDockDemo></FloatingDockDemo>
      </div>
      {/* Right: Icons */}
      <div className="flex items-center gap-3">
        {/* Cart */}
        <Link
          href={loaded && totalItems > 0 ? "/cart" : "/emptyCart"}
          className="btn btn-ghost btn-circle relative"
        >
          <IoCartOutline className="w-15 h-15 text-base-content" />
          {loaded && totalItems > 0 && (
            <span className="badge badge-sm w-3 h-3 badge-primary absolute -top-1 -right-1">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <ThemeController />

        {/* Side Menu */}
        <button
          onClick={openSideMenu}
          className="btn btn-outline btn-sm hidden sm:inline-flex"
        >
          Menú
        </button>

        {/* Side Menu for mobile (hamburger or similar) */}
        <button
          onClick={openSideMenu}
          className="btn btn-ghost btn-circle sm:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};
