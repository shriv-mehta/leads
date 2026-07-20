import { useCallback, useEffect, useState } from "react";
import * as leadApi from "../../api/endpoints/leadApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

const DEFAULT_FILTERS = { status: "", chance: "", area: "", q: "", owner_id: "", from: "", to: "" };

export const useLeadsList = (initialFilters = {}) => {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
  const [page, setPage] = useState(1);
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination: pageInfo } = await leadApi.getLeads({ ...filters, page, limit: 25 });
      setLeads(data);
      setPagination(pageInfo);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load leads."));
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilters = (patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return { leads, pagination, page, setPage, filters, updateFilters, isLoading, error, refetch: fetchLeads };
};
