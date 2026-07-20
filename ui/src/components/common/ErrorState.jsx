import Button from "./Button";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="error-state">
    <span className="empty-state__icon">⚠️</span>
    <p>{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" label="Retry" onClick={onRetry} />
    )}
  </div>
);

export default ErrorState;
