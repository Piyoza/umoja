export function recordFunctionError(error, metadata = {}) {
  console.error("Server function error:", {
    error,
    metadata,
  });
}

export function recordRequestError(request, error) {
  console.error("Server request error:", {
    url: request?.url,
    error,
  });
}

export function recordErrorResponse(request, response) {
  if (response && response.status >= 500) {
    console.error("Server response error:", {
      url: request?.url,
      status: response.status,
    });
  }
}