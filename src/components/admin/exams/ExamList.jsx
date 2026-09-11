import React from "react";

import ExamCard from "./ExamCard";

/**
 * ============================================================
 * ADMIN — LISTA DE EXÁMENES
 * ============================================================
 */

const ExamList = ({
  courses,
  exams,
  loading,
  actionLoading,
  onNewExam,
  onEditExam,
  onManageQuestions,
}) => {
  if (loading) {
    return (
      <section className="admin-exams-state">
        <div className="admin-users-loading">
          <i className="bi bi-hourglass-split" />
          Cargando exámenes...
        </div>
      </section>
    );
  }

  if (!courses.length) {
    return (
      <section
        className="
          admin-exams-empty
          private-card
          animated-border
        "
      >
        <div
          className="
            admin-exams-empty-icon
            private-icon-button
            private-icon-button-blue
          "
        >
          <i className="bi bi-mortarboard" />
        </div>

        <h3>
          No existen cursos disponibles
        </h3>

        <p>
          Primero debes crear un curso desde
          la sección Cursos.
        </p>
      </section>
    );
  }

  return (
    <section
      className="admin-exams-list"
      aria-label="Exámenes académicos"
    >
      <div className="admin-exams-list-header">
        <div>
          <span className="private-page-eyebrow">
            Configuración
          </span>

          <h2>
            Exámenes por curso
          </h2>

          <p>
            Cada curso puede tener un único
            examen final.
          </p>
        </div>
      </div>

      <div className="admin-exams-grid">
        {courses.map((course) => {
          const exam =
            exams.find(
              (item) =>
                item.courseId ===
                course.id
            ) || {
              courseId:
                course.id,
              course,
              id: null,
              title: "",
              description: "",
              questions: [],
            };

          return (
            <ExamCard
              key={course.id}
              course={course}
              exam={exam}
              actionLoading={
                actionLoading
              }
              onNewExam={
                onNewExam
              }
              onEditExam={
                onEditExam
              }
              onManageQuestions={
                onManageQuestions
              }
            />
          );
        })}
      </div>
    </section>
  );
};

export default ExamList;