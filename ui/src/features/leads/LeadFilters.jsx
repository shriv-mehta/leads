import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import DatePicker from "../../components/common/DatePicker";
import { STATUS_OPTIONS, CHANCE_OPTIONS } from "../../utils/constants";

const LeadFilters = ({ filters, onChange, employees, areaSuggestions = [] }) => {
  const handle = (key) => (event) => onChange({ [key]: event.target.value });

  return (
    <div className="filter-bar">
      <Input
        name="q"
        placeholder="Search name or company"
        value={filters.q}
        onChange={handle("q")}
        aria-label="Search leads"
      />
      <Select
        name="status"
        placeholder="All statuses"
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={handle("status")}
        aria-label="Filter by status"
      />
      <Select
        name="chance"
        placeholder="All chances"
        options={CHANCE_OPTIONS}
        value={filters.chance}
        onChange={handle("chance")}
        aria-label="Filter by business chance"
      />
      <Input
        name="area"
        list="area-suggestions"
        placeholder="Area"
        value={filters.area}
        onChange={handle("area")}
        aria-label="Filter by area"
      />
      <datalist id="area-suggestions">
        {areaSuggestions.map((area) => (
          <option key={area} value={area} />
        ))}
      </datalist>
      {employees && (
        <Select
          name="owner_id"
          placeholder="All employees"
          options={employees.map((e) => ({ value: e.id, label: e.name }))}
          value={filters.owner_id}
          onChange={handle("owner_id")}
          aria-label="Filter by employee"
        />
      )}
      <DatePicker name="from" value={filters.from} onChange={handle("from")} aria-label="From date" />
      <DatePicker name="to" value={filters.to} onChange={handle("to")} aria-label="To date" />
    </div>
  );
};

export default LeadFilters;
