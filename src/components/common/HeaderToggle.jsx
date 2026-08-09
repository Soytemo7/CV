import { useEffect, useState } from "react";

function HeaderToggle({ isDark, setIsDark }) {

  const [open, setOpen] = useState(false);

  useEffect(() => {

    const header = document.querySelector("#header");

    if (header) {
      header.classList.remove("header-show");
    }

    const timer = setTimeout(() => {
      setOpen(false);
    }, 0);

    return () => {
      clearTimeout(timer);
    };

  }, [isDark]);


  const toggleMenu = () => {

    const header = document.querySelector("#header");

    if (!header) return;

    const isCurrentlyOpen =
      header.classList.contains("header-show");

    if (isCurrentlyOpen) {

      header.classList.remove("header-show");

      setOpen(false);

    } else {

      header.classList.add("header-show");

      setOpen(true);

    }

  };


  const toggleTheme = () => {

    setIsDark(prev => !prev);

  };


  return (
    <>

      {/* Botón hamburguesa */}

      <i
        className={`header-toggle futuristic-control d-xl-none ${
          open ? "open" : ""
        }`}
        onClick={toggleMenu}
      >
        <span className="futuristic-control-icon">
          <i
            className={`bi ${
              open ? "bi-x" : "bi-list"
            }`}
          ></i>
        </span>
      </i>


      {/* Botón de tema */}

      <button
        type="button"
        className={`theme-toggle futuristic-control ${
          isDark ? "dark" : "light"
        }`}
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
                ? "bi-sun-fill"
                : "bi-moon-stars-fill"
            }`}
          ></i>
        </span>

      </button>

    </>
  );
}

export default HeaderToggle;