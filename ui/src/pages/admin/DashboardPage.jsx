import { useEffect, useState } from "react";
import * as dashboardApi from "../../api/endpoints/dashboardApi";
import DashboardFilters from "../../features/dashboard/DashboardFilters";
import KpiCards from "../../features/dashboard/KpiCards";
import TrendsCharts from "../../features/dashboard/TrendsCharts";
import EmployeeLeadsChart from "../../features/dashboard/EmployeeLeadsChart";
import { useEmployees } from "../../hooks/useEmployees";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { getErrorMessage } from "../../utils/getErrorMessage";

const DEFAULT_FILTERS = { from: "", to: "", employee_id: "", area: "", status: "", chance: "" };

const DashboardPage = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState(null);
  const [employeePerf, setEmployeePerf] = useState(null);
  const [error, setError] = useState(null);
  const employees = useEmployees();

  const fetchAll = () => {
    setError(null);
    Promise.all([
      dashboardApi.getKpis(filters),
      dashboardApi.getTrends(filters),
      dashboardApi.getEmployeePerformance(filters),
    ])
      .then(([kpiRes, trendsRes, empRes]) => {
        setKpis(kpiRes.data);
        setTrends(trendsRes.data);
        setEmployeePerf(empRes.data);
      })
      .catch((err) => setError(getErrorMessage(err, "Couldn't load the dashboard.")));
  };

  useEffect(fetchAll, [filters]);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Dashboard</h1>
      </div>

      <DashboardFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} employees={employees} />

      {error && <ErrorState message={error} onRetry={fetchAll} />}
      {!error && !kpis && <Loader />}
      {!error && kpis && (
        <>
          <KpiCards kpis={kpis} />
          <TrendsCharts trends={trends} />
          <EmployeeLeadsChart employees={employeePerf} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
