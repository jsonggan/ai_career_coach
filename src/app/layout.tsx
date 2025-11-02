import type { Metadata } from "next";
import clsx from "clsx";
import Providers from "./providers";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "primeicons/primeicons.css";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pathly",
  description: "AI Career Coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" className="overflow-hidden" data-color-mode="light">
        <head>
          {/* <link id="theme-link" rel="stylesheet" href="/css/light-theme.css" /> */}
        </head>
        <body
          className={clsx(
            inter.className,
            "h-screen w-screen flex overflow-hidden"
          )}
        >
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </body>
      </html>
    </Providers>
  );
}
