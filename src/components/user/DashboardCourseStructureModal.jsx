function DashboardCourseStructureModal({
  course,
  courseStructure,
  loadingStructure,
  structureError,
  onClose
}) {

  const formatDuration = (duration) => {

    if (
      duration === null ||
      duration === undefined ||
      Number.isNaN(Number(duration))
    ) {
      return null;
    }

    const totalSeconds =
      Math.max(
        0,
        Math.round(
          Number(duration)
        )
      );

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;

  };


  return (

    <div
      className="dashboard-course-structure-modal-overlay"
      role="presentation"
      onClick={onClose}
    >

      <div
        className="
          dashboard-course-structure-modal
          animated-border
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-course-structure-title"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >

        <header className="dashboard-course-structure-modal-header">

          <div>

            <span className="private-page-eyebrow">
              Área académica
            </span>


            <h2 id="dashboard-course-structure-title">
              Estructura del curso
            </h2>


            <p>
              {course.title}
            </p>

          </div>


          <button
            type="button"
            className="
              private-icon-button
              private-icon-button-red
            "
            onClick={onClose}
            disabled={loadingStructure}
            aria-label="Cerrar estructura"
          >

            <i
              className="bi bi-x-lg"
              aria-hidden="true"
            />

          </button>

        </header>


        <div className="dashboard-course-structure-modal-body">

          {loadingStructure && (

            <div className="dashboard-course-structure-loading">

              <i
                className="bi bi-arrow-repeat"
                aria-hidden="true"
              ></i>


              <span>
                Cargando estructura...
              </span>

            </div>

          )}


          {!loadingStructure &&
            structureError && (

            <div className="dashboard-course-structure-error">

              <i
                className="bi bi-exclamation-circle"
                aria-hidden="true"
              ></i>


              <span>
                {structureError}
              </span>

            </div>

          )}


          {!loadingStructure &&
            !structureError &&
            courseStructure && (

            <>

              {/* ============================================================
                  IMAGEN DEL CURSO
                  ============================================================ */}

              {course.imageUrl && (

                <div className="dashboard-course-structure-course-image">

                  <img
                    src={course.imageUrl}
                    alt={`Imagen del curso ${course.title}`}
                  />

                </div>

              )}


              {/* ============================================================
                  ESTRUCTURA DEL CURSO
                  ============================================================ */}

              <div className="dashboard-course-structure-list">

                {courseStructure.modules?.length > 0 ? (

                  courseStructure.modules.map(
                    (module, moduleIndex) => (

                      <section
                        key={module.id}
                        className="dashboard-course-structure-module"
                      >

                        <div className="dashboard-course-structure-module-header">

                          <div
                            className="
                              private-icon-button
                              private-icon-button-blue
                            "
                            aria-hidden="true"
                          >

                            <i
                              className="bi bi-journal-bookmark"
                              aria-hidden="true"
                            ></i>

                          </div>


                          <div>

                            <span>
                              Módulo {moduleIndex + 1}
                            </span>


                            <h3>
                              {module.title}
                            </h3>

                          </div>

                        </div>


                        <div className="dashboard-course-structure-lessons">

                          {module.lessons?.length > 0 ? (

                            module.lessons.map(
                              (lesson, lessonIndex) => (

                                <div
                                  key={lesson.id}
                                  className="dashboard-course-structure-lesson"
                                >

                                  <div
                                    className="
                                      private-icon-button
                                      private-icon-button-cyan
                                    "
                                    aria-hidden="true"
                                  >

                                    <i
                                      className="bi bi-play-circle"
                                      aria-hidden="true"
                                    ></i>

                                  </div>


                                  <div className="dashboard-course-structure-lesson-content">

                                    <span>
                                      Lección {lessonIndex + 1}
                                    </span>


                                    <strong>
                                      {lesson.title}
                                    </strong>


                                    {lesson.videos?.length > 0 && (

                                      <div className="dashboard-course-structure-videos">

                                        {lesson.videos.map(
                                          (video, videoIndex) => {

                                            const duration =
                                              formatDuration(
                                                video.duration
                                              );


                                            return (

                                              <div
                                                key={video.id}
                                                className="dashboard-course-structure-video"
                                              >

                                                <div
                                                  className="
                                                    private-icon-button
                                                    private-icon-button-red
                                                  "
                                                  aria-hidden="true"
                                                >

                                                  <i
                                                    className="bi bi-camera-video"
                                                    aria-hidden="true"
                                                  ></i>

                                                </div>


                                                <div className="dashboard-course-structure-video-content">

                                                  <span>
                                                    Video {videoIndex + 1}
                                                  </span>


                                                  <strong>
                                                    {video.title}
                                                  </strong>


                                                  {duration && (

                                                    <small>

                                                      <i
                                                        className="bi bi-clock"
                                                        aria-hidden="true"
                                                      ></i>

                                                      {duration}

                                                    </small>

                                                  )}

                                                </div>

                                              </div>

                                            );

                                          }
                                        )}

                                      </div>

                                    )}

                                  </div>

                                </div>

                              )
                            )

                          ) : (

                            <div className="dashboard-course-structure-empty">

                              <i
                                className="bi bi-info-circle"
                                aria-hidden="true"
                              ></i>


                              <span>
                                Este módulo no tiene lecciones.
                              </span>

                            </div>

                          )}

                        </div>

                      </section>

                    )

                  )

                ) : (

                  <div className="dashboard-course-structure-empty">

                    <i
                      className="bi bi-journal-x"
                      aria-hidden="true"
                    ></i>


                    <span>
                      Este curso todavía no tiene estructura académica.
                    </span>

                  </div>

                )}

              </div>

            </>

          )}

        </div>


        <footer className="dashboard-course-structure-modal-footer">

          <button
            type="button"
            className="dashboard-course-structure-close-button"
            onClick={onClose}
            disabled={loadingStructure}
          >

            <i
              className="bi bi-x-lg"
              aria-hidden="true"
            />


            <span>
              Cerrar
            </span>

          </button>

        </footer>

      </div>

    </div>

  );

}


export default DashboardCourseStructureModal;
