import { isNotFound, isRedirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

// Redirects and not-found responses are normal application control flow.
const isControlFlow = (error) =>
  error instanceof Response ||
  isRedirect(error) ||
  isNotFound(error);

// Handles errors from server functions.
export const errorCaptureFunctionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (!isControlFlow(error)) {
      console.error("Server function error:", error);
    }

    throw error;
  }
});

// Handles errors from server requests.
export const errorCaptureRequestMiddleware = createMiddleware({
  type: "request",
}).server(async ({ next, request, handlerType }) => {
  let result;

  try {
    result = await next();
  } catch (error) {
    if (handlerType !== "serverFn" && !isControlFlow(error)) {
      console.error("Request error:", request.url, error);
    }

    throw error;
  }

  if (handlerType !== "serverFn" && result.status >= 500) {
    console.error("Server returned an error response:", {
      url: request.url,
      status: result.status,
    });
  }

  return result;
});