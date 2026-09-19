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

import ThemeToggle
  from "../components/common/ThemeToggle.jsx";

import "../styles/verify-certificate.css";


function VerifyCertificate() {

  const {
    certificateNumber
  } = useParams();


  /* ============================================================
     TEMA
     ============================================================ */

  const [
    isDark,
    setIsDark
  ] = useState(
    () =>
      localStorage.getItem("theme") === "dark"
  );


  /* ============================================================
     ESTADO
     ============================================================ */

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    certificate,
    setCertificate
  ] = useState(null);

  const [
    error,
    setError
  ] = useState(null);


  /* ============================================================
     TEMA
     ============================================================ */

  useEffect(() => {

    localStorage.setItem(
      "theme",
      isDark
        ? "dark"
        : "light"
    );


    document.body.classList.toggle(
      "dark-background",
      isDark
    );


    document.body.classList.toggle(
      "light-background",
      !isDark
    );


    window.dispatchEvent(
      new Event("themechange")
    );

  }, [isDark]);


  /* ============================================================
     VERIFICACIÓN
     ============================================================ */

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


  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {

    return (

      <main
        className={`
          verify-certificate-page
          ${isDark ? "dark" : "light"}
        `}
      >

        <div
          className="
            verify-certificate-theme-toggle
          "
        >

          <ThemeToggle
            isDark={isDark}
            setIsDark={setIsDark}
          />

        </div>


        <section
          className="
            verify-certificate-card
            animated-border
          "
        >

          <div
            className="
              private-icon-button
              private-icon-button-blue
              verify-certificate-icon
            "
            aria-hidden="true"
          >

            <i
              className="bi bi-hourglass-split"
              aria-hidden="true"
            />

          </div>


          <div
            className="
              verify-certificate-header
            "
          >

            <span
              className="
                private-page-eyebrow
              "
            >
              Verificación
            </span>


            <h1>
              Verificando constancia...
            </h1>


            <p>
              Estamos comprobando la autenticidad
              de la constancia académica.
            </p>


            <a
              href={`${import.meta.env.BASE_URL}verificar-constancia`}
              className="
                app-button
                app-button-blue
                verify-certificate-submit
                verify-certificate-back-button
              "
            >

              <i
                className="bi bi-search"
                aria-hidden="true"
              />

              <span>
                Buscar otra constancia
              </span>

            </a>

          </div>

        </section>

      </main>

    );

  }


  /* ============================================================
     CONSTANCIA NO VÁLIDA
     ============================================================ */

  if (
    error ||
    !certificate?.valid
  ) {

    return (

      <main
        className={`
          verify-certificate-page
          ${isDark ? "dark" : "light"}
        `}
      >

        <div
          className="
            verify-certificate-theme-toggle
          "
        >

          <ThemeToggle
            isDark={isDark}
            setIsDark={setIsDark}
          />

        </div>


        <section
          className="
            verify-certificate-card
            animated-border
          "
        >

          <div
            className="
              private-icon-button
              private-icon-button-red
              verify-certificate-icon
            "
            aria-hidden="true"
          >

            <i
              className="bi bi-x-circle"
              aria-hidden="true"
            />

          </div>


          <div
            className="
              verify-certificate-header
            "
          >

            <span
              className="
                private-page-eyebrow
              "
            >
              Verificación
            </span>


            <h1>
              Constancia no válida
            </h1>


            <p>
              {error ||
                "No fue posible localizar la constancia."}
            </p>


            <a
              href={`${import.meta.env.BASE_URL}verificar-constancia`}
              className="
                app-button
                app-button-blue
                verify-certificate-submit
                verify-certificate-back-button
              "
            >

              <i
                className="bi bi-search"
                aria-hidden="true"
              />

              <span>
                Buscar otra constancia
              </span>

            </a>

          </div>

        </section>

      </main>

    );

  }


  /* ============================================================
     FECHA DE EMISIÓN
     ============================================================ */

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


  /* ============================================================
     CONSTANCIA VÁLIDA
     ============================================================ */

  return (

    <main
      className={`
        verify-certificate-page
        ${isDark ? "dark" : "light"}
      `}
    >

      <div
        className="
          verify-certificate-theme-toggle
        "
      >

        <ThemeToggle
          isDark={isDark}
          setIsDark={setIsDark}
        />

      </div>


      <section
        className="
          verify-certificate-card
          animated-border
        "
      >

        <div
          className="
            private-icon-button
            private-icon-button-blue
            verify-certificate-icon
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
            verify-certificate-header
          "
        >

          <span
            className="
              private-page-eyebrow
            "
          >
            Verificación oficial
          </span>


          <h1>
            Constancia válida
          </h1>


          <p>
            El sistema académico reconoce esta
            constancia como un documento válido.
          </p>


          {/* ====================================================
              DATOS DE LA CONSTANCIA
              ==================================================== */}

          <div
            className="
              verify-certificate-result
            "
          >

            <div
              className="
                verify-certificate-result-item
              "
            >

              <span>
                Participante
              </span>

              <strong>
                {certificate.studentName}
              </strong>

            </div>


            <div
              className="
                verify-certificate-result-item
              "
            >

              <span>
                Curso
              </span>

              <strong>
                {certificate.course?.title}
              </strong>

            </div>


            <div
              className="
                verify-certificate-result-item
              "
            >

              <span>
                Número de constancia
              </span>

              <strong>
                {certificate.certificateNumber}
              </strong>

            </div>


            <div
              className="
                verify-certificate-result-item
              "
            >

              <span>
                Fecha de emisión
              </span>

              <strong>
                {issuedDate}
              </strong>

            </div>

          </div>


          {/* ====================================================
              BUSCAR OTRA CONSTANCIA
              ==================================================== */}

          <a
            href={`${import.meta.env.BASE_URL}verificar-constancia`}
            className="
              app-button
              app-button-blue
              verify-certificate-submit
              verify-certificate-back-button
            "
          >

            <i
              className="bi bi-search"
              aria-hidden="true"
            />

            <span>
              Buscar otra constancia
            </span>

          </a>

        </div>

      </section>

    </main>

  );

}


export default VerifyCertificate;