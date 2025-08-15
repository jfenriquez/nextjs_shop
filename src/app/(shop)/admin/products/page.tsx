"use client ";
import { getPaginatedProductsWithImages } from "@/actions/product/product-pagination";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Pagination from "../../../../components/ui/Pagination";
import {
  FiImage,
  FiTag,
  FiDollarSign,
  FiInfo,
  FiUsers,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth.config";
import { deleteProduct } from "@/actions/product/delete-product";
import { ToastItem } from "@/components/ui/ClientToastHandler";
import { ToastContainer } from "react-toastify";
import BtnDelete from "./ui/BtnDelete";

export const metadata: Metadata = {
  title: "Administración de Productos",
};

interface Props {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams, params }: Props) {
  await params;
  const { page } = await searchParams;
  const pageNumber = page ? Number(page) : 1;

  const { currentPage, products, totalPages } =
    await getPaginatedProductsWithImages({ page: pageNumber });

  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className="p-4 sm:p-6 bg-base-100 min-h-screen text-base-content">
      <ToastContainer></ToastContainer>
      <div className="max-w-7xl mx-auto bg-base-200 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">
            Administración de Productos
          </h2>

          <Link href="/admin/product/new">
            <button className="btn btn-primary mb-4 transition">
              Crear Producto
            </button>
          </Link>

          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full table-auto border border-base-300">
              <thead className="bg-base-300 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <FiImage /> Imagen
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <FiTag /> Nombre / Tallas
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <FiDollarSign /> Precio
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <FiInfo /> Descripción
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <FiUsers /> Género
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1">
                      <FiCheckCircle /> Stock
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-base-300">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-base-300 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          product.images?.[0]
                            ? `${product.images[0]}`
                            : "https://i.pravatar.cc/100?img=1"
                        }
                        alt={product.title}
                        width={40}
                        height={40}
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{product.title}</div>
                      <div className="text-xs opacity-70">
                        {product.sizes.join(", ")}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {product.description?.substring(0, 50) ||
                        "Sin descripción"}
                    </td>

                    <td className="px-4 py-4 text-sm capitalize">
                      {product.gender}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`badge badge-sm ${
                          product.inStock > 0 ? "badge-success" : "badge-error"
                        }`}
                      >
                        {product.inStock}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/product/${product.slug}`}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        <FiEdit className="mr-1" />
                        Editar
                      </Link>
                      <BtnDelete productId={product.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
