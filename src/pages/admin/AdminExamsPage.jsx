import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createExam,
  getAdminCourses,
  getAdminExamByCourse,
  updateExam,
  createQuestion,
  updateQuestion,
  replaceQuestionOptions,
  deleteQuestion,
} from "../../services/admin/adminExamService.js";

import DeleteQuestionModal from "../../components/admin/exams/DeleteQuestionModal";
import ExamList from "../../components/admin/exams/ExamList";
import ExamModal from "../../components/admin/exams/ExamModal";
import ExamQuestions from "../../components/admin/exams/ExamQuestions";
import QuestionModal from "../../components/admin/exams/QuestionModal";

import { useNotification } from "../../hooks/useNotification";

import "../../styles/admin/admin-exams.css";

/**
 * ============================================================
 * ADMIN — EXÁMENES
 * ============================================================
 *
 * Administración y configuración de exámenes académicos.
 *
 * Responsabilidades:
 *
 * - Consultar cursos.
 * - Consultar examen de cada curso.
 * - Crear examen.
 * - Editar examen.
 * - Configurar preguntas.
 * - Configurar opciones.
 * - Definir respuesta correcta.
 * - Definir puntos.
 * - Definir orden.
 *
 * La evaluación de alumnos y resultados pertenece a
 * AdminAssessments.
 * ============================================================
 */

const AdminExamsPage = () => {
  const notification = useNotification();

  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [selectedExam, setSelectedExam] =
    useState(null);

  const [showExamModal, setShowExamModal] =
    useState(false);

  const [showQuestions, setShowQuestions] =
    useState(false);

  const [showQuestionModal, setShowQuestionModal] =
    useState(false);

  const [editingQuestion, setEditingQuestion] =
    useState(null);

  const [questionExam, setQuestionExam] =
    useState(null);

  const [questionToDelete, setQuestionToDelete] =
    useState(null);

      const navigate =
    useNavigate();

  /* ==========================================================
     NOTIFICACIONES
     ========================================================== */

  const notifySuccess = useCallback(
    (title, description) => {
      notification?.success({
        title,
        description,
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });
    },
    [notification]
  );

  const notifyError = useCallback(
    (title, description) => {
      notification?.error({
        title,
        description,
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });
    },
    [notification]
  );

  /* ==========================================================
     CARGAR DATOS
     ========================================================== */

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const courseList =
        await getAdminCourses();

      const normalizedCourses =
        Array.isArray(courseList)
          ? courseList
          : [];

      setCourses(normalizedCourses);

      const examResults =
        await Promise.all(
          normalizedCourses.map(
            async (course) => {
              const exam =
                await getAdminExamByCourse(
                  course.id
                );

              /*
               * Curso sin examen.
               */
              if (!exam) {
                return {
                  id: null,
                  courseId: course.id,
                  course,
                  title: "",
                  description: "",
                  questions: [],
                };
              }

              /*
               * Curso con examen.
               */
              return {
                ...exam,
                course,
              };
            }
          )
        );

      setExams(examResults);
    } catch (requestError) {
      console.error(
        "Error al cargar exámenes:",
        requestError
      );

      setError(
        requestError?.message ||
          "No fue posible cargar los exámenes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ==========================================================
     CREAR EXAMEN
     ========================================================== */

  const handleNewExam = (course) => {
    setSelectedExam({
      courseId: course.id,
      course,
      title: "",
      description: "",
    });

    setShowExamModal(true);
  };

  /* ==========================================================
     EDITAR EXAMEN
     ========================================================== */

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setShowExamModal(true);
  };

  /* ==========================================================
     GUARDAR EXAMEN
     ========================================================== */

  const handleSaveExam = async (data) => {
    setActionLoading(true);
    setError("");

    try {
      const isEditing = Boolean(
        selectedExam?.id
      );

      if (isEditing) {
        await updateExam(
          selectedExam.id,
          {
            title: data.title,
            description: data.description,
          }
        );
      } else {
        await createExam({
          courseId: data.courseId,
          title: data.title,
          description: data.description,
        });
      }

      setShowExamModal(false);
      setSelectedExam(null);

      await loadData();

      if (isEditing) {
        notifySuccess(
          "¡Examen actualizado!",
          "Los datos del examen se han actualizado correctamente."
        );
      } else {
        notifySuccess(
          "¡Examen creado!",
          "El examen se ha creado correctamente."
        );
      }
    } catch (requestError) {
      console.error(
        "Error al guardar examen:",
        requestError
      );

      const message =
        requestError?.message ||
        "No fue posible guardar el examen.";

      setError(message);

      notifyError(
        "Error al guardar el examen",
        message
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     CONFIGURAR PREGUNTAS
     ========================================================== */

  const handleManageQuestions = async (exam) => {
    setActionLoading(true);
    setError("");

    try {
      const freshExam =
        await getAdminExamByCourse(
          exam.courseId
        );

      const course =
        exam.course ||
        courses.find(
          (item) =>
            item.id === exam.courseId
        );

      const normalizedExam = {
        ...freshExam,
        course,
      };

      setQuestionExam(normalizedExam);
      setSelectedExam(normalizedExam);
      setShowQuestions(true);
    } catch (requestError) {
      console.error(
        "Error al abrir preguntas:",
        requestError
      );

      setError(
        requestError?.message ||
          "No fue posible cargar las preguntas."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     NUEVA PREGUNTA
     ========================================================== */

  const handleNewQuestion = () => {
    if (!questionExam) {
      return;
    }

    const questions =
      questionExam.questions || [];

    setEditingQuestion({
      question: "",
      order: questions.length + 1,
      points: 1,
      options: [
        {
          text: "",
          order: 1,
          isCorrect: true,
        },
        {
          text: "",
          order: 2,
          isCorrect: false,
        },
      ],
    });

    setShowQuestionModal(true);
  };

  /* ==========================================================
     EDITAR PREGUNTA
     ========================================================== */

  const handleEditQuestion = (question) => {
    setEditingQuestion({
      ...question,
      options:
        question.options?.map(
          (option) => ({
            ...option,
            isCorrect:
              Boolean(option.isCorrect),
          })
        ) || [],
    });

    setShowQuestionModal(true);
  };

  /* ==========================================================
     GUARDAR PREGUNTA
     ========================================================== */

  const handleSaveQuestion = async (
    questionData
  ) => {
    if (!questionExam) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const isEditing = Boolean(
        editingQuestion?.id
      );

      let savedQuestion;

      if (isEditing) {
        savedQuestion =
          await updateQuestion(
            editingQuestion.id,
            {
              question:
                questionData.question,
              order:
                Number(
                  questionData.order
                ),
              points:
                Number(
                  questionData.points
                ),
            }
          );

        await replaceQuestionOptions(
          editingQuestion.id,
          questionData.options
        );
      } else {
        savedQuestion =
          await createQuestion(
            questionExam.id,
            {
              question:
                questionData.question,
              order:
                Number(
                  questionData.order
                ),
              points:
                Number(
                  questionData.points
                ),
              options:
                questionData.options,
            }
          );
      }

      /*
       * La fuente definitiva sigue siendo
       * el backend.
       */
      const freshExam =
        await getAdminExamByCourse(
          questionExam.courseId
        );

      const course =
        questionExam.course ||
        courses.find(
          (item) =>
            item.id ===
            questionExam.courseId
        );

      const normalizedExam = {
        ...freshExam,
        course,
      };

      setQuestionExam(normalizedExam);
      setSelectedExam(normalizedExam);

      setShowQuestionModal(false);
      setEditingQuestion(null);

      await loadData();

      if (isEditing) {
        notifySuccess(
          "¡Pregunta actualizada!",
          "La pregunta, sus opciones y configuración se han actualizado correctamente."
        );
      } else {
        notifySuccess(
          "¡Pregunta creada!",
          "La pregunta se ha agregado correctamente al examen."
        );
      }

      return savedQuestion;
    } catch (requestError) {
      console.error(
        "Error al guardar pregunta:",
        requestError
      );

      const message =
        requestError?.message ||
        "No fue posible guardar la pregunta.";

      setError(message);

      notifyError(
        "Error al guardar la pregunta",
        message
      );

      throw requestError;
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     SOLICITAR ELIMINACIÓN
     ========================================================== */

  const handleDeleteQuestion = (question) => {
    if (actionLoading) {
      return;
    }

    setQuestionToDelete(question);
  };

  /* ==========================================================
     CONFIRMAR ELIMINACIÓN
     ========================================================== */

  const handleConfirmDeleteQuestion = async () => {
    if (
      !questionToDelete ||
      !questionExam
    ) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      await deleteQuestion(
        questionToDelete.id
      );

      const freshExam =
        await getAdminExamByCourse(
          questionExam.courseId
        );

      const course =
        questionExam.course ||
        courses.find(
          (item) =>
            item.id ===
            questionExam.courseId
        );

      const normalizedExam = {
        ...freshExam,
        course,
      };

      setQuestionExam(normalizedExam);
      setSelectedExam(normalizedExam);

      setQuestionToDelete(null);

      await loadData();

      notifySuccess(
        "¡Pregunta eliminada!",
        "La pregunta y sus opciones se han eliminado correctamente del examen."
      );
    } catch (requestError) {
      console.error(
        "Error al eliminar pregunta:",
        requestError
      );

      const message =
        requestError?.message ||
        "No fue posible eliminar la pregunta.";

      setError(message);

      notifyError(
        "Error al eliminar la pregunta",
        message
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ==========================================================
     CERRAR CONFIGURACIÓN
     ========================================================== */

  const handleCloseQuestions = () => {
    if (actionLoading) {
      return;
    }

    setShowQuestions(false);
    setQuestionExam(null);
    setEditingQuestion(null);
    setQuestionToDelete(null);
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="private-page-container admin-exams-page">
      {/* ======================================================
          CABECERA
          ====================================================== */}

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
            Exámenes
          </h1>

          <p>
            Crea y configura los exámenes finales
            de los cursos académicos.
          </p>

        </header>

      {/* ======================================================
          RESUMEN
          ====================================================== */}

      <section
        className="admin-exams-summary"
        aria-label="Resumen de exámenes"
      >
        <article
          className="
            admin-exams-stat
            private-card
            animated-border
          "
        >
          <div className="admin-exams-stat-icon">
            <i className="bi bi-mortarboard" />
          </div>

          <div>
            <span>
              Cursos
            </span>

            <strong>
              {courses.length}
            </strong>
          </div>
        </article>

        <article
          className="
            admin-exams-stat
            private-card
            animated-border
          "
        >
          <div className="admin-exams-stat-icon">
            <i className="bi bi-file-earmark-text" />
          </div>

          <div>
            <span>
              Exámenes
            </span>

            <strong>
              {
                exams.filter(
                  (exam) =>
                    Boolean(exam.id)
                ).length
              }
            </strong>
          </div>
        </article>

        <article
          className="
            admin-exams-stat
            private-card
            animated-border
          "
        >
          <div className="admin-exams-stat-icon">
            <i className="bi bi-question-circle" />
          </div>

          <div>
            <span>
              Preguntas
            </span>

            <strong>
              {exams.reduce(
                (
                  total,
                  exam
                ) =>
                  total +
                  (
                    exam.questions
                      ?.length || 0
                  ),
                0
              )}
            </strong>
          </div>
        </article>
      </section>

      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (
        <div
          className="admin-users-error admin-exams-error"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle" />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            aria-label="Cerrar mensaje"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {/* ======================================================
          LISTA
          ====================================================== */}

      <ExamList
        courses={courses}
        exams={exams}
        loading={loading}
        actionLoading={actionLoading}
        onNewExam={handleNewExam}
        onEditExam={handleEditExam}
        onManageQuestions={
          handleManageQuestions
        }
      />

      {/* ======================================================
          MODAL EXAMEN
          ====================================================== */}

      {showExamModal && (
        <ExamModal
          exam={selectedExam}
          courses={courses}
          loading={actionLoading}
          onSave={handleSaveExam}
          onCancel={() => {
            if (actionLoading) {
              return;
            }

            setShowExamModal(false);
            setSelectedExam(null);
          }}
        />
      )}

      {/* ======================================================
          CONFIGURACIÓN DE PREGUNTAS
          ====================================================== */}

      {showQuestions && questionExam && (
        <ExamQuestions
          exam={questionExam}
          loading={actionLoading}
          onNewQuestion={
            handleNewQuestion
          }
          onEditQuestion={
            handleEditQuestion
          }
          onDeleteQuestion={
            handleDeleteQuestion
          }
          onClose={
            handleCloseQuestions
          }
        />
      )}

      {/* ======================================================
          MODAL PREGUNTA
          ====================================================== */}

      {showQuestionModal && (
        <QuestionModal
          question={editingQuestion}
          loading={actionLoading}
          onSave={handleSaveQuestion}
          onCancel={() => {
            if (actionLoading) {
              return;
            }

            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
        />
      )}

      {/* ======================================================
          MODAL ELIMINAR PREGUNTA
          ====================================================== */}

      {questionToDelete && (
        <DeleteQuestionModal
          question={questionToDelete}
          loading={actionLoading}
          onConfirm={
            handleConfirmDeleteQuestion
          }
          onCancel={() => {
            if (actionLoading) {
              return;
            }

            setQuestionToDelete(null);
          }}
        />
      )}
    </main>
  );
};

export default AdminExamsPage;
