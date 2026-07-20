const Card = ({ title, action, children, className = "" }) => (
  <div className={`card ${className}`}>
    {(title || action) && (
      <div className="card__header">
        {title && <h3 className="card__title">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);

export default Card;
