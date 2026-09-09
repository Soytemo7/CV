import {
  useNavigate,
  useParams
} from "react-router-dom";

import AdminLessons
  from "../../components/admin/courses/AdminLessons.jsx";


const AdminLessonsPage = () => {

  const {
    courseId,
    moduleId
  } = useParams();

  const navigate =
    useNavigate();


  return (
    <div className="admin-users-page">

      <header className="admin-users-header">

        <button
          type="button"
          className="admin-users-view-button"
          onClick={() =>
            navigate(
              `/admin/courses/${encodeURIComponent(courseId)}/content`
            )
          }
        >

          <i
            className="bi bi-arrow-left"
            aria-hidden="true"
          ></i>

          Volver al contenido del curso

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

            <i className="bi bi-list-ul"></i>

          </div>


          <div>

            <h1>
              Lecciones
            </h1>

            <p>
              Contenido académico del módulo
            </p>

          </div>

        </div>

      </header>


      <AdminLessons
        courseId={courseId}
        moduleId={moduleId}
      />

    </div>
  );

};


export default AdminLessonsPage;