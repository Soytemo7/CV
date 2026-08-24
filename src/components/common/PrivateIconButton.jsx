import "../../styles/privateIconButton.css";

function PrivateIconButton({
  children,
  color = "blue",
  icon,
  type = "button",
  disabled = false,
  onClick,
  onPointerDown,
  className = "",
}) {

  const buttonClassName = [
    "private-icon-button",
    `private-icon-button-${color}`,
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (

    <button
      type={type}
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={onPointerDown}
    >

      {icon && (
        <i className={icon}></i>
      )}

      {children && (
        <span className="private-icon-button-label">
          {children}
        </span>
      )}

    </button>

  );

}

export default PrivateIconButton;