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
      <i
        className={`header-toggle d-xl-none bi ${
          open ? "bi-x" : "bi-list"
        }`}
        onClick={toggleMenu}
      >
      </i>


      <button
        type="button"
        className={`theme-toggle ${
          isDark ? "dark" : "light"
        }`}
        onClick={toggleTheme}
        aria-label={
          isDark
            ? "Cambiar a modo claro"
            : "Cambiar a modo oscuro"
        }
      >

        <i
          className={`bi ${
            isDark
              ? "bi-sun-fill"
              : "bi-moon-stars-fill"
          }`}
        >
        </i>

      </button>
    </>
  );
}

export default HeaderToggle;