const EmptyState = ({ icon = "📭", title = "Nothing here yet", message, action }) => (
  <div className="empty-state">
    <span className="empty-state__icon">{icon}</span>
    <span className="empty-state__title">{title}</span>
    {message && <p>{message}</p>}
    {action}
  </div>
);

export default EmptyState;
