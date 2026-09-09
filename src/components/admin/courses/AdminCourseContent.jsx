import { useEffect, useState } from "react";

import {
  getAdminCourses
} from "../../../services/admin/courseService.js";

import AdminModules from "./AdminModules.jsx";

import "../../../styles/admin/admin-users.css";
import "../../../styles/admin/admin-courses.css";
import "../../../styles/animated-border.css";
import "../../../styles/privateIconButton.css";


const AdminCourseContent = ({
  courseId,
  onBack
}) => {

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================================
  // CARGAR CURSO
  // ==========================================================

  useEffect(() => {

    const loadCourse = async () => {

      if (!courseId) {

        setError(
          "courseId es obligatorio."
        );

        setLoading(false);

        return;
      }


      setLoading(true);
      setError("");


      try {

        const data =
          await getAdminCourses();


        /*
         * getAdminCourses() devuelve la colección
         * de cursos administrativos.
         *
         * Buscamos el curso correspondiente al
         * parámetro recibido en la URL.
         */

        const courses =
          Array.isArray(data)
            ? data
            : data?.courses ||
              data?.data ||
              [];


        const foundCourse =
          courses.find(
            (item) =>
              String(item?.id) ===
              String(courseId)
          );


        if (!foundCourse) {

          throw new Error(
            "Curso no encontrado."
          );

        }


        setCourse(foundCourse);

      } catch (err) {

        setError(
          err.message ||
          "No se pudo cargar el curso."
        );

      } finally {

        setLoading(false);

      }

    };


    loadCourse();

  }, [courseId]);


  // ==========================================================
  // CARGANDO
  // ==========================================================

  if (loading) {

    return (
      <main className="admin-users-page">

        <div className="admin-users-loading">

          <i
            className="bi bi-hourglass-split"
            aria-hidden="true"
          ></i>

          Cargando curso...

        </div>

      </main>
    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !course) {

    return (
      <main className="admin-users-page">

        <div
          className="admin-users-error"
          role="alert"
        >

          <i
            className="bi bi-exclamation-triangle"
            aria-hidden="true"
          ></i>

          {error || "Curso no encontrado."}

        </div>


        <button
          type="button"
          className="admin-promotion-cancel-button"
          onClick={onBack}
        >

          <i
            className="bi bi-arrow-left"
            aria-hidden="true"
          ></i>

          Volver a cursos

        </button>

      </main>
    );

  }


  // ==========================================================
  // CONTENIDO
  // ==========================================================

  return (
    <main className="admin-users-page">


      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <header className="admin-users-header">

        <button
          type="button"
          className="admin-users-view-button"
          onClick={onBack}
        >

          <i
            className="bi bi-arrow-left"
            aria-hidden="true"
          ></i>

          Volver a cursos

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

            <i className="bi bi-journal-bookmark"></i>

          </div>


          <div>

            <h1>
              {course.title}
            </h1>

            <p>
              Contenido académico
            </p>

          </div>

        </div>

      </header>


      {/* ======================================================
          INFORMACIÓN DEL CURSO
          ====================================================== */}

      <section
        className="
          admin-users-panel
          animated-border
        "
      >

        <div className="admin-courses-content-header">

          <div>

            <span className="admin-courses-results-count">

              <i
                className="bi bi-mortarboard"
                aria-hidden="true"
              ></i>

              <span>
                Estructura académica
              </span>

            </span>


            <p>
              Administra los módulos que forman
              parte de este curso.
            </p>

          </div>

        </div>


        {/* ====================================================
            MÓDULOS
            ==================================================== */}

        <AdminModules
          courseId={courseId}
        />

      </section>

    </main>
  );

};


export default AdminCourseContent;

