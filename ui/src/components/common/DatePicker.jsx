// Thin wrapper around the native date input — gives every platform its own
// familiar picker UI for free, which matters most on a phone.
const DatePicker = ({ label, error, hint, id, ...rest }) => {
  const inputId = id || rest.name;

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="date"
        className={`input ${error ? "input--error" : ""}`}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}
      {!error && hint && <span className="field__hint">{hint}</span>}
    </div>
  );
};

export default DatePicker;
