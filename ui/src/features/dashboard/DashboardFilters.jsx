import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import DatePicker from "../../components/common/DatePicker";
import { STATUS_OPTIONS, CHANCE_OPTIONS } from "../../utils/constants";

// Shared across dashboard KPIs, employee performance, and area performance —
// all three admin views filter on the same shape: date range, employee,
// area, status, business chance.
const DashboardFilters = ({ filters, onChange, employees = [] }) => {
  const handle = (key) => (event) => onChange({ [key]: event.target.value });

  return (
    <div className="filter-bar">
      <DatePicker name="from" value={filters.from} onChange={handle("from")} aria-label="From date" />
      <DatePicker name="to" value={filters.to} onChange={handle("to")} aria-label="To date" />
      <Select
        name="employee_id"
        placeholder="All employees"
        options={employees.map((e) => ({ value: e.id, label: e.name }))}
        value={filters.employee_id}
        onChange={handle("employee_id")}
      />
      <Input name="area" placeholder="Area" value={filters.area} onChange={handle("area")} />
      <Select name="status" placeholder="All statuses" options={STATUS_OPTIONS} value={filters.status} onChange={handle("status")} />
      <Select name="chance" placeholder="All chances" options={CHANCE_OPTIONS} value={filters.chance} onChange={handle("chance")} />
    </div>
  );
};

export default DashboardFilters;
