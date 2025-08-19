"use client";

import { generatePagination } from "@/utils/generatePaginationsNumbers";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  totalPages: number | string;
}

const Pagination = ({ totalPages }: Props) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentPage =
    Number(searchParams.get("page") ? searchParams.get("page") : 1) ?? 1;
  const allpages = generatePagination(currentPage, +totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber === "...") return `${pathName}?${params.toString()}`;
    if (+pageNumber <= 0) return pathName;
    if (+pageNumber > +totalPages) return `${pathName}?${params.toString()}`;

    params.set("page", `${pageNumber}`);
    return `${pathName}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center mt-6">
      <nav className="join">
        {/* Previous */}
        <Link
          href={createPageUrl(currentPage - 1)}
          className="join-item btn btn-md btn-circle btn-primary"
          aria-label="Página anterior"
        >
          ❮
        </Link>

        {/* Page buttons */}
        {allpages.map((page, index) => (
          <Link
            key={index}
            href={createPageUrl(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`join-item btn btn-md btn-circle ${
              +page === currentPage
                ? "btn-primary text-primary-content"
                : page === "..."
                ? "btn-disabled opacity-70"
                : "btn-outline"
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Next */}
        <Link
          href={createPageUrl(currentPage + 1)}
          className="join-item btn btn-md btn-circle btn-primary"
          aria-label="Página siguiente"
        >
          ❯
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;
