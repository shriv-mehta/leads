import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLeadsList } from "../../features/leads/useLeadsList";
import LeadFilters from "../../features/leads/LeadFilters";
import LeadTable from "../../features/leads/LeadTable";
import * as areaApi from "../../api/endpoints/areaApi";
import * as leadApi from "../../api/endpoints/leadApi";
import { downloadBlob } from "../../utils/downloadFile";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useToast } from "../../hooks/useToast";
import { useEmployees } from "../../hooks/useEmployees";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

const AllLeadsPage = () => {
  const [searchParams] = useSearchParams();
  const { leads, pagination, page, setPage, filters, updateFilters, isLoading, error, refetch } =
    useLeadsList({
      owner_id: searchParams.get("owner_id") || "",
      area: searchParams.get("area") || "",
    });
  const [areas, setAreas] = useState([]);
  const employees = useEmployees();
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    areaApi.getAreas().then(({ data }) => setAreas(data.areas)).catch(() => {});
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await leadApi.downloadLeadsCsv(filters);
      downloadBlob(blob, "leads-export.csv");
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't export leads."), "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">All Leads</h1>
        <Button label="Export CSV" variant="secondary" onClick={handleExport} disabled={isExporting} />
      </div>

      <LeadFilters filters={filters} onChange={updateFilters} employees={employees} areaSuggestions={areas} />

      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}
      {!isLoading && !error && leads.length === 0 && (
        <EmptyState title="No leads match these filters" />
      )}
      {!isLoading && !error && leads.length > 0 && (
        <>
          <LeadTable leads={leads} showOwner />
          <Pagination page={page} totalPages={pagination?.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
};

export default AllLeadsPage;
