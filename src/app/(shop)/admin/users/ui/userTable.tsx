"use client";

import { changeUserRole } from "@/actions/user/change-user-role";
import { UserInterface } from "@/interfaces/userInterface";
import Image from "next/image";
import React from "react";

interface Props {
  users: UserInterface[];
}

const UserTable = ({ users }: Props) => {
  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-base-content">
        <p>No hay usuarios disponibles.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-base-100 min-h-screen text-base-content">
      <div className="max-w-7xl mx-auto bg-base-200 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl font-bold mb-4">
            Administración de Usuarios
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-base-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Avatar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">
                    Cambiar Rol
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-base-300 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          user.image
                            ? user.image
                            : `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(
                                user.name
                              )}`
                        }
                        alt={user.name || "Avatar"}
                        width={40}
                        height={40}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-sm opacity-70">{user.email}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">{user.role}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`badge ${
                          user.emailVerified ? "badge-success" : "badge-warning"
                        } badge-sm`}
                      >
                        {user.emailVerified ? "Verificado" : "No Verificado"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <select
                        onChange={(e) =>
                          changeUserRole(
                            user.id,
                            e.target.value as "ADMIN" | "USER"
                          )
                        }
                        value={user.role}
                        className="select select-sm select-bordered bg-base-100"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
