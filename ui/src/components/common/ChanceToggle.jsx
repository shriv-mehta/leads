import { CHANCE_OPTIONS } from "../../utils/constants";

const ChanceToggle = ({ value, onChange, label = "Business chance" }) => (
  <div className="field">
    <span className="field__label">{label}</span>
    <div className="chance-toggle">
      {CHANCE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="chance-toggle__btn"
          data-chance={option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

export default ChanceToggle;
