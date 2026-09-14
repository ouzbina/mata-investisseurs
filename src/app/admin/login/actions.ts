"use server";

import { redirect } from "next/navigation";
import { createAdminSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Configuration serveur manquante (ADMIN_PASSWORD)." };
  }

  if (typeof password !== "string" || password !== adminPassword) {
    return { error: "Mot de passe incorrect." };
  }

  await createAdminSession();
  redirect("/admin");
}
