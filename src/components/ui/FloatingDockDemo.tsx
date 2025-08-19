import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { GrRestroomMen, GrRestroomWomen } from "react-icons/gr";
import { IoSearchOutline } from "react-icons/io5";

export function FloatingDockDemo() {
  const links = [
    {
      title: "men",
      icon: (
        <GrRestroomMen className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/gender/men",
    },

    {
      title: "women",
      icon: (
        <GrRestroomWomen className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/gender/women",
    },
    {
      title: "Search",
      icon: (
        <IoSearchOutline className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/search",
    },
  ];
  return (
    <div className="flex items-center justify-center h-[2rem] w-full">
      <FloatingDock
        mobileClassName="translate-y-0" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}
