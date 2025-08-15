import React from "react";
import UserTable from "./ui/userTable";
import { getPaginatedUsers } from "@/actions/user/get-paginated-users";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/auth/login");
  }
  const users = await getPaginatedUsers();
  console.log("Users fetched:", users);
  if (!users.ok) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Error al cargar los usuarios
            </h2>
            <p className="text-gray-600">{users.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserTable users={users.users ?? []} />
    </div>
  );
}
