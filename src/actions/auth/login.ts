"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn } from "@/auth";
import { getUserByPhone } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";

export const login = async (
  values: z.infer<typeof LoginSchema>,
): Promise<{ error?: string } | undefined> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { phone, password } = validatedFields.data;

  const existingUser = await getUserByPhone(phone);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "С таким номером телефона нет пользователей" };
  }

  try {
    await signIn("credentials", {
      phone,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Неверный пароль" };
        default:
          return { error: "Ошибка сервера" };
      }
    }
    throw error;
  }
};
