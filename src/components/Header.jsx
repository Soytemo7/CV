import HeaderToggle from "./common/HeaderToggle";
import useActiveSection from "../hooks/useActiveSection";


function Header() {


  const sections = [
    "hero",
    "about",
    "skills",
    "resume",
    "academic",
    "services",
    "books",
    "contact"
  ];


  const activeSection = useActiveSection(sections);



  return (
    <header
      id="header"
      className="header d-flex flex-column justify-content-center"
    >

      <HeaderToggle />


      <nav id="navmenu" className="navmenu">

        <ul>


          <li>
            <a
              href="#hero"
              className={activeSection === "hero" ? "active" : ""}
            >
              <i className="bi bi-house navicon"></i>
              <span>Home</span>
            </a>
          </li>



          <li>
            <a
              href="#about"
              className={activeSection === "about" ? "active" : ""}
            >
              <i className="bi bi-person navicon"></i>
              <span>About</span>
            </a>
          </li>



          <li>
            <a
              href="#skills"
              className={activeSection === "skills" ? "active" : ""}
            >
              <i className="bi bi-bar-chart"></i>
              <span>Skills</span>
            </a>
          </li>



          <li>
            <a
              href="#resume"
              className={activeSection === "resume" ? "active" : ""}
            >
              <i className="bi bi-file-earmark-text navicon"></i>
              <span>Resume</span>
            </a>
          </li>



          <li>
            <a
              href="#academic"
              className={activeSection === "academic" ? "active" : ""}
            >
              <i className="bi bi-mortarboard navicon"></i>
              <span>Academic</span>
            </a>
          </li>



          <li>
            <a
              href="#services"
              className={activeSection === "services" ? "active" : ""}
            >
              <i className="bi bi-hdd-stack navicon"></i>
              <span>Areas</span>
            </a>
          </li>



          <li>
            <a
              href="#books"
              className={activeSection === "books" ? "active" : ""}
            >
              <i className="bi bi-book navicon"></i>
              <span>Books</span>
            </a>
          </li>



          <li>
            <a
              href="#contact"
              className={activeSection === "contact" ? "active" : ""}
            >
              <i className="bi bi-envelope navicon"></i>
              <span>Contact</span>
            </a>
          </li>



        </ul>

      </nav>


    </header>
  );
}


export default Header;