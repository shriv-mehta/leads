import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as dashboardApi from "../../api/endpoints/dashboardApi";
import DashboardFilters from "../../features/dashboard/DashboardFilters";
import { useEmployees } from "../../hooks/useEmployees";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { formatDateTime } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/getErrorMessage";

const DEFAULT_FILTERS = { from: "", to: "", employee_id: "", area: "", status: "", chance: "" };

const EmployeePerformancePage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const employees = useEmployees();
  const navigate = useNavigate();

  const fetchData = () => {
    setError(null);
    dashboardApi
      .getEmployeePerformance(filters)
      .then(({ data }) => setRows(data))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load employee performance.")));
  };

  useEffect(fetchData, [filters]);

  const columns = [
    { key: "name", label: "Employee" },
    { key: "leadsMtd", label: "Leads MTD" },
    { key: "leadsYtd", label: "Leads YTD" },
    { key: "convertedMtd", label: "Converted MTD" },
    { key: "convertedYtd", label: "Converted YTD" },
    { key: "conversionPct", label: "Conversion %", render: (r) => `${r.conversionPct}%` },
    { key: "lastActivity", label: "Last Activity", render: (r) => formatDateTime(r.lastActivity) },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Employee Performance</h1>
      </div>

      <DashboardFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} employees={employees} />

      {error && <ErrorState message={error} onRetry={fetchData} />}
      {!error && !rows && <Loader />}
      {!error && rows?.length === 0 && <EmptyState title="No employees yet" />}
      {!error && rows?.length > 0 && (
        <Table
          columns={columns}
          rows={rows}
          keyField="id"
          onRowClick={(row) => navigate(`/admin/leads?owner_id=${row.id}`)}
        />
      )}
    </div>
  );
};

export default EmployeePerformancePage;
