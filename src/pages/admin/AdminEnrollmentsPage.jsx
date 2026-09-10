import {
  useNavigate
} from "react-router-dom";

import AdminEnrollments
  from "../../components/admin/enrollments/AdminEnrollments.jsx";


const AdminEnrollmentsPage = () => {

  const navigate =
    useNavigate();


  return (

    <div className="admin-users-page">

      <header className="admin-users-header">

        <button
          type="button"
          className="admin-users-view-button"
          onClick={() =>
            navigate("/admin")
          }
        >

          <i
            className="bi bi-arrow-left"
            aria-hidden="true"
          ></i>

          Volver al panel

        </button>


        <div className="admin-users-title">

          <div
            className="
              admin-users-title-icon
              private-icon-button
              private-icon-button-blue
            "
            aria-hidden="true"
          >

            <i className="bi bi-person-check"></i>

          </div>


          <div>

            <h1>
              Inscripciones
            </h1>

            <p>
              Gestión y seguimiento académico de alumnos inscritos
            </p>

          </div>

        </div>

      </header>


      <AdminEnrollments />

    </div>

  );

};


export default AdminEnrollmentsPage;