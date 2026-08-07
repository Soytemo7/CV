import { useEffect, useState } from "react";

function ScrollTop() {

  const [active, setActive] = useState(false);

  useEffect(() => {

    const toggleScrollTop = () => {
      setActive(window.scrollY > 100);
    };

    window.addEventListener("scroll", toggleScrollTop);

    toggleScrollTop();

    return () => {
      window.removeEventListener("scroll", toggleScrollTop);
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
      className={`scroll-top d-flex align-items-center justify-content-center ${
        active ? "active" : ""
      }`}
      onClick={scrollToTop}
    >
      <i className="bi bi-arrow-up-short"></i>
    </a>
  );
}

export default ScrollTop;