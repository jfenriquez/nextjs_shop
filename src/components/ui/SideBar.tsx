"use client";

import { useUIStore } from "@/store/ui-store";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SideBar() {
  const isOpen = useUIStore((s) => s.isSideMenuOpen);
  const closeMenu = useUIStore((s) => s.closeSideMenu);
  const { data: session, status } = useSession();
  const isAuth = status === "authenticated";
  const userRole = session?.user?.role || null;
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      router.refresh();
    }
  }, [status, router]);

  const handleLogout = async () => {
    closeMenu();
    await signOut({ redirect: false });
    router.refresh();
    router.push("/");
  };

  const items = [
    {
      label: "Perfil",
      href: "/profile",
      icon: <IoPersonOutline size={24} />,
      private: true,
    },
    {
      label: "Ingresar",
      href: "/auth/login",
      icon: <IoLogInOutline size={24} />,
      publicOnly: true,
    },
    {
      label: "Registro",
      href: "/auth/new-account",
      icon: <IoLogInOutline size={24} />,
      publicOnly: true,
    },
    {
      label: "Salir",
      onClick: handleLogout,
      icon: <IoLogOutOutline size={24} />,
      private: true,
    },
    { separator: true },

    {
      label: "Órdenes",
      href: "/orders",
      icon: <IoTicketOutline size={24} />,
      private: true,
      roles: ["USER"],
    },
    {
      label: "Productos (Admin)",
      href: "/admin/products",
      icon: <IoShirtOutline size={24} />,
      roles: ["ADMIN"],
    },
    {
      label: "Órdenes (Admin)",
      href: "/admin/orders",
      icon: <IoTicketOutline size={24} />,
      private: true,
      roles: ["ADMIN"],
    },
    {
      label: "Usuarios",
      href: "/admin/users",
      icon: <IoPeopleOutline size={24} />,
      private: true,
      roles: ["ADMIN"],
    },
  ];

  const visible = items.filter((i) => {
    if (i.private && !isAuth) return false;
    if (i.publicOnly && isAuth) return false;
    if (i.roles && (!userRole || !i.roles.includes(userRole))) return false;
    return true;
  });

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={closeMenu}
          />
          <nav
            className={clsx(
              "fixed top-0 right-0 h-full w-80 p-5 bg-base-100 shadow-lg z-20 transform transition-transform duration-300",
              { "translate-x-full": !isOpen }
            )}
          >
            {/* Close Icon */}
            <button
              onClick={closeMenu}
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
            >
              <IoCloseOutline size={24} />
            </button>

            {/* Search Bar */}
            <div className="relative mt-14">
              <label className="input input-bordered flex items-center gap-2">
                <IoSearchOutline />
                <input type="text" className="grow" placeholder="Buscar..." />
              </label>
            </div>

            {/* Menu Items */}
            <ul className="mt-6 space-y-2">
              {visible.map((it, i) =>
                it.separator ? (
                  <li key={i}>
                    <div className="divider my-4" />
                  </li>
                ) : it.href ? (
                  <li key={i}>
                    <Link
                      href={it.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-all"
                    >
                      {it.icon}
                      <span className="text-base font-medium">{it.label}</span>
                    </Link>
                  </li>
                ) : (
                  <li key={i}>
                    <button
                      onClick={it.onClick}
                      className="flex items-center gap-3 p-3 w-full text-left rounded-lg hover:bg-base-200 transition-all"
                    >
                      {it.icon}
                      <span className="text-base font-medium">{it.label}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
