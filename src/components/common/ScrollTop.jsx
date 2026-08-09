import { useEffect, useState } from "react";

function ScrollTop({ isDark }) {

  const [active, setActive] = useState(false);

  useEffect(() => {

    const toggleScrollTop = () => {
      setActive(window.scrollY > 100);
    };

    window.addEventListener(
      "scroll",
      toggleScrollTop
    );

    toggleScrollTop();

    return () => {
      window.removeEventListener(
        "scroll",
        toggleScrollTop
      );
    };

  }, []);

  const scrollToTop = (e) => {

    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  return (
    <a
      href="#"
      id="scroll-top"
      className={`scroll-top futuristic-control ${
        isDark ? "dark" : "light"
      } ${active ? "active" : ""}`}
      onClick={scrollToTop}
      aria-label="Volver al inicio"
    >
      <span className="futuristic-control-icon">
        <i className="bi bi-arrow-up"></i>
      </span>
    </a>
  );
}

export default ScrollTop;