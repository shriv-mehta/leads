export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.message) return error.response.data.message;
  // No response at all means the request never completed — a down/unreachable
  // server, not a validation or auth failure. Saying "Invalid email or
  // password" here is actively misleading, so call it out distinctly.
  if (!error?.response) return "Can't reach the server. Check it's running and try again.";
  return fallback;
};
