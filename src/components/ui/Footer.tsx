import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content py-6 mt-10 border-t border-base-300">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {currentYear} <strong>Shop</strong>. Todos los derechos
          reservados.
        </p>

        <div className="mt-2">
          <Link href="#" className="link link-hover text-sm">
            Ubicación
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
