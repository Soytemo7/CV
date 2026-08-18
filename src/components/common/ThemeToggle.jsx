function ThemeToggle({ isDark, setIsDark }) {

  const toggleTheme = () => {

    const newTheme = !isDark;

    setIsDark(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );

    window.dispatchEvent(
      new Event("themechange")
    );

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

        {isDark
          ? "DARK"
          : "LIGHT"
        }

      </span>

    </button>
  );
}

export default ThemeToggle;