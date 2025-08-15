"use client";
import React, { useState, useRef } from "react";
import { productSearch } from "@/actions/product/product-search";
import { Product } from "@/interfaces/product.interface";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const searchStyles = [
  "rounded-xl border-2 border-blue-400 focus:ring-2 focus:ring-blue-300",
  "rounded-full border-2 border-green-400 focus:ring-2 focus:ring-green-300 shadow-lg",
  "rounded-md border-2 border-purple-400 focus:ring-2 focus:ring-purple-300",
  "rounded-lg border-2 border-pink-400 focus:ring-2 focus:ring-pink-300",
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [styleIdx, setStyleIdx] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleStyleChange = () => {
    setStyleIdx((prev) => (prev + 1) % searchStyles.length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (value.trim().length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }
      try {
        const res = await productSearch(value);
        setResults(res.products);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col justify-center items-center px-4">
      {/* Botón de volver animado */}
      <motion.button
        whileHover={{ scale: 1.08, rotate: -8 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{ position: "absolute", left: 24, top: 24, zIndex: 50 }}
        title="Volver"
      >
        <IoArrowBackCircleOutline size={32} className="drop-shadow" />
        <span className="hidden sm:inline-block">Volver</span>
      </motion.button>

      <h1 className="text-3xl font-extrabold mb-6 text-base-content drop-shadow-lg">
        Buscador
      </h1>

      <div className="relative w-full max-w-xl">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Buscar productos..."
          className={`w-full py-3 px-5 text-lg transition-all duration-300 outline-none ${searchStyles[styleIdx]}`}
        />
        <button
          onClick={handleStyleChange}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow"
          title="Cambiar estilo"
          type="button"
        >
          🎨
        </button>
      </div>

      {loading && (
        <div className="w-full text-center text-base-content animate-pulse mt-4">
          Buscando...
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <h2 className="font-bold text-xl text-base-content mt-10 mb-4 self-start">
            Resultados:
          </h2>
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
            {results.map((product) => (
              <div
                key={product.id}
                className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300 rounded-xl overflow-hidden group"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="block relative w-full"
                >
                  <Image
                    src={`${product.images[0]}`}
                    alt={product.title}
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="p-4 text-base-content">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-medium text-md hover:text-primary transition-colors line-clamp-2"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-1 text-lg font-bold">${product.price}</p>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {!loading && query && results.length === 0 && (
        <div className="w-full text-center text-gray-400 mt-6">
          No se encontraron resultados.
        </div>
      )}
    </div>
  );
};

export default SearchPage;
