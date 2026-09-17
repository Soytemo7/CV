import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  verifyAcademicCertificate
} from "../services/user/academicCertificateService.js";


function VerifyCertificate() {

  const {
    certificateNumber
  } = useParams();


  const [loading, setLoading] =
    useState(true);

  const [certificate, setCertificate] =
    useState(null);

  const [error, setError] =
    useState(null);


  useEffect(() => {

    const verify =
      async () => {

        try {

          setLoading(true);

          setError(null);


          const response =
            await verifyAcademicCertificate(
              certificateNumber
            );


          setCertificate(
            response
          );

        } catch (error) {

          console.error(
            "Error verificando constancia:",
            error
          );


          setError(
            error?.message ||
            "La constancia no pudo ser verificada."
          );

        } finally {

          setLoading(false);

        }

      };


    verify();

  }, [certificateNumber]);


  if (loading) {

    return (
      <main className="academic-page">

        <section className="academic-course-card">

          <h1>
            Verificando constancia...
          </h1>

        </section>

      </main>
    );

  }


  if (error || !certificate?.valid) {

    return (
      <main className="academic-page">

        <section className="academic-course-card">

          <div
            className="
              private-icon-button
              private-icon-button-red
            "
            aria-hidden="true"
          >

            <i
              className="bi bi-x-circle"
              aria-hidden="true"
            />

          </div>


          <div className="academic-course-content">

            <span className="private-page-eyebrow">
              Verificación
            </span>


            <h1 className="academic-course-title">
              Constancia no válida
            </h1>


            <p className="academic-course-description">
              {error ||
                "No fue posible localizar la constancia."}
            </p>

          </div>

        </section>

      </main>
    );

  }


  const issuedDate =
    new Intl.DateTimeFormat(
      "es-MX",
      {
        dateStyle: "long"
      }
    ).format(
      new Date(
        certificate.issuedAt
      )
    );


  return (

    <main className="academic-page">

      <section
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
            className="bi bi-patch-check-fill"
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
            Verificación oficial
          </span>


          <h1
            className="
              academic-course-title
            "
          >
            Constancia válida
          </h1>


          <p
            className="
              academic-course-description
            "
          >
            El sistema académico reconoce esta
            constancia como un documento válido.
          </p>


          <div
            className="
              academic-course-certificate-result
            "
          >

            <div>

              <span>
                Participante
              </span>

              <strong>
                {certificate.studentName}
              </strong>

            </div>


            <div>

              <span>
                Curso
              </span>

              <strong>
                {certificate.course?.title}
              </strong>

            </div>


            <div>

              <span>
                Número de constancia
              </span>

              <strong>
                {certificate.certificateNumber}
              </strong>

            </div>


            <div>

              <span>
                Fecha de emisión
              </span>

              <strong>
                {issuedDate}
              </strong>

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}


export default VerifyCertificate;