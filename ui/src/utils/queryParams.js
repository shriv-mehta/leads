// Drops undefined/null/empty-string values so callers can pass a filters
// object straight through without hand-building a query string.
export const toQueryString = (params = {}) => {
  const clean = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  return new URLSearchParams(clean).toString();
};
