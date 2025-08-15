"use client";
import Image from "next/image";
import React from "react";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    createdAt?: string;
    emailVerified?: boolean | null;
  };
}

const UserProfileCard = ({ user }: Props) => {
  ///https://i.pravatar.cc/150?img=3
  return (
    <div className="card bg-base-100 shadow-md rounded-xl p-6 text-base-content w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar o inicial */}

        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <Image
              src={
                user.image
                  ? user.image
                  : `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(
                      user.name
                    )}`
              }
              width={150}
              height={150}
              className="rounded-full"
              draggable={false}
              priority
              alt={user.name}
            />
          </div>
        </div>

        {/* Información */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">{user.name}</h2>
          <p className="text-sm">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-sm">
            <strong>Rol:</strong>{" "}
            <span className="badge badge-outline badge-primary">
              {user.role}
            </span>
          </p>
          <p className="text-sm">
            <strong>Verificado:</strong>{" "}
            {user.emailVerified ? (
              <span className="badge badge-success">Sí</span>
            ) : (
              <span className="badge badge-warning">No</span>
            )}
          </p>
          <p className="text-sm">
            <strong>Registrado:</strong> {user.createdAt ? user.createdAt : "—"}
          </p>
          <p className="text-sm">
            <strong>ID:</strong>{" "}
            <code className="text-xs break-all">{user.id}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
