import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeadsList } from "../../features/leads/useLeadsList";
import LeadFilters from "../../features/leads/LeadFilters";
import LeadTable from "../../features/leads/LeadTable";
import * as areaApi from "../../api/endpoints/areaApi";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

const MyLeadsPage = () => {
  const { leads, pagination, page, setPage, filters, updateFilters, isLoading, error, refetch } =
    useLeadsList();
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    areaApi.getAreas().then(({ data }) => setAreas(data.areas)).catch(() => {});
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">My Leads</h1>
        <Button label="Add Lead" onClick={() => navigate("/leads/new")} />
      </div>

      <LeadFilters filters={filters} onChange={updateFilters} areaSuggestions={areas} />

      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}
      {!isLoading && !error && leads.length === 0 && (
        <EmptyState
          title="No leads yet"
          message="Log your first visit to get started."
          action={<Button label="Add Lead" onClick={() => navigate("/leads/new")} />}
        />
      )}
      {!isLoading && !error && leads.length > 0 && (
        <>
          <LeadTable leads={leads} />
          <Pagination page={page} totalPages={pagination?.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
};

export default MyLeadsPage;
