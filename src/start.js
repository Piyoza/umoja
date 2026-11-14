
import {
  createStart,
  createCsrfMiddleware,
} from "@tanstack/react-start";

import { authMiddleware } from "@/lib/auth-middleware";

import {
  errorCaptureFunctionMiddleware,
  errorCaptureRequestMiddleware,
} from "@/lib/error-capture";

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [
    csrfMiddleware,
    errorCaptureRequestMiddleware,
  ],

  functionMiddleware: [
    errorCaptureFunctionMiddleware,
    authMiddleware,
  ],
}));
