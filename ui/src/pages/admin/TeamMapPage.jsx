import { useEffect, useState } from "react";
import * as leadApi from "../../api/endpoints/leadApi";
import AreaPinMap from "../../features/map/AreaPinMap";
import Select from "../../components/common/Select";
import DatePicker from "../../components/common/DatePicker";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { STATUS_OPTIONS } from "../../utils/constants";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useEmployees } from "../../hooks/useEmployees";

const TeamMapPage = () => {
  const [filters, setFilters] = useState({ owner_id: "", status: "", from: "", to: "" });
  const employees = useEmployees();
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);

  const fetchMap = () => {
    setError(null);
    leadApi
      .getLeadMap(filters)
      .then(({ data }) => setGroups(data))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load the team map.")));
  };

  useEffect(fetchMap, [filters]);

  const handle = (key) => (event) => setFilters((prev) => ({ ...prev, [key]: event.target.value }));

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Team Map</h1>
      </div>

      <div className="filter-bar">
        <Select
          name="owner_id"
          placeholder="All employees"
          options={employees.map((e) => ({ value: e.id, label: e.name }))}
          value={filters.owner_id}
          onChange={handle("owner_id")}
        />
        <Select name="status" placeholder="All statuses" options={STATUS_OPTIONS} value={filters.status} onChange={handle("status")} />
        <DatePicker name="from" value={filters.from} onChange={handle("from")} aria-label="From date" />
        <DatePicker name="to" value={filters.to} onChange={handle("to")} aria-label="To date" />
      </div>

      {error && <ErrorState message={error} onRetry={fetchMap} />}
      {!error && !groups && <Loader />}
      {!error && groups && <AreaPinMap groups={groups} />}
    </div>
  );
};

export default TeamMapPage;
