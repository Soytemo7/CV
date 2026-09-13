import "../../styles/user/dashboardAcademicCourse.css";

function DashboardAcademicCourseLesson({
  lesson,
  lessonIndex,
  unlocked,
  progressMap,
  onOpenLesson
}) {

  const videos =
    Array.isArray(lesson?.videos)
      ? [...lesson.videos].sort(
          (a, b) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        )
      : [];


  const completedVideos =
    videos.filter(
      video =>
        progressMap.get(video.id) === true
    ).length;


  const totalVideos =
    videos.length;


  const completed =
    totalVideos > 0 &&
    completedVideos === totalVideos;


  const progress =
    totalVideos > 0
      ? Math.round(
          (completedVideos /
            totalVideos) *
            100
        )
      : 0;


  return (
    <article
      className={`
        academic-course-lesson
        ${unlocked
          ? ""
          : "academic-course-lesson-locked"}
        ${completed
          ? "academic-course-lesson-completed"
          : ""}
      `}
    >

      {/* =====================================================
          ENCABEZADO DE LA LECCIÓN
          ===================================================== */}

      <header className="academic-course-lesson-header">

        <div
          className={`
            private-icon-button
            ${
              unlocked
                ? "private-icon-button-cyan"
                : "private-icon-button-red"
            }
          `}
          aria-hidden="true"
        >

          <i
            className={
              unlocked
                ? "bi bi-journal-text"
                : "bi bi-lock"
            }
          />

        </div>


        <div className="academic-course-lesson-info">

          <span className="academic-course-lesson-label">
            Lección {lessonIndex + 1}
          </span>


          <h3>
            {lesson.title ||
              `Lección ${lessonIndex + 1}`}
          </h3>


          {lesson.description && (
            <p>
              {lesson.description}
            </p>
          )}

        </div>


        <div
          className={`
            academic-course-lesson-status
            ${
              completed
                ? "completed"
                : unlocked
                  ? "available"
                  : "locked"
            }
          `}
        >

          {completed ? (
            <>
              <i
                className="bi bi-check-circle-fill"
                aria-hidden="true"
              />

              <span>
                Completada
              </span>
            </>
          ) : unlocked ? (
            <>
              <i
                className="bi bi-play-circle"
                aria-hidden="true"
              />

              <span>
                Disponible
              </span>
            </>
          ) : (
            <>
              <i
                className="bi bi-lock-fill"
                aria-hidden="true"
              />

              <span>
                Bloqueada
              </span>
            </>
          )}

        </div>

      </header>


      {/* =====================================================
          PROGRESO
          ===================================================== */}

      <div className="academic-course-lesson-progress">

        <span>
          {completedVideos} de{" "}
          {totalVideos} videos
        </span>


        <strong>
          {progress}%
        </strong>

      </div>


      {/* =====================================================
          VIDEOS
          ===================================================== */}

      <div className="academic-course-lesson-videos">

        {videos.length === 0 ? (

          <div className="academic-course-video-empty">

            <i
              className="bi bi-camera-video-off"
              aria-hidden="true"
            />

            <span>
              Esta lección todavía no tiene
              videos disponibles.
            </span>

          </div>

        ) : (

          videos.map(
            (
              video,
              videoIndex
            ) => {

              const videoCompleted =
                progressMap.get(
                  video.id
                ) === true;


              return (
                <button
                  key={video.id}
                  type="button"
                  className={`
                    academic-course-video
                    ${videoCompleted
                      ? "completed"
                      : ""}
                    ${!unlocked
                      ? "locked"
                      : ""}
                  `}
                  onClick={() => {

                    if (!unlocked) {
                      return;
                    }

                    onOpenLesson(
                      lesson.id,
                      video.id
                    );

                  }}
                  disabled={!unlocked}
                >

                  {/* =========================================
                      ICONO DEL VIDEO
                      ========================================= */}

                  <span
                    className={`
                      private-icon-button
                      private-icon-button-red
                    `}
                    aria-hidden="true"
                  >

                    {videoCompleted ? (
                      <i className="bi bi-check-lg" />
                    ) : unlocked ? (
                      <i className="bi bi-play-fill" />
                    ) : (
                      <i className="bi bi-lock-fill" />
                    )}

                  </span>


                  {/* =========================================
                      INFORMACIÓN
                      ========================================= */}

                  <span className="academic-course-video-content">

                    <span className="academic-course-video-label">
                      Video {videoIndex + 1}
                    </span>


                    <strong>
                      {video.title ||
                        `Video ${videoIndex + 1}`}
                    </strong>


                    {video.description && (
                      <small>
                        {video.description}
                      </small>
                    )}

                  </span>


                  {/* =========================================
                      ACCIÓN
                      ========================================= */}

                  <span
                    className="academic-course-video-action"
                    aria-hidden="true"
                  >

                    {videoCompleted ? (
                      <i className="bi bi-check-circle-fill" />
                    ) : unlocked ? (
                      <i className="bi bi-arrow-right" />
                    ) : (
                      <i className="bi bi-lock-fill" />
                    )}

                  </span>

                </button>
              );

            }
          )

        )}

      </div>

    </article>
  );
}


export default DashboardAcademicCourseLesson;