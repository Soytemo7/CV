import "../../styles/animated-border.css";

function AnimatedBorder({
  children,
  className = "",
  duration = "6s",
}) {
  return (
    <div
      className={`animated-border ${className}`}
      style={{
        "--animated-border-duration": duration,
      }}
    >
      {children}
    </div>
  );
}

export default AnimatedBorder;