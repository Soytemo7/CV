import "../../styles/button.css";

function AppButton({
  children,
  color = "blue",
  icon,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {

  const buttonClassName = [
    "app-button",
    `app-button-${color}`,
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
    >

      {icon && (
        <i className={icon}></i>
      )}

      <span>
        {children}
      </span>

    </button>

  );

}

export default AppButton;