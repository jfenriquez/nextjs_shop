import Image from "next/image";
import Link from "next/link";

export const PageNotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[94vh] w-full justify-center items-center bg-base-100 text-base-content px-4 sm:px-10">
      {/* Texto */}
      <div className="text-center md:text-left px-5 max-w-md">
        <h2 className="text-7xl sm:text-9xl font-bold text-primary">404</h2>
        <p className="mt-4 text-xl font-semibold">Whoops! Lo sentimos mucho.</p>
        <p className="text-base font-light mt-2">
          Puedes regresar al{" "}
          <Link
            href="/"
            className="link link-primary font-medium hover:underline"
          >
            inicio
          </Link>
        </p>
      </div>

      {/* Imagen */}
      <div className="max-w-sm sm:max-w-md lg:max-w-lg flex justify-center items-center">
        <Image
          src="/imgs/starman_750x750.png"
          alt="Starman"
          width={450}
          height={450}
          className="p-5 sm:p-0"
          priority
        />
      </div>
    </div>
  );
};
