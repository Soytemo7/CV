import AcademicVideoPlayer
  from "../../components/academic/AcademicVideoPlayer";


const AcademicVideo = () => {

  return (
    <div className="private-page-container">

      {/* ======================================================
          ENCABEZADO
          ====================================================== */}

      <header className="private-page-header">

        <span className="private-page-eyebrow">
          Área académica
        </span>

        <h1>
          Video de la lección
        </h1>

        <p>
          Reproduce el contenido académico
          para registrar tu avance en la lección.
        </p>

      </header>


      {/* ======================================================
          VIDEO 1
          ====================================================== */}

      <AcademicVideoPlayer
        videoId="HNqjKRfH6l8"
        courseId="curso-prueba"
        moduleId="modulo-1"
        lessonId="leccion-1"
        title="Video de prueba 1"
        description="Contenido académico de prueba 1."
      />

    </div>
  );

};


export default AcademicVideo;

