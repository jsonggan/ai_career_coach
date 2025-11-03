import { redirect, RedirectType } from 'next/navigation'

export default function Home() {
  redirect("/personal-growth/career-vision", RedirectType.replace);
}
