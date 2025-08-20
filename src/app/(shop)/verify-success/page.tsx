export default function VerifySuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ Correo verificado
      </h1>
      <p className="mt-4 text-gray-700">
        Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.
      </p>
      <a
        href="/auth/login"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Ir al login
      </a>
    </div>
  );
}
