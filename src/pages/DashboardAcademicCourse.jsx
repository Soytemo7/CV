import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import DashboardAcademicCourseModule
  from "../components/user/DashboardAcademicCourseModule.jsx";

import DashboardAcademicCourseExam
  from "../components/user/DashboardAcademicCourseExam.jsx";

import {
  getAcademicCourse,
  getAcademicCourseEnrollment,
  getAcademicCourseProgress,
  getAcademicCourseExam
} from "../services/user/academicCourseService.js";

import {
  useNotification
} from "../hooks/useNotification.js";

import "../styles/animated-border.css";
import "../styles/privateIconButton.css";
import "../styles/user/dashboard.css";
import "../styles/user/dashboardAcademicCourse.css";


function DashboardAcademicCourse() {

  const {
    courseId
  } = useParams();


  const navigate =
    useNavigate();


  const notification =
    useNotification();


  const [
    course,
    setCourse
  ] = useState(null);


  const [
    enrollment,
    setEnrollment
  ] = useState(null);


  const [
    progress,
    setProgress
  ] = useState([]);


  const [
    exam,
    setExam
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    examLoading,
    setExamLoading
  ] = useState(false);


  /* ============================================================
     CARGAR INFORMACIÓN DEL CURSO
     ============================================================ */

  const loadCourse =
    useCallback(
      async () => {

        if (!courseId) {

          setError(
            "No se recibió el identificador del curso."
          );

          setLoading(false);

          return;

        }


        try {

          setLoading(true);

          setError("");


          const [
            courseResponse,
            enrollmentResponse,
            progressResponse,
            examResponse
          ] = await Promise.all([

            getAcademicCourse(
              courseId
            ),

            getAcademicCourseEnrollment(
              courseId
            ),

            getAcademicCourseProgress(
              courseId
            ),

            getAcademicCourseExam(
              courseId
            ).catch(
              error => {

                if (
                  error?.status === 404
                ) {

                  return null;

                }

                throw error;

              }
            )

          ]);


          const courseData =
            courseResponse?.course ||
            courseResponse?.data ||
            courseResponse;


          const enrollmentData =
            enrollmentResponse?.enrollment ||
            enrollmentResponse?.data ||
            enrollmentResponse;


          const progressData =
            progressResponse?.progress ||
            progressResponse?.data ||
            progressResponse;


          const examData =
            examResponse?.exam ||
            examResponse?.data ||
            examResponse ||
            null;


          setCourse(
            courseData
          );


          setEnrollment(
            enrollmentData
          );


          setProgress(
            Array.isArray(
              progressData
            )
              ? progressData
              : []
          );


          setExam(
            examData
          );


        } catch (requestError) {

          console.error(
            "Error cargando curso académico:",
            requestError
          );


          setError(
            requestError?.message ||
            "No fue posible cargar el curso académico."
          );

        } finally {

          setLoading(false);

        }

      },
      [
        courseId
      ]
    );


  useEffect(
    () => {

      loadCourse();

    },
    [
      loadCourse
    ]
  );


  /* ============================================================
     MAPA DE PROGRESO
     ============================================================ */

  const progressMap =
    useMemo(
      () => {

        const map =
          new Map();


        progress.forEach(
          item => {

            const videoId =
              item?.videoId ||
              item?.video?.id;


            if (!videoId) {

              return;

            }


            map.set(
              videoId,
              item?.completed === true
            );

          }
        );


        return map;

      },
      [
        progress
      ]
    );


  /* ============================================================
     MÓDULOS ORDENADOS
     ============================================================ */

  const modules =
    useMemo(
      () => {

        return Array.isArray(
          course?.modules
        )
          ? [
              ...course.modules
            ].sort(
              (a, b) =>
                Number(a.order || 0) -
                Number(b.order || 0)
            )
          : [];

      },
      [
        course
      ]
    );


  /* ============================================================
     INFORMACIÓN GLOBAL
     ============================================================ */

  const allVideos =
    useMemo(
      () => {

        return modules.flatMap(
          module =>
            Array.isArray(
              module?.lessons
            )
              ? module.lessons.flatMap(
                  lesson =>
                    Array.isArray(
                      lesson?.videos
                    )
                      ? lesson.videos
                      : []
                )
              : []
        );

      },
      [
        modules
      ]
    );


  const completedVideos =
    allVideos.filter(
      video =>
        progressMap.get(
          video.id
        ) === true
    ).length;


  const totalVideos =
    allVideos.length;


  const courseProgress =
    totalVideos > 0
      ? Math.round(
          (
            completedVideos /
            totalVideos
          ) *
          100
        )
      : 0;


  const courseCompleted =
    totalVideos > 0 &&
    completedVideos === totalVideos;


  /* ============================================================
     ESTADO DE MÓDULOS
     ============================================================ */

  const moduleStates =
    useMemo(
      () => {

        let previousCompleted =
          true;


        return modules.map(
          (
            module,
            index
          ) => {

            const videos =
              Array.isArray(
                module?.lessons
              )
                ? module.lessons.flatMap(
                    lesson =>
                      Array.isArray(
                        lesson?.videos
                      )
                        ? lesson.videos
                        : []
                  )
                : [];


            const moduleCompleted =
              videos.length > 0 &&
              videos.every(
                video =>
                  progressMap.get(
                    video.id
                  ) === true
              );


            const unlocked =
              index === 0
                ? true
                : previousCompleted;


            previousCompleted =
              moduleCompleted;


            return {
              module,
              unlocked,
              completed:
                moduleCompleted
            };

          }
        );

      },
      [
        modules,
        progressMap
      ]
    );


  /* ============================================================
     EXAMEN DESBLOQUEADO
     ============================================================ */

  const examUnlocked =
    Boolean(exam) &&
    courseCompleted;


  /* ============================================================
     ABRIR LECCIÓN / VIDEO
     ============================================================ */

  const handleOpenLesson =
    (
      lessonId,
      videoId
    ) => {

      if (!lessonId) {

        return;

      }


      /*
       * El contenido existente de lección/video
       * ya maneja el reproductor académico.
       *
       * Si existe videoId lo enviamos como estado
       * para que la pantalla existente pueda
       * identificar el video seleccionado.
       */

      navigate(
        `/dashboard/academic/lessons/${lessonId}`,
        {
          state: {
            videoId
          }
        }
      );

    };


  /* ============================================================
     ABRIR EXAMEN
     ============================================================ */

  const handleOpenExam =
    async () => {

      if (!examUnlocked) {

        notification.warning({

          message:
            "Examen bloqueado",

          description:
            "Completa todos los videos del curso antes de presentar el examen."

        });

        return;

      }


      if (!exam?.id) {

        notification.error({

          message:
            "Examen no disponible",

          description:
            "No fue posible identificar el examen de este curso."

        });

        return;

      }


      try {

        setExamLoading(true);


        /*
         * El intento lo crea el backend.
         *
         * La pantalla de evaluación existente
         * recibirá el examId/attemptId mediante
         * navegación.
         *
         * El endpoint de inicio pertenece al
         * módulo Assessment.
         */

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/academic/assessment/exam/${exam.id}/attempt`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify({})
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.error ||
            "No fue posible iniciar el examen."
          );

        }


        const attempt =
          data?.attempt ||
          data?.data?.attempt ||
          data?.data ||
          null;


        if (!attempt?.id) {

          throw new Error(
            "El backend no devolvió el identificador del intento."
          );

        }


        navigate(
          `/dashboard/academic/assessment/${exam.id}`,
          {
            state: {
              exam,
              attemptId:
                attempt.id
            }
          }
        );


      } catch (requestError) {

        console.error(
          "Error iniciando examen:",
          requestError
        );


        notification.error({

          message:
            "No fue posible iniciar el examen",

          description:
            requestError?.message ||
            "Ocurrió un error al iniciar el examen."

        });

      } finally {

        setExamLoading(false);

      }

    };


  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {

    return (

      <main
        className="
          private-page-container
          academic-page
        "
      >

        <div
          className="
            academic-state-card
            animated-border
          "
        >

          <div className="academic-loading">

            <i className="bi bi-arrow-repeat" />

            <span>
              Cargando curso académico...
            </span>

          </div>

        </div>

      </main>

    );

  }


  /* ============================================================
     ERROR
     ============================================================ */

  if (
    error ||
    !course
  ) {

    return (

      <main
        className="
          private-page-container
          academic-page
        "
      >

        <div
          className="
            academic-state-card
            animated-border
          "
        >

          <div className="academic-empty">

            <div className="academic-empty-icon">

              <i
                className="bi bi-exclamation-triangle"
              />

            </div>

            <strong>
              No fue posible cargar el curso
            </strong>

            <span>
              {
                error ||
                "El curso solicitado no existe."
              }
            </span>

          </div>

        </div>


        <div className="academic-course-actions">

          <button
            type="button"
            className="academic-course-button"
            onClick={() =>
              navigate(
                "/dashboard/courses"
              )
            }
          >

            <i className="bi bi-arrow-left" />

            <span>
              Volver a cursos
            </span>

          </button>

        </div>

      </main>

    );

  }


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <main
      className="
        private-page-container
        academic-page
      "
    >

      {/* ========================================================
          ACCIONES
          ======================================================== */}

      <div className="academic-course-actions">

        <button
          type="button"
          className="academic-course-button"
          onClick={() =>
            navigate(
              "/dashboard/courses"
            )
          }
        >

          <i className="bi bi-arrow-left" />

          <span>
            Volver a cursos
          </span>

        </button>

      </div>


      {/* ========================================================
          CABECERA
          ======================================================== */}

      <header className="private-page-header">

        <span className="private-page-eyebrow">
          Área académica
        </span>

        <h1>
          {course.title}
        </h1>

        {course.description && (

          <p>
            {course.description}
          </p>

        )}

      </header>


      {/* ========================================================
          INFORMACIÓN DEL CURSO
          ======================================================== */}

      <section
        className="academic-courses-grid"
        aria-label="Información del curso"
      >

        {course.imageUrl && (

          <article
            className="
              academic-course-card
              academic-course-card-image
              animated-border
            "
          >

            <div className="academic-course-image">

              <img
                src={course.imageUrl}
                alt={`Imagen del curso ${course.title}`}
              />

            </div>

          </article>

        )}


        <article
          className="
            academic-course-card
            animated-border
          "
        >

          <div className="academic-course-icon">

            <i className="bi bi-mortarboard" />

          </div>


          <div className="academic-course-content">

            <h2 className="academic-course-title">
              Progreso académico
            </h2>

            <p className="academic-course-description">
              Avance general del curso.
            </p>


            <div className="academic-course-progress">

              <div className="academic-course-progress-header">

                <span>
                  {completedVideos} de{" "}
                  {totalVideos} videos
                </span>

                <strong>
                  {courseProgress}%
                </strong>

              </div>


              <div className="academic-course-progress-bar">

                <span
                  style={{
                    width:
                      `${courseProgress}%`
                  }}
                />

              </div>

            </div>

          </div>

        </article>

      </section>


      {/* ========================================================
          ESTADO DE INSCRIPCIÓN
          ======================================================== */}

      {!enrollment && (

        <section
          className="
            academic-state-card
            animated-border
          "
        >

          <div className="academic-empty">

            <div className="academic-empty-icon">

              <i className="bi bi-person-x" />

            </div>

            <strong>
              No estás inscrito en este curso
            </strong>

            <span>
              Debes inscribirte antes de acceder
              al contenido académico.
            </span>

          </div>

        </section>

      )}


      {/* ========================================================
          MÓDULOS
          ======================================================== */}

      {enrollment && (

        <section
          className="academic-modules"
          aria-label="Contenido del curso"
        >

          <header className="private-page-header">

            <span className="private-page-eyebrow">
              Contenido académico
            </span>

            <h2>
              Módulos del curso
            </h2>

            <p>
              Avanza de manera secuencial.
              Cada módulo se habilita cuando
              completas todos los videos del módulo anterior.
            </p>

          </header>


          {moduleStates.length === 0 ? (

            <div
              className="
                academic-state-card
                animated-border
              "
            >

              <div className="academic-empty">

                <div className="academic-empty-icon">

                  <i className="bi bi-journal-x" />

                </div>

                <strong>
                  Curso sin contenido
                </strong>

                <span>
                  Este curso todavía no tiene
                  módulos académicos.
                </span>

              </div>

            </div>

          ) : (

            <div className="academic-modules-list">

              {moduleStates.map(
                (
                  moduleState,
                  moduleIndex
                ) => (

                  <DashboardAcademicCourseModule
                    key={
                      moduleState.module.id
                    }
                    module={
                      moduleState.module
                    }
                    moduleIndex={
                      moduleIndex
                    }
                    unlocked={
                      moduleState.unlocked
                    }
                    completed={
                      moduleState.completed
                    }
                    progressMap={
                      progressMap
                    }
                    onOpenLesson={
                      handleOpenLesson
                    }
                  />

                )
              )}

            </div>

          )}

        </section>

      )}


      {/* ========================================================
          EXAMEN
          ======================================================== */}

      {enrollment && (

        <section
          className="academic-modules"
          aria-label="Evaluación final"
        >

          <header className="private-page-header">

            <span className="private-page-eyebrow">
              Evaluación
            </span>

            <h2>
              Examen final
            </h2>

            <p>
              El examen se habilita después de
              completar todos los videos del curso.
            </p>

          </header>


          <DashboardAcademicCourseExam
            exam={exam}
            unlocked={
              examUnlocked
            }
            loading={
              examLoading
            }
            onOpen={
              handleOpenExam
            }
          />

        </section>

      )}

    </main>

  );

}


export default DashboardAcademicCourse;