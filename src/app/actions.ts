"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleSidebar(isCollapsed: boolean) {
  const cookieStore = cookies();
  
  // Set cookie with 30 days expiration
  cookieStore.set('sidebar-collapsed', String(isCollapsed), {
    httpOnly: false, // Allow client-side access if needed
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    path: '/'
  });

  // Revalidate all paths to trigger re-render with new cookie value
  revalidatePath('/', 'layout');
}
