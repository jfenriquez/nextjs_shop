import { auth } from "@/auth.config";
import { Title } from "@/components/ui/Title";
import { redirect } from "next/navigation";
import React from "react";
import UserProfileCard from "./ui/UserProfileCard";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="px-4 py-8">
      <Title title="Perfil" />
      <UserProfileCard user={session.user} />
    </div>
  );
};

export default ProfilePage;
