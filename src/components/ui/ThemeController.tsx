"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiSun, FiMoon } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

import ThemeControllerSkeleton from "../skeletons/ThemeControllerSkeleton";

const ThemeController = () => {
  const [theme, setTheme] = useState("Carbon");
  const [mounted, setMounted] = useState(false);
  const themes = ["Ink", "Skyline", "Ivory", "Carbon"];
  const menuRef = useRef<HTMLUListElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Animación de entrada al abrir el menú
  const animateIn = () => {
    const buttons = menuRef.current?.querySelectorAll("button");
    if (buttons) {
      gsap.fromTo(
        buttons,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }

    // Animación de rotación del icono
    gsap.fromTo(
      iconRef.current,
      { rotate: 0 },
      {
        rotate: 360,
        duration: 0.6,
        ease: "back.out(1.7)",
      }
    );
  };

  useEffect(() => {
    if (!menuRef.current) return;
    const buttons = menuRef.current.querySelectorAll("button");

    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.1,
          backgroundColor: "#0ea5e9", // sky-500
          color: "#ffffff",
          boxShadow: "0 0 10px rgba(14, 165, 233, 0.6)",
          duration: 0.2,
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          backgroundColor: "transparent",
          color: "var(--text-base-content)", // slate-300
          boxShadow: "none",
          duration: 0.2,
        });
      });
    });
  }, [mounted]);

  if (!mounted) return <ThemeControllerSkeleton />;

  return (
    <div className=" dropdown dropdown-bottom dropdown-hover">
      <div
        tabIndex={0}
        role="button"
        className="glare-card btn m-1 gap-2 bg-slate-800 text-base-content border border-slate-600 hover:bg-slate-700 transition-all"
        onClick={animateIn}
      >
        <div ref={iconRef}>
          {theme.includes("Dark") ? (
            <FiMoon className="text-sky-400" size={20} />
          ) : (
            <FiSun className="text-yellow-400" size={20} />
          )}
        </div>

        <IoIosArrowDown className="inline-block h-2 w-2 opacity-60 text-white " />
      </div>

      <ul
        ref={menuRef}
        className="dropdown-content menu p-2 shadow-2xl rounded-box bg-primary/50 backdrop-blur-sm"
        style={{ width: "fit-content", minWidth: "2rem" }}
      >
        {themes.map((t) => (
          <li key={t}>
            <button
              onClick={() => setTheme(t)}
              className={`btn btn-sm btn-ghost justify-start text-left w-full px-2 text-sm transition-all ${
                theme === t ? "btn-active " : ""
              }`}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeController;
