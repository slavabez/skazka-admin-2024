"use client";

import React from "react";

import UserMetaUpdateForm from "@/app/(protected)/admin/users/_components/user-meta-update-section";
import UserUpdateForm from "@/app/(protected)/admin/users/_components/user-update-form";
import { IUserMeta, UserSelectNonSensitive } from "@/lib/common-types";
import { formatRelativeDate } from "@/lib/utils";

interface UserUpdateFormProps {
  userData: UserSelectNonSensitive;
}

const UserForm = ({ userData }: UserUpdateFormProps) => {
  const userMeta = userData.meta as IUserMeta;
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[600px] mx-auto">
      <UserUpdateForm userData={userData} />
      <UserMetaUpdateForm initialUserMeta={userMeta} />
      <div className="gap-4 flex flex-col">
        <p>Создан: {formatRelativeDate(userData.createdAt)}</p>
        <p>Обновлен: {formatRelativeDate(userData.updatedAt)}</p>
      </div>
    </div>
  );
};

export default UserForm;
