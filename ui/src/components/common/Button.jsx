const Button = ({
  label,
  children,
  variant = "primary",
  size = "md",
  full = false,
  type = "button",
  disabled = false,
  onClick,
  ...rest
}) => {
  const classes = [
    "btn",
    `btn--${variant}`,
    size === "sm" ? "btn--sm" : "",
    full ? "btn--full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {children ?? label}
    </button>
  );
};

export default Button;
