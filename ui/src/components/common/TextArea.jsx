const TextArea = ({ label, error, hint, id, ...rest }) => {
  const areaId = id || rest.name;

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={areaId}>
          {label}
        </label>
      )}
      <textarea id={areaId} className={`textarea ${error ? "textarea--error" : ""}`} {...rest} />
      {error && <span className="field__error">{error}</span>}
      {!error && hint && <span className="field__hint">{hint}</span>}
    </div>
  );
};

export default TextArea;
