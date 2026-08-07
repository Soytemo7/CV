import { useState } from "react";

function HeaderToggle() {

  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    const header = document.querySelector("#header");

    header.classList.toggle("header-show");

    setOpen(!open);
  };

  return (
    <i
      className={`header-toggle d-xl-none bi ${open ? "bi-x" : "bi-list"}`}
      onClick={toggleMenu}
    ></i>
  );
}

export default HeaderToggle;