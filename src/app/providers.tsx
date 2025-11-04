"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmDialog } from "primereact/confirmdialog";
import { SessionProvider } from "next-auth/react";

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ConfirmDialog
          pt={{
            acceptButton: {
              root: {
                className: "p-button-sm",
              },
            },
            rejectButton: {
              root: {
                className: "p-button-sm",
              },
            },
            message: {
              className: "m-0 ",
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Providers;
