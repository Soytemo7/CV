import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getAcademicAssessmentExam,
  getAcademicAssessmentAttempt,
  submitAcademicAssessmentAttempt
} from "../services/user/academicAssessmentService.js";

import {
  useNotification
} from "../hooks/useNotification.js";

import "../styles/animated-border.css";
import "../styles/privateIconButton.css";
import "../styles/user/dashboard.css";
import "../styles/user/dashboardAcademicAssessment.css";


function DashboardAcademicAssessment() {

  const {
    examId
  } = useParams();


  const location =
    useLocation();


  const navigate =
    useNavigate();


  const notification =
    useNotification();


  const attemptId =
    location.state?.attemptId ||
    null;


  const [
    exam,
    setExam
  ] = useState(null);


  const [
    attempt,
    setAttempt
  ] = useState(null);


  const [
    answers,
    setAnswers
  ] = useState({});


  const [
    currentQuestion,
    setCurrentQuestion
  ] = useState(0);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    submitting,
    setSubmitting
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const [
    submittedResult,
    setSubmittedResult
  ] = useState(null);


  const [
    showSubmitModal,
    setShowSubmitModal
  ] = useState(false);


  /* ============================================================
     CARGAR EXAMEN
     ============================================================ */

  useEffect(
    () => {

      let cancelled =
        false;


      const loadAssessment =
        async () => {

          if (!examId) {

            setError(
              "No se recibió el identificador del examen."
            );

            setLoading(false);

            return;

          }


          if (!attemptId) {

            setError(
              "No se recibió el identificador del intento."
            );

            setLoading(false);

            return;

          }


          try {

            setLoading(true);

            setError("");


            const [
              examResponse,
              attemptResponse
            ] =
              await Promise.all([

                getAcademicAssessmentExam(
                  examId
                ),

                getAcademicAssessmentAttempt(
                  attemptId
                )

              ]);


            if (cancelled) {
              return;
            }


            const examData =
              examResponse?.exam ||
              examResponse?.data?.exam ||
              examResponse?.data ||
              examResponse;


            const attemptData =
              attemptResponse?.attempt ||
              attemptResponse?.data?.attempt ||
              attemptResponse?.data ||
              attemptResponse;


            if (!examData?.id) {

              throw new Error(
                "El backend no devolvió información válida del examen."
              );

            }


            if (!attemptData?.id) {

              throw new Error(
                "El backend no devolvió información válida del intento."
              );

            }


            setExam(
              examData
            );


            setAttempt(
              attemptData
            );


            /*
             * Si por alguna razón el backend devuelve
             * un intento ya enviado, no permitimos
             * continuar contestándolo.
             */

            if (
              attemptData.completedAt
            ) {

              setError(
                "Este intento de examen ya fue enviado."
              );

              return;

            }


            /*
             * Recuperar respuestas existentes
             * si el backend las proporciona.
             */

            const existingAnswers =
              {};


            if (
              Array.isArray(
                attemptData.answers
              )
            ) {

              attemptData.answers.forEach(
                answer => {

                  if (
                    answer?.questionId
                  ) {

                    existingAnswers[
                      answer.questionId
                    ] =
                      answer.selectedOptionId ||
                      null;

                  }

                }
              );

            }


            setAnswers(
              existingAnswers
            );


          } catch (requestError) {

            if (cancelled) {
              return;
            }


            console.error(
              "Error cargando examen académico:",
              requestError
            );


            setError(
              requestError?.message ||
              "No fue posible cargar el examen."
            );

          } finally {

            if (!cancelled) {

              setLoading(false);

            }

          }

        };


      loadAssessment();


      return () => {

        cancelled =
          true;

      };

    },
    [
      examId,
      attemptId
    ]
  );


  /* ============================================================
     PREGUNTAS
     ============================================================ */

  const questions =
    useMemo(
      () => {

        if (
          !Array.isArray(
            exam?.questions
          )
        ) {

          return [];

        }


        return [
          ...exam.questions
        ].sort(
          (
            a,
            b
          ) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        );

      },
      [
        exam
      ]
    );


  const totalQuestions =
    questions.length;


  const question =
    questions[
      currentQuestion
    ] || null;


  /* ============================================================
     RESPUESTAS CONTESTADAS
     ============================================================ */

  const answeredCount =
    useMemo(
      () => {

        return questions.filter(
          item =>
            answers[item.id] !== undefined &&
            answers[item.id] !== null
        ).length;

      },
      [
        questions,
        answers
      ]
    );


  const progress =
    totalQuestions > 0
      ? Math.round(
          (
            answeredCount /
            totalQuestions
          ) *
          100
        )
      : 0;


  /* ============================================================
     SELECCIONAR RESPUESTA
     ============================================================ */

  const handleSelectAnswer =
    (
      questionId,
      optionId
    ) => {

      if (
        submitting
      ) {

        return;

      }


      setAnswers(
        previous => ({
          ...previous,

          [questionId]:
            optionId

        })
      );

    };


  /* ============================================================
     ANTERIOR
     ============================================================ */

  const handlePrevious =
    () => {

      if (
        currentQuestion <= 0
      ) {

        return;

      }


      setCurrentQuestion(
        previous =>
          previous - 1
      );

      window.scrollTo({
        top:
          0,
        behavior:
          "smooth"
      });

    };


  /* ============================================================
     SIGUIENTE
     ============================================================ */

  const handleNext =
    () => {

      if (
        currentQuestion >=
        totalQuestions - 1
      ) {

        return;

      }


      setCurrentQuestion(
        previous =>
          previous + 1
      );

      window.scrollTo({
        top:
          0,
        behavior:
          "smooth"
      });

    };


  /* ============================================================
     IR A PREGUNTA
     ============================================================ */

  const handleGoToQuestion =
    (
      index
    ) => {

      setCurrentQuestion(
        index
      );

      window.scrollTo({
        top:
          0,
        behavior:
          "smooth"
      });

    };


  /* ============================================================
     PREPARAR ENVÍO
     ============================================================ */

  const handleRequestSubmit =
    () => {

      if (
        submitting
      ) {

        return;

      }


      setShowSubmitModal(
        true
      );

    };


  /* ============================================================
     CERRAR CONFIRMACIÓN
     ============================================================ */

  const handleCloseSubmitModal =
    () => {

      if (
        submitting
      ) {

        return;

      }


      setShowSubmitModal(
        false
      );

    };


  /* ============================================================
     ENVIAR EXAMEN
     ============================================================ */

  const handleSubmit =
    async () => {

      if (
        !attemptId ||
        submitting
      ) {

        return;

      }


      try {

        setSubmitting(
          true
        );

        setError("");


        const formattedAnswers =
          questions.map(
            item => ({

              questionId:
                item.id,

              selectedOptionId:
                answers[item.id] ||
                null

            })
          );


        const response =
          await submitAcademicAssessmentAttempt(
            attemptId,
            formattedAnswers
          );


        const result =
          response?.result ||
          response?.data?.result ||
          response?.data ||
          response;


        setSubmittedResult(
          result
        );


        setShowSubmitModal(
          false
        );


        notification.success({

          title:
            result?.passed
              ? "Examen aprobado"
              : "Examen enviado",

          description:
            result?.passed
              ? "Has aprobado la evaluación final del curso."
              : "El examen fue enviado y ha sido calificado.",

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


      } catch (requestError) {

        console.error(
          "Error enviando examen:",
          requestError
        );


        setError(
          requestError?.message ||
          "No fue posible enviar el examen."
        );


        notification.error({

          title:
            "No fue posible enviar el examen",

          description:
            requestError?.message ||
            "Ocurrió un error al enviar tus respuestas.",

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

      } finally {

        setSubmitting(
          false
        );

      }

    };


  /* ============================================================
     VOLVER AL CURSO
     ============================================================ */

  const handleBackToCourse =
    () => {

      if (
        exam?.courseId
      ) {

        navigate(
          `/dashboard/academic/courses/${exam.courseId}`
        );

        return;

      }


      navigate(
        "/dashboard/courses"
      );

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
              Cargando examen académico...
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
    !exam ||
    !attempt
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
                aria-hidden="true"
              />

            </div>


            <strong>
              No fue posible cargar el examen
            </strong>


            <span>
              {
                error ||
                "El examen solicitado no está disponible."
              }
            </span>

          </div>

        </div>


        <div className="academic-course-actions">

          <button
            type="button"
            className="
              academic-course-button
              private-button
            "
            onClick={
              handleBackToCourse
            }
          >

            <i
              className="bi bi-arrow-left"
              aria-hidden="true"
            />

            <span>
              Volver al curso
            </span>

          </button>

        </div>

      </main>

    );

  }


  /* ============================================================
     RESULTADO
     ============================================================ */

  if (
    submittedResult
  ) {

    const score =
      Number(
        submittedResult.score
      );


    const passed =
      submittedResult.passed === true;


    return (

      <main
        className="
          private-page-container
          academic-page
          academic-assessment-page
        "
      >

        <header className="private-page-header">

          <span className="private-page-eyebrow">
            Evaluación final
          </span>


          <h1>
            Resultado del examen
          </h1>


          <p>
            {exam.title}
          </p>

        </header>


        <section
            className={`
                private-card
                academic-assessment-result
                ${
                passed
                    ? "academic-assessment-result-passed"
                    : "academic-assessment-result-not-passed"
                }
                animated-border
            `}
            >

            <div
                className={`
                academic-assessment-result-icon
                ${
                    passed
                    ? "academic-assessment-result-approved"
                    : "academic-assessment-result-failed"
                }
                `}
            >

                <i
                className={
                    passed
                    ? "bi bi-check-lg"
                    : "bi bi-x-lg"
                }
                aria-hidden="true"
                />

            </div>


            <span className="private-page-eyebrow">
                Resultado de la evaluación
            </span>


            <h2>
                {
                Number.isFinite(score)
                    ? score.toFixed(2)
                    : "—"
                }
            </h2>


            <p className="academic-assessment-result-label">
                Calificación obtenida
            </p>


            <div
                className="
                academic-assessment-result-status
                "
            >

                <span>
                Estado
                </span>

                <strong
                className={
                    passed
                    ? "approved"
                    : "failed"
                }
                >

                <i
                    className={
                    passed
                        ? "bi bi-check-circle-fill"
                        : "bi bi-x-circle-fill"
                    }
                    aria-hidden="true"
                />

                {
                    passed
                    ? "Aprobado"
                    : "No aprobado"
                }

                </strong>

            </div>


            <div
                className="
                academic-assessment-result-minimum
                "
            >

                <span>
                Calificación mínima
                </span>

                <strong>
                8.00
                </strong>

            </div>


            <button
                type="button"
                className="
                academic-course-button
                private-button
                academic-assessment-result-button
                "
                onClick={
                handleBackToCourse
                }
            >

                <i
                className="bi bi-mortarboard"
                aria-hidden="true"
                />

                <span>
                Volver al curso
                </span>

            </button>

            </section>

      </main>

    );

  }


  /* ============================================================
     SIN PREGUNTAS
     ============================================================ */

  if (
    totalQuestions === 0
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
                className="bi bi-file-earmark-x"
              />

            </div>


            <strong>
              Examen sin preguntas
            </strong>


            <span>
              Este examen todavía no tiene
              preguntas configuradas.
            </span>

          </div>

        </div>


        <div className="academic-course-actions">

          <button
            type="button"
            className="
              academic-course-button
              private-button
            "
            onClick={
              handleBackToCourse
            }
          >

            <i className="bi bi-arrow-left" />

            <span>
              Volver al curso
            </span>

          </button>

        </div>

      </main>

    );

  }


  /* ============================================================
     EXAMEN
     ============================================================ */

  return (

    <main
      className="
        private-page-container
        academic-page
        academic-assessment-page
      "
    >

      {/* ========================================================
          ACCIONES
          ======================================================== */}

      <div className="academic-course-actions">

        <button
          type="button"
          className="
            academic-course-button
            private-button
          "
          onClick={
            handleBackToCourse
          }
          disabled={
            submitting
          }
        >

          <i
            className="bi bi-arrow-left"
            aria-hidden="true"
          />

          <span>
            Volver al curso
          </span>

        </button>

      </div>


      {/* ========================================================
          CABECERA
          ======================================================== */}

      <header className="private-page-header">

        <span className="private-page-eyebrow">
          Evaluación final
        </span>


        <h1>
          {exam.title ||
            "Examen final"}
        </h1>


        {exam.description && (

          <p>
            {exam.description}
          </p>

        )}

      </header>


      {/* ========================================================
          INFORMACIÓN
          ======================================================== */}

      <section
        className="
          academic-assessment-overview
          private-card
          animated-border
        "
      >

        <div
          className="
            academic-assessment-overview-icon
            private-icon-button
            private-icon-button-blue
          "
        >

          <i
            className="bi bi-file-earmark-check"
            aria-hidden="true"
          />

        </div>


        <div className="academic-assessment-overview-content">

          <span className="private-page-eyebrow">
            Progreso del examen
          </span>


          <strong>
            {answeredCount} de{" "}
            {totalQuestions} preguntas contestadas
          </strong>


          <div
            className="
              academic-assessment-progress-track
            "
          >

            <span
              style={{
                width:
                  `${progress}%`
              }}
            />

          </div>


          <small>
            {progress}% completado
          </small>

        </div>

      </section>


      {/* ========================================================
          CONTENIDO
          ======================================================== */}

      <section
        className="
          academic-assessment-layout
        "
      >

        {/* ======================================================
            NAVEGACIÓN
            ====================================================== */}

        <aside
          className="
            academic-assessment-navigation
            private-card
            animated-border
          "
        >

          <div
            className="
              academic-assessment-navigation-header
            "
          >

            <span className="private-page-eyebrow">
              Preguntas
            </span>


            <strong>
              {answeredCount}/{totalQuestions}
            </strong>

          </div>


          <div
            className="
              academic-assessment-question-list
            "
          >

            {questions.map(
              (
                item,
                index
              ) => {

                const answered =
                  answers[item.id] !== undefined &&
                  answers[item.id] !== null;


                const active =
                  index ===
                  currentQuestion;


                return (

                  <button
                    key={
                      item.id
                    }
                    type="button"
                    className={`
                      academic-assessment-question-index
                      ${
                        active
                          ? "active"
                          : ""
                      }
                      ${
                        answered
                          ? "answered"
                          : ""
                      }
                    `}
                    onClick={() =>
                      handleGoToQuestion(
                        index
                      )
                    }
                    disabled={
                      submitting
                    }
                  >

                    <span>
                      {index + 1}
                    </span>


                    <i
                      className={
                        answered
                          ? "bi bi-check-circle-fill"
                          : "bi bi-circle"
                      }
                      aria-hidden="true"
                    />

                  </button>

                );

              }
            )}

          </div>

        </aside>


        {/* ======================================================
            PREGUNTA
            ====================================================== */}

        <article
          className="
            academic-assessment-question-card
            private-card
            animated-border
          "
        >

          <header
            className="
              academic-assessment-question-header
            "
          >

            <div>

              <span className="private-page-eyebrow">
                Pregunta {currentQuestion + 1} de{" "}
                {totalQuestions}
              </span>


              <h2>
                {question.question}
              </h2>

            </div>


            <span
              className="
                academic-assessment-question-points
              "
            >

              {question.points ?? 1}{" "}
              {Number(question.points ?? 1) === 1
                ? "punto"
                : "puntos"}

            </span>

          </header>


          {/* ====================================================
              OPCIONES
              ==================================================== */}

          <div
            className="
              academic-assessment-options
            "
          >

            {Array.isArray(
              question.options
            ) &&
            question.options.map(
              (
                option,
                optionIndex
              ) => {

                const selected =
                  answers[question.id] ===
                  option.id;


                return (

                  <label
                    key={
                      option.id
                    }
                    className={`
                      academic-assessment-option
                      ${
                        selected
                          ? "selected"
                          : ""
                      }
                    `}
                  >

                    <input
                      type="radio"
                      name={
                        `question-${question.id}`
                      }
                      value={
                        option.id
                      }
                      checked={
                        selected
                      }
                      onChange={() =>
                        handleSelectAnswer(
                          question.id,
                          option.id
                        )
                      }
                      disabled={
                        submitting
                      }
                    />


                    <span
                      className="
                        academic-assessment-option-marker
                      "
                    >
                      {String.fromCharCode(
                        65 +
                        optionIndex
                      )}
                    </span>


                    <span
                      className="
                        academic-assessment-option-text
                      "
                    >
                      {option.text}
                    </span>


                    <i
                      className="
                        bi bi-check-circle-fill
                        academic-assessment-option-check
                      "
                      aria-hidden="true"
                    />

                  </label>

                );

              }
            )}

          </div>


          {/* ====================================================
              ACCIONES
              ==================================================== */}

          <footer
            className="
              academic-assessment-actions
            "
          >

            <button
              type="button"
              className="
                academic-course-button
                private-button
                private-button-secondary
              "
              onClick={
                handlePrevious
              }
              disabled={
                currentQuestion === 0 ||
                submitting
              }
            >

              <i
                className="bi bi-arrow-left"
                aria-hidden="true"
              />

              <span>
                Anterior
              </span>

            </button>


            {currentQuestion <
            totalQuestions - 1 ? (

              <button
                type="button"
                className="
                  academic-course-button
                  private-button
                "
                onClick={
                  handleNext
                }
                disabled={
                  submitting
                }
              >

                <span>
                  Siguiente
                </span>

                <i
                  className="bi bi-arrow-right"
                  aria-hidden="true"
                />

              </button>

            ) : (

              <button
                type="button"
                className="
                  academic-course-button
                  private-button
                "
                onClick={
                  handleRequestSubmit
                }
                disabled={
                  submitting
                }
              >

                <i
                  className={
                    submitting
                      ? "bi bi-arrow-repeat"
                      : "bi bi-send-check"
                  }
                  aria-hidden="true"
                />

                <span>
                  {submitting
                    ? "Enviando..."
                    : "Enviar examen"}
                </span>

              </button>

            )}

          </footer>

        </article>

      </section>


      {/* ========================================================
          MODAL CONFIRMACIÓN
          ======================================================== */}

      {showSubmitModal && (

        <div
          className="
            academic-assessment-modal-overlay
          "
          role="presentation"
          onClick={
            handleCloseSubmitModal
          }
        >

          <div
            className="
              academic-assessment-modal
              private-card
              animated-border
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="
              academic-assessment-submit-title
            "
            onClick={
              event =>
                event.stopPropagation()
            }
          >

            <header
              className="
                academic-assessment-modal-header
              "
            >

              <div
                className="
                  private-icon-button
                  private-icon-button-blue
                "
              >

                <i
                  className="
                    bi bi-send-check
                  "
                  aria-hidden="true"
                />

              </div>


              <div>

                <span className="private-page-eyebrow">
                  Confirmar envío
                </span>


                <h2
                  id="
                    academic-assessment-submit-title
                  "
                >
                  ¿Deseas enviar el examen?
                </h2>

              </div>

            </header>


            <div
              className="
                academic-assessment-modal-body
              "
            >

              <p>
                Has contestado{" "}
                <strong>
                  {answeredCount}
                </strong>{" "}
                de{" "}
                <strong>
                  {totalQuestions}
                </strong>{" "}
                preguntas.
              </p>


              {answeredCount <
              totalQuestions && (

                <div
                  className="
                    academic-assessment-modal-warning
                  "
                >

                  <i
                    className="
                      bi bi-exclamation-triangle
                    "
                    aria-hidden="true"
                  />

                  <span>
                    Las preguntas que no hayas
                    contestado se enviarán sin respuesta
                    y serán calificadas como incorrectas.
                  </span>

                </div>

              )}


              <p>
                Una vez enviado el examen,
                este intento quedará cerrado y
                ya no podrás modificar tus respuestas.
              </p>

            </div>


            <footer
              className="
                academic-assessment-modal-footer
              "
            >

              <button
                type="button"
                className="
                  academic-course-button
                  private-button
                  private-button-secondary
                "
                onClick={
                  handleCloseSubmitModal
                }
                disabled={
                  submitting
                }
              >

                <i
                  className="bi bi-x-lg"
                  aria-hidden="true"
                />

                <span>
                  Cancelar
                </span>

              </button>


              <button
                type="button"
                className="
                  academic-course-button
                  private-button
                "
                onClick={
                  handleSubmit
                }
                disabled={
                  submitting
                }
              >

                <i
                  className={
                    submitting
                      ? "bi bi-arrow-repeat"
                      : "bi bi-send-check"
                  }
                  aria-hidden="true"
                />

                <span>
                  {submitting
                    ? "Enviando..."
                    : "Confirmar envío"}
                </span>

              </button>

            </footer>

          </div>

        </div>

      )}

    </main>

  );

}


export default DashboardAcademicAssessment;