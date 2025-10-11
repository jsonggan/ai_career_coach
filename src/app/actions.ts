"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleSidebar(isCollapsed: boolean) {
  const cookieStore = cookies();
  
  cookieStore.set('sidebar-collapsed', String(isCollapsed), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    path: '/'
  });

  revalidatePath('/', 'layout');
}

export async function setUserMode(mode: 'student' | 'working-professional') {
  const cookieStore = cookies();
  
  cookieStore.set('user-mode', mode, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    path: '/'
  });

  revalidatePath('/', 'layout');
}
