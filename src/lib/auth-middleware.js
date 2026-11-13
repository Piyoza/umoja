import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware({
  type: "function",
});

export const base44RequestMiddleware = createMiddleware({
  type: "request",
});

export const requireUser = createMiddleware({
  type: "function",
});

export const requireUserRoute = createMiddleware({
  type: "request",
});