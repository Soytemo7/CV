import {
  useNavigate,
  useParams
} from "react-router-dom";

import AdminVideos
  from "../../components/admin/courses/AdminVideos.jsx";


const AdminVideoPage = () => {

  const {
    courseId,
    moduleId,
    lessonId
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
              `/admin/courses/${encodeURIComponent(courseId)}/content/module/${encodeURIComponent(moduleId)}/lessons`
            )
          }
        >

          <i
            className="bi bi-arrow-left"
            aria-hidden="true"
          ></i>

          Volver a lecciones

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

            <i className="bi bi-play-circle"></i>

          </div>


          <div>

            <h1>
              Video
            </h1>

            <p>
              Contenido multimedia de la lección
            </p>

          </div>

        </div>

      </header>


      <AdminVideos
        lessonId={lessonId}
      />

    </div>
  );

};


export default AdminVideoPage;