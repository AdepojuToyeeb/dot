import { AxiosError } from "axios";

export const handleNetworkError = (error: AxiosError | Error): string => {
  if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
    const { status, data } = (error as AxiosError).response!;
    const serverMessage =
      (data as { error?: string; message?: string })?.error ||
      (data as { error?: string; message?: string })?.message;

    // Utility to map status codes to default messages
    const getCustomMessage = (status: number): string => {
      const messages: Record<number, string> = {
        400: "Invalid request",
        401: "Authentication required",
        403: "You do not have permission to access this resource",
        404: "Resource not found",
        422: "Validation error",
        429: "Too many requests - please try again later",
        500: "Internal server error",
      };
      return messages[status] || "An unexpected error occurred";
    };

    // Return serverMessage if available, or a custom message based on status
    return serverMessage || getCustomMessage(status);
  }

  // Handle general network or other errors
  return error.message || "An unknown error occurred";
};
