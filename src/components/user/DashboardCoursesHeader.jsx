import {
  useNavigate
} from "react-router-dom";


function DashboardCoursesHeader() {

  const navigate =
    useNavigate();


  return (

    <header className="dashboard-courses-header">

      <div className="dashboard-courses-header-main">

        <span className="private-page-eyebrow">
          Área académica
        </span>


        <h1>
          Cursos académicos
        </h1>


        <p>
          Explora los cursos disponibles y continúa
          con tu formación académica.
        </p>

      </div>


      <div className="dashboard-courses-header-action">

        <button
          type="button"
          className="user-dashboard-secondary-button"
          onClick={() => navigate("/dashboard")}
        >

          <i
            className="bi bi-arrow-left"
            aria-hidden="true"
          ></i>


          <span>
            Volver al dashboard
          </span>

        </button>

      </div>

    </header>

  );

}


export default DashboardCoursesHeader;