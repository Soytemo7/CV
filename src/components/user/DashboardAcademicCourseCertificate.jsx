import {
  useEffect,
  useState
} from "react";

import {
  useNotification
} from "../../hooks/useNotification.js";

import {
  getAcademicCourseCertificate,
  issueAcademicCourseCertificate  
} from "../../services/user/academicCertificateService.js";

import "../../styles/user/dashboardAcademicCertificate.css";


function DashboardAcademicCourseCertificate({
  course
}) {

  const [loading, setLoading] =
    useState(false);

  const [certificateLoading, setCertificateLoading] =
    useState(true);

  const [certificate, setCertificate] =
    useState(null);


  const notification =
    useNotification();


  // ==========================================================
  // CARGAR CONSTANCIA EXISTENTE
  // ==========================================================

  useEffect(() => {

    if (!course?.id) {

      setCertificateLoading(false);

      return;

    }


    const loadCertificate =
      async () => {

        try {

          setCertificateLoading(true);


          const response =
            await getAcademicCourseCertificate(
              course.id
            );


          const certificateData =
            response?.certificate ||
            response?.data?.certificate ||
            response?.data ||
            null;


          if (certificateData) {

            setCertificate(
              certificateData
            );

          }

        } catch (error) {

          if (
            error?.status !== 404 &&
            error?.response?.status !== 404
          ) {

            console.error(
              "Error cargando constancia:",
              error
            );

          }

        } finally {

          setCertificateLoading(false);

        }

      };


    loadCertificate();

  }, [course?.id]);


  // ==========================================================
  // GENERAR CONSTANCIA
  // ==========================================================

  const handleGenerateCertificate =
    async () => {

      if (
        !course?.id ||
        loading ||
        certificate
      ) {

        return;

      }


      try {

        setLoading(true);


        const response =
          await issueAcademicCourseCertificate(
            course.id
          );


        const certificateData =
          response?.certificate ||
          response?.data?.certificate ||
          response?.data ||
          null;


        if (!certificateData) {

          throw new Error(
            "El backend no devolvió los datos de la constancia."
          );

        }


        setCertificate(
          certificateData
        );


        if (
          response?.created === true
        ) {

          notification.success({

            message:
              "Constancia generada",

            description:
              "La constancia del curso fue generada correctamente."

          });

        } else {

          notification.info({

            message:
              "Constancia existente",

            description:
              "La constancia de este curso ya había sido generada."

          });

        }

      } catch (error) {

        console.error(
          "Error generando constancia:",
          error
        );


        notification.error({

          message:
            "No fue posible generar la constancia",

          description:
            error?.message ||
            "Ocurrió un error al generar la constancia."

        });

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // DESCARGAR PDF
  // ==========================================================

    const handleDownloadCertificate =
    () => {

      if (
        !course?.id ||
        loading ||
        !certificate
      ) {

        return;

      }


      const API_URL =
        import.meta.env.VITE_API_URL;


      const pdfUrl =
        `${API_URL}/api/academic/certificates/${course.id}/pdf`;


      window.open(
        pdfUrl,
        "_blank",
        "noopener,noreferrer"
      );

    };


  return (

    <article
      className="
        academic-course-card
        academic-course-certificate
        animated-border
      "
    >

      <div
        className="
          private-icon-button
          private-icon-button-blue
        "
        aria-hidden="true"
      >

        <i
          className="bi bi-award"
          aria-hidden="true"
        />

      </div>


      <div
        className="
          academic-course-content
        "
      >

        <span
          className="
            private-page-eyebrow
          "
        >
          Constancia
        </span>


        <h2
          className="
            academic-course-title
          "
        >
          Curso aprobado
        </h2>


        <p
          className="
            academic-course-description
          "
        >

          Has completado satisfactoriamente
          el curso{" "}

          <strong>
            {course?.title || "académico"}.
          </strong>

        </p>


        <span
          className="
            academic-course-certificate-description
          "
        >

          {certificate
            ? "Tu constancia de participación y aprobación ya ha sido generada."
            : "Puedes generar tu constancia de participación y aprobación del curso."
          }

        </span>


        {certificate && (

          <div
            className="
              academic-course-certificate-result
            "
          >

            <div>

              <span>
                Número de constancia
              </span>

              <strong>
                {
                  certificate.certificateNumber ||
                  "—"
                }
              </strong>

            </div>

          </div>

        )}


        {!certificateLoading && (

          <div
            className="
              academic-course-certificate-action
            "
          >

            {!certificate ? (

              <button
                type="button"
                className="
                  academic-course-button
                  private-button
                  academic-course-certificate-button
                "
                onClick={
                  handleGenerateCertificate
                }
                disabled={
                  loading
                }
              >

                <i
                  className={
                    loading
                      ? "bi bi-arrow-repeat"
                      : "bi bi-file-earmark-check"
                  }
                  aria-hidden="true"
                />

                <span>

                  {loading
                    ? "Generando..."
                    : "Generar constancia"
                  }

                </span>

              </button>

            ) : (

              <button
                type="button"
                className="
                  academic-course-button
                  private-button
                  academic-course-certificate-button
                "
                onClick={
                  handleDownloadCertificate
                }
                disabled={
                  loading
                }
              >

                <i
                  className={
                    loading
                      ? "bi bi-arrow-repeat"
                      : "bi bi-file-earmark-pdf"
                  }
                  aria-hidden="true"
                />

                <span>

                  {loading
                    ? "Preparando PDF..."
                    : "Descargar constancia PDF"
                  }

                </span>

              </button>

            )}

          </div>

        )}

      </div>

    </article>

  );

}


export default DashboardAcademicCourseCertificate;