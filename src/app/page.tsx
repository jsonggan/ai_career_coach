import { redirect, RedirectType } from 'next/navigation'

export default function Home() {
  redirect("/students/acedemy-track", RedirectType.replace);
}
