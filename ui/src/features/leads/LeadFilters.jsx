import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import DatePicker from "../../components/common/DatePicker";
import { STATUS_OPTIONS, CHANCE_OPTIONS } from "../../utils/constants";

const LeadFilters = ({ filters, onChange, employees, areaSuggestions = [] }) => {
  const handle = (key) => (event) => onChange({ [key]: event.target.value });

  return (
    <div className="filter-bar">
      <Input name="q" label="Search" value={filters.q} onChange={handle("q")} />
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
      <Input
        name="area"
        label="Area"
        list="area-suggestions"
        value={filters.area}
        onChange={handle("area")}
      />
      <datalist id="area-suggestions">
        {areaSuggestions.map((area) => (
          <option key={area} value={area} />
        ))}
      </datalist>
      {employees && (
        <Select
          name="owner_id"
          label="Employee"
          placeholder="All employees"
          options={employees.map((e) => ({ value: e.id, label: e.name }))}
          value={filters.owner_id}
          onChange={handle("owner_id")}
        />
      )}
      <DatePicker name="from" label="From" value={filters.from} onChange={handle("from")} />
      <DatePicker name="to" label="To" value={filters.to} onChange={handle("to")} />
    </div>
  );
};

export default LeadFilters;
