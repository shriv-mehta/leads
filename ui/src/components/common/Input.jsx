const Input = ({ label, error, hint, id, ...rest }) => {
  const inputId = id || rest.name;

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={`input ${error ? "input--error" : ""}`} {...rest} />
      {error && <span className="field__error">{error}</span>}
      {!error && hint && <span className="field__hint">{hint}</span>}
    </div>
  );
};

export default Input;
