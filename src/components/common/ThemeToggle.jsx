function ThemeToggle({ isDark, setIsDark }) {

  const toggleTheme = () => {
    setIsDark(!isDark);
  };


  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? "dark" : "light"}`}
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
    >

      <span className="theme-toggle-icon">
        <i
          className={`bi ${
            isDark
              ? "bi-moon-stars-fill"
              : "bi-sun-fill"
          }`}
        ></i>
      </span>

      <span className="theme-toggle-label">
        {isDark ? "DARK" : "LIGHT"}
      </span>

    </button>
  );
}

export default ThemeToggle;