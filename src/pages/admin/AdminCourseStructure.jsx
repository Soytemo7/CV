/* ============================================================
   ADMIN COURSE STRUCTURE
   Vista integral de la estructura académica.
   ============================================================ */

import {
  useEffect,
  useState,
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getAdminCourses
} from "../../services/admin/courseService.js";

import {
  getModulesByCourse
} from "../../services/admin/moduleService.js";

import {
  getLessonsByModule
} from "../../services/admin/lessonService.js";

import {
  getVideoByLesson
} from "../../services/admin/videoService.js";

import NotificationContext
  from "../../context/NotificationContext.jsx";

import "../../styles/admin/admin-users.css";
import "../../styles/admin/admin-courses.css";
import "../../styles/admin/admin-courses2.css";
import "../../styles/animated-border.css";
import "../../styles/privateIconButton.css";


function AdminCourseStructure() {

  const navigate =
    useNavigate();

      const notification =
    useContext(NotificationContext);

  /* ============================================================
     ESTADO
     ============================================================ */

  const [courses, setCourses] =
    useState([]);

  const [selectedCourseId, setSelectedCourseId] =
    useState("");

  const [structure, setStructure] =
    useState(null);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingStructure, setLoadingStructure] =
    useState(false);

  const [error, setError] =
    useState("");


  /* ============================================================
     CARGAR CURSOS
     ============================================================ */

  const loadCourses = async () => {

    try {

      setLoadingCourses(true);
      setError("");

      const response =
        await getAdminCourses();

      const data =
        Array.isArray(response)
          ? response
          : response?.courses ||
            response?.data ||
            [];

      setCourses(data);

    } catch (err) {

      console.error(
        "Error obteniendo cursos:",
        err
      );

      setError(
        err.message ||
        "No fue posible obtener los cursos."
      );

    } finally {

      setLoadingCourses(false);

    }

  };


  /* ============================================================
     CARGA INICIAL
     ============================================================ */

  useEffect(() => {

    loadCourses();

  }, []);


  /* ============================================================
     CARGAR ESTRUCTURA
     ============================================================ */

  useEffect(() => {

    if (!selectedCourseId) {

      setStructure(null);

      return;

    }


    const loadStructure = async () => {

      try {

        setLoadingStructure(true);
        setError("");
        setStructure(null);


        /* ======================================================
           CURSO
           ====================================================== */

        const course =
          courses.find(
            (item) =>
              String(item.id) ===
              String(selectedCourseId)
          );


        if (!course) {

          throw new Error(
            "No se encontró el curso seleccionado."
          );

        }


        /* ======================================================
           MÓDULOS
           ====================================================== */

        const modulesResponse =
          await getModulesByCourse(
            selectedCourseId
          );


        const modules =
          Array.isArray(modulesResponse)
            ? modulesResponse
            : modulesResponse?.modules ||
              modulesResponse?.data ||
              [];


        const orderedModules =
          [...modules].sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );


        /* ======================================================
           LECCIONES
           ====================================================== */

        const modulesWithLessons =
          await Promise.all(

            orderedModules.map(
              async (module) => {

                const lessonsResponse =
                  await getLessonsByModule(
                    module.id
                  );


                const lessons =
                  Array.isArray(lessonsResponse)
                    ? lessonsResponse
                    : lessonsResponse?.lessons ||
                      lessonsResponse?.data ||
                      [];


                const orderedLessons =
                  [...lessons].sort(
                    (a, b) =>
                      (a.order ?? 0) -
                      (b.order ?? 0)
                  );


                /* ==================================================
                   VIDEOS
                   ================================================== */

                const lessonsWithVideos =
                  await Promise.all(

                    orderedLessons.map(
                      async (lesson) => {

                        try {

                          const videoResponse =
                            await getVideoByLesson(
                              lesson.id
                            );


                          return {

                            ...lesson,

                            video:
                              videoResponse?.video ||
                              null

                          };

                        } catch (videoError) {

                          console.error(
                            `Error obteniendo video de la lección ${lesson.id}:`,
                            videoError
                          );

                          return {

                            ...lesson,

                            video: null

                          };

                        }

                      }
                    )

                  );


                return {

                  ...module,

                  lessons:
                    lessonsWithVideos

                };

              }
            )

          );


        /* ======================================================
           ESTRUCTURA FINAL
           ====================================================== */

        setStructure({

          ...course,

          modules:
            modulesWithLessons

        });

        notification?.success({
            title:
                "¡Estructura cargada!",

            description:
                `La estructura de "${course.title}" se cargó correctamente.`,

            placement:
                "topRight",

            duration:
                8,

            showProgress:
                true,

            pauseOnHover:
                true,

            closable:
                true,

            className:
                "welcome-notification",
            });


      } catch (err) {

        console.error(
          "Error obteniendo estructura del curso:",
          err
        );

        setError(
          err.message ||
          "No fue posible cargar la estructura del curso."
        );

      } finally {

        setLoadingStructure(false);

      }

    };


    loadStructure();

  }, [
    selectedCourseId,
    courses
  ]);


  /* ============================================================
     SELECCIONAR CURSO
     ============================================================ */

  const handleCourseChange =
    (event) => {

      setSelectedCourseId(
        event.target.value
      );

    };


  /* ============================================================
     CONTADORES
     ============================================================ */

  const totalLessons =
    structure
      ? structure.modules.reduce(
          (total, module) =>
            total +
            module.lessons.length,
          0
        )
      : 0;


  const totalVideos =
    structure
      ? structure.modules.reduce(
          (total, module) =>
            total +
            module.lessons.filter(
              (lesson) =>
                Boolean(
                  lesson.video
                )
            ).length,
          0
        )
      : 0;


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <div className="admin-users-page">

      {/* ========================================================
          ENCABEZADO
          ======================================================== */}

        <header className="private-page-header">

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


        <span className="private-page-eyebrow">
          Administración académica
        </span>

        <h1>
          Estructura de cursos
        </h1>

        <p>
          Consulta en una sola vista la estructura
          completa del contenido académico.
        </p>

      </header>


      {/* ========================================================
          SELECTOR
          ======================================================== */}

      <section
        className="
          admin-users-panel
          animated-border
          admin-course-structure-selector
        "
      >

        <div className="admin-course-structure-selector-header">

          <div
            className="
              private-icon-button
              private-icon-button-blue
              admin-course-structure-selector-icon
            "
            aria-hidden="true"
          >

            <i className="bi bi-diagram-3"></i>

          </div>


          <div>

            <span>
              SELECCIÓN DE CURSO
            </span>

            <h2>
              Consulta la estructura académica
            </h2>

          </div>

        </div>


        <div className="admin-course-structure-select-container">

          <label
            htmlFor="course-structure-select"
          >
            Curso académico
          </label>


          <div className="admin-course-structure-select-wrapper">

            <select
              id="course-structure-select"
              className="admin-course-structure-select"
              value={selectedCourseId}
              onChange={
                handleCourseChange
              }
              disabled={
                loadingCourses
              }
            >

              <option value="">

                {loadingCourses
                  ? "Cargando cursos..."
                  : courses.length === 0
                    ? "No hay cursos disponibles"
                    : "Selecciona un curso"}

              </option>


              {courses.map(
                (course) => (

                  <option
                    key={course.id}
                    value={course.id}
                  >

                    {course.title ||
                      "Sin título"}

                  </option>

                )
              )}

            </select>


            <i
              className="
                bi bi-chevron-down
                admin-course-structure-select-arrow
              "
              aria-hidden="true"
            ></i>

          </div>

        </div>

      </section>


      {/* ========================================================
          ERROR
          ======================================================== */}

      {error && (

        <div
          className="
            admin-promotion-modal-warning
            admin-course-structure-error
          "
        >

          <i
            className="bi bi-exclamation-triangle"
            aria-hidden="true"
          ></i>

          <div>

            <strong>
              Ocurrió un problema
            </strong>

            <span>
              {error}
            </span>

          </div>

        </div>

      )}


      {/* ========================================================
          CARGANDO
          ======================================================== */}

      {loadingStructure && (

        <section
          className="
            admin-users-panel
            animated-border
            admin-course-structure-loading
          "
        >

          <div className="admin-course-structure-loading-content">

            <div
              className="
                private-icon-button
                private-icon-button-blue
                admin-course-structure-loading-icon
              "
              aria-hidden="true"
            >

              <i className="bi bi-diagram-3"></i>

            </div>


            <h3>
              Construyendo estructura
            </h3>

            <p>
              Obteniendo módulos, lecciones y videos...
            </p>

            <div className="admin-course-structure-loading-line">
              <span></span>
            </div>

          </div>

        </section>

      )}


      {/* ========================================================
          ESTRUCTURA
          ======================================================== */}

      {structure &&
        !loadingStructure && (

          <section
            className="
              admin-users-panel
              animated-border
              admin-course-structure
            "
          >

            {/* ==================================================
                CABECERA DEL CURSO
                ================================================== */}

            <div className="admin-course-structure-course">

              <div
                className="
                  private-icon-button
                  private-icon-button-blue
                  admin-course-structure-course-icon
                "
                aria-hidden="true"
              >

                <i className="bi bi-mortarboard"></i>

              </div>


              <div className="admin-course-structure-course-info">

                <span>
                  CURSO ACADÉMICO
                </span>

                <h2>
                  {structure.title ||
                    "Sin título"}
                </h2>

                {structure.description && (

                  <p>
                    {structure.description}
                  </p>

                )}

              </div>

            </div>


            {/* ==================================================
                RESUMEN
                ================================================== */}

            <div className="admin-course-structure-summary">

              <div className="admin-course-structure-summary-item">

                <div
                  className="
                    private-icon-button
                    private-icon-button-blue
                    admin-course-structure-summary-icon
                  "
                  aria-hidden="true"
                >

                  <i className="bi bi-collection"></i>

                </div>

                <div>

                  <strong>
                    {structure.modules.length}
                  </strong>

                  <span>
                    {structure.modules.length === 1
                      ? "Módulo"
                      : "Módulos"}
                  </span>

                </div>

              </div>


              <div className="admin-course-structure-summary-item">

                <div
                  className="
                    private-icon-button
                    private-icon-button-blue
                    admin-course-structure-summary-icon
                  "
                  aria-hidden="true"
                >

                  <i className="bi bi-list-ul"></i>

                </div>

                <div>

                  <strong>
                    {totalLessons}
                  </strong>

                  <span>
                    {totalLessons === 1
                      ? "Lección"
                      : "Lecciones"}
                  </span>

                </div>

              </div>


              <div className="admin-course-structure-summary-item">

                <div
                  className="
                    private-icon-button
                    private-icon-button-blue
                    admin-course-structure-summary-icon
                  "
                  aria-hidden="true"
                >

                  <i className="bi bi-play-circle"></i>

                </div>

                <div>

                  <strong>
                    {totalVideos}
                  </strong>

                  <span>
                    {totalVideos === 1
                      ? "Video"
                      : "Videos"}
                  </span>

                </div>

              </div>

            </div>


            {/* ==================================================
                SIN MÓDULOS
                ================================================== */}

            {structure.modules.length === 0 ? (

              <div className="admin-course-structure-empty">

                <div
                  className="
                    private-icon-button
                    private-icon-button-blue
                    admin-course-structure-empty-icon
                  "
                  aria-hidden="true"
                >

                  <i className="bi bi-collection"></i>

                </div>

                <h3>
                  Sin módulos
                </h3>

                <p>
                  Este curso todavía no tiene
                  módulos registrados.
                </p>

              </div>

            ) : (

              /* ==================================================
                 MÓDULOS
                 ================================================== */

              <div className="admin-course-structure-modules">

                {structure.modules.map(
                  (
                    module,
                    moduleIndex
                  ) => (

                    <article
                      key={module.id}
                      className="
                        admin-course-structure-module
                      "
                    >

                      {/* ========================================
                          MÓDULO
                          ======================================== */}

                      <div className="admin-course-structure-module-header">

                        <div
                          className="
                            private-icon-button
                            private-icon-button-blue
                            admin-course-structure-module-number
                          "
                          aria-hidden="true"
                        >

                          <span>
                            {String(
                              moduleIndex + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                        </div>


                        <div className="admin-course-structure-module-info">

                          <span className="admin-course-structure-module-label">
                            MÓDULO {moduleIndex + 1}
                          </span>

                          <h3>
                            {module.title ||
                              "Sin título"}
                          </h3>

                          {module.description && (

                            <p>
                              {module.description}
                            </p>

                          )}

                        </div>


                        <div className="admin-course-structure-module-count">

                          <i
                            className="bi bi-list-ul"
                            aria-hidden="true"
                          ></i>

                          <strong>
                            {module.lessons.length}
                          </strong>

                          <span>
                            {module.lessons.length === 1
                              ? "lección"
                              : "lecciones"}
                          </span>

                        </div>

                      </div>


                      {/* ========================================
                          LECCIONES
                          ======================================== */}

                      <div className="admin-course-structure-lessons">

                        {module.lessons.length === 0 ? (

                          <div className="admin-course-structure-no-lessons">

                            <i
                              className="bi bi-info-circle"
                              aria-hidden="true"
                            ></i>

                            <span>
                              Este módulo no tiene
                              lecciones registradas.
                            </span>

                          </div>

                        ) : (

                          module.lessons.map(
                            (
                              lesson,
                              lessonIndex
                            ) => (

                              <article
                                key={lesson.id}
                                className="
                                  admin-course-structure-lesson
                                "
                              >

                                <div
                                  className="
                                    private-icon-button
                                    private-icon-button-blue
                                    admin-course-structure-lesson-marker
                                  "
                                  aria-hidden="true"
                                >

                                  <span>
                                    {String(
                                      lessonIndex + 1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                                  </span>

                                </div>


                                <div className="admin-course-structure-lesson-content">

                                  {/* ==================================
                                      CABECERA LECCIÓN
                                      ================================== */}

                                  <div className="admin-course-structure-lesson-header">

                                    <div>

                                      <span className="admin-course-structure-lesson-label">
                                        LECCIÓN {lessonIndex + 1}
                                      </span>

                                      <h4>
                                        {lesson.title ||
                                          "Sin título"}
                                      </h4>

                                    </div>


                                    {lesson.video && (

                                      <span
                                        className="
                                          admin-course-structure-video-status
                                        "
                                      >

                                        <i
                                          className="bi bi-check-circle-fill"
                                          aria-hidden="true"
                                        ></i>

                                        Video disponible

                                      </span>

                                    )}

                                  </div>


                                  {/* ==================================
                                      DESCRIPCIÓN
                                      ================================== */}

                                  {lesson.description && (

                                    <p className="admin-course-structure-lesson-description">
                                      {lesson.description}
                                    </p>

                                  )}


                                  {/* ==================================
                                      VIDEO
                                      ================================== */}

                                  {lesson.video ? (

                                    <div className="admin-course-structure-video">

                                      <div
                                        className="
                                          private-icon-button
                                          private-icon-button-blue
                                          admin-course-structure-video-icon
                                        "
                                        aria-hidden="true"
                                      >

                                        <i className="bi bi-play-fill"></i>

                                      </div>


                                      <div className="admin-course-structure-video-content">

                                        <span className="admin-course-structure-video-label">
                                          CONTENIDO MULTIMEDIA
                                        </span>

                                        <h5>
                                          {lesson.video.title ||
                                            "Sin título"}
                                        </h5>


                                        {lesson.video.description && (

                                          <p>
                                            {
                                              lesson
                                                .video
                                                .description
                                            }
                                          </p>

                                        )}


                                        <div className="admin-course-structure-video-meta">

                                          {lesson.video.providerVideoId && (

                                            <span className="admin-course-structure-video-meta-item">

                                              <i
                                                className="bi bi-youtube"
                                                aria-hidden="true"
                                              ></i>

                                              <span>
                                                YouTube
                                              </span>

                                              <code>
                                                {
                                                  lesson
                                                    .video
                                                    .providerVideoId
                                                }
                                              </code>

                                            </span>

                                          )}


                                          {lesson.video.durationSeconds !==
                                            undefined &&
                                            lesson.video.durationSeconds !==
                                              null && (

                                            <span className="admin-course-structure-video-meta-item">

                                              <i
                                                className="bi bi-clock"
                                                aria-hidden="true"
                                              ></i>

                                              <span>
                                                Duración
                                              </span>

                                              <strong>
                                                {
                                                  lesson
                                                    .video
                                                    .durationSeconds
                                                }{" "}
                                                s
                                              </strong>

                                            </span>

                                          )}

                                        </div>

                                      </div>

                                    </div>

                                  ) : (

                                    <div className="admin-course-structure-no-video">

                                      <i
                                        className="bi bi-play-circle"
                                        aria-hidden="true"
                                      ></i>

                                      <span>
                                        Esta lección no tiene
                                        contenido multimedia
                                        registrado.
                                      </span>

                                    </div>

                                  )}

                                </div>

                              </article>

                            )
                          )

                        )}

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        )}

    </div>

  );

}


export default AdminCourseStructure;

