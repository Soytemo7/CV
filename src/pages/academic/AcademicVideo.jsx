import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import AcademicVideoPlayer
  from "../../components/academic/AcademicVideoPlayer.jsx";

import {
  getAcademicVideo
} from "../../services/user/academicVideoService.js";


function AcademicVideo() {

  const {
    lessonId
  } = useParams();


  const location =
    useLocation();


  const navigate =
    useNavigate();


  const videoId =
    location.state?.videoId ||
    null;


  const [
    video,
    setVideo
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  /* ============================================================
     CARGAR VIDEO
     ============================================================ */

  useEffect(
    () => {

      let cancelled = false;


      const loadVideo =
        async () => {

          if (!videoId) {

            setError(
              "No se recibió el identificador del video."
            );

            setLoading(false);

            return;

          }


          try {

            setLoading(true);

            setError("");


            const response =
              await getAcademicVideo(
                videoId
              );


            if (cancelled) {
              return;
            }


            const videoData =
              response?.video ||
              response?.data?.video ||
              response?.data ||
              response;


            if (!videoData?.id) {

              throw new Error(
                "El backend no devolvió información válida del video."
              );

            }


            setVideo(
              videoData
            );

          } catch (requestError) {

            if (cancelled) {
              return;
            }


            console.error(
              "Error cargando video académico:",
              requestError
            );


            setError(
              requestError?.message ||
              "No fue posible cargar el video académico."
            );

          } finally {

            if (!cancelled) {

              setLoading(false);

            }

          }

        };


      loadVideo();


      return () => {

        cancelled = true;

      };

    },
    [
      videoId
    ]
  );


  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {

    return (

      <main
        className="private-page-container"
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
              Cargando video académico...
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
    !video
  ) {

    return (

      <main
        className="private-page-container"
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
                aria-hidden="true"
              />

            </div>


            <strong>
              No fue posible cargar el video
            </strong>


            <span>
              {
                error ||
                "El video solicitado no existe."
              }
            </span>

          </div>

        </div>

      </main>

    );

  }


  /* ============================================================
     VALIDAR LECCIÓN
     ============================================================ */

  const videoLessonId =
    video?.lesson?.id ||
    video?.lessonId ||
    null;


  if (
    lessonId &&
    videoLessonId &&
    lessonId !== videoLessonId
  ) {

    return (

      <main
        className="private-page-container"
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
                aria-hidden="true"
              />

            </div>


            <strong>
              Video no válido
            </strong>


            <span>
              El video no pertenece a la lección
              seleccionada.
            </span>

          </div>

        </div>

      </main>

    );

  }


  /* ============================================================
     DATOS ACADÉMICOS
     ============================================================ */

  const course =
    video?.lesson?.module?.course ||
    video?.module?.course ||
    null;


  const module =
    video?.lesson?.module ||
    video?.module ||
    null;


  const resolvedLessonId =
    videoLessonId ||
    lessonId;


  const courseId =
    course?.id ||
    null;


  const moduleId =
    module?.id ||
    null;


  /* ============================================================
     RENDER
     ============================================================ */

  return (

    <div
      className="private-page-container"
    >

      {/* ========================================================
         VOLVER AL CURSO
         ======================================================== */}

      <button
        type="button"
        className="private-password-button"
        onClick={() =>
          navigate(
            `/dashboard/academic/courses/${courseId}`
          )
        }
        disabled={!courseId}
      >

        <i
          className="bi bi-arrow-left"
          aria-hidden="true"
        />

        <span>
          Volver al curso
        </span>

      </button>


      <header
        className="private-page-header"
      >

        <span className="private-page-eyebrow">
          Área académica
        </span>


        <h1>
          {video.title || "Video de la lección"}
        </h1>


        {video.description && (

          <p>
            {video.description}
          </p>

        )}

      </header>


      <AcademicVideoPlayer

        videoId={
          video.id
        }

        youtubeId={
          video.youtubeId
        }

        courseId={
          courseId
        }

        moduleId={
          moduleId
        }

        lessonId={
          resolvedLessonId
        }

        title={
          video.title ||
          "Video"
        }

        description={
          video.description ||
          ""
        }

      />

    </div>

  );

}


export default AcademicVideo;