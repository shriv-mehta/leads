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
      <DatePicker name="from" label="From" value={filters.from} onChange={handle("from")} />
      <DatePicker name="to" label="To" value={filters.to} onChange={handle("to")} />
      <Select
        name="employee_id"
        label="Employee"
        placeholder="All employees"
        options={employees.map((e) => ({ value: e.id, label: e.name }))}
        value={filters.employee_id}
        onChange={handle("employee_id")}
      />
      <Input name="area" label="Area" value={filters.area} onChange={handle("area")} />
      <Select
        name="status"
        label="Status"
        placeholder="All statuses"
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={handle("status")}
      />
      <Select
        name="chance"
        label="Business Chance"
        placeholder="All chances"
        options={CHANCE_OPTIONS}
        value={filters.chance}
        onChange={handle("chance")}
      />
    </div>
  );
};

export default DashboardFilters;
