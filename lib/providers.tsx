"use client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { handleNetworkError } from "./config/api-error";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        const errorMessage = handleNetworkError(error);
        toast.error(errorMessage);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        const errorMessage = handleNetworkError(error);
        toast.error(errorMessage);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
