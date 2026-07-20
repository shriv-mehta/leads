import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as dashboardApi from "../../api/endpoints/dashboardApi";
import DashboardFilters from "../../features/dashboard/DashboardFilters";
import { useEmployees } from "../../hooks/useEmployees";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { getErrorMessage } from "../../utils/getErrorMessage";

const DEFAULT_FILTERS = { from: "", to: "", employee_id: "", area: "", status: "", chance: "" };

const AreaPerformancePage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [areas, setAreas] = useState(null);
  const [error, setError] = useState(null);
  const employees = useEmployees();
  const navigate = useNavigate();

  const fetchData = () => {
    setError(null);
    dashboardApi
      .getAreaPerformance(filters)
      .then(({ data }) => setAreas(data))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load area performance.")));
  };

  useEffect(fetchData, [filters]);

  const columns = [
    { key: "area", label: "Area" },
    { key: "leadCount", label: "Leads" },
    { key: "convertedCount", label: "Converted" },
    { key: "conversionPct", label: "Conversion %", render: (r) => `${r.conversionPct}%` },
    { key: "activeReps", label: "Active Reps" },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Area Performance</h1>
      </div>

      <DashboardFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} employees={employees} />

      {error && <ErrorState message={error} onRetry={fetchData} />}
      {!error && !areas && <Loader />}
      {!error && areas?.length === 0 && <EmptyState title="No area activity in this range" />}
      {!error && areas?.length > 0 && (
        <Table
          columns={columns}
          rows={areas}
          keyField="area"
          onRowClick={(row) => navigate(`/admin/leads?area=${encodeURIComponent(row.area)}`)}
        />
      )}
    </div>
  );
};

export default AreaPerformancePage;
