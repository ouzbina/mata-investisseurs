"use server";

import { redirect } from "next/navigation";
import { deleteAdminSession, verifyAdminSession } from "@/lib/session";

export async function logout() {
  await deleteAdminSession();
  redirect("/admin/login");
}

export async function requireAdmin() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}
