import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useNotification
} from "../hooks/useNotification.js";

import ThemeToggle
  from "../components/common/ThemeToggle.jsx";

import "../styles/verify-certificate.css";


function VerifyCertificateSearch() {

  const navigate =
    useNavigate();

  const notification =
    useNotification();


  /* ============================================================
     TEMA
     ============================================================ */

  const [
    isDark,
    setIsDark
  ] = useState(
    () =>
      localStorage.getItem("theme") ===
      "dark"
  );


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


  const [
    certificateNumber,
    setCertificateNumber
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const handleChange = (
    event
  ) => {

    setCertificateNumber(
      event.target.value
    );

  };


  const handleSubmit = (event) => {
  event.preventDefault();

  const cleanNumber =
    certificateNumber.trim();

  if (!cleanNumber) {

    notification.success({
      title:
        "Número de constancia requerido",
      description:
        "Escribe el número de constancia para realizar la verificación.",
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

    return;
  }

  notification.success({
    title:
      "Buscando constancia",
    description:
      "Estamos verificando la constancia académica. Espera un momento.",
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

  setLoading(true);

  navigate(
    `/verificar-constancia/${encodeURIComponent(
      cleanNumber
    )}`
  );
};


  return (

    <>

      {/* ======================================================
          MODO CLARO / OSCURO
          ====================================================== */}

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


      {/* ======================================================
          PÁGINA
          ====================================================== */}

      <main
        className={`
            verify-certificate-page
            ${isDark ? "dark" : "light"}
        `}
      >

        <section
          className="
            verify-certificate-card
            animated-border
          "
        >

          {/* ======================================================
              ICONO
              ====================================================== */}

          <div
            className="
              private-icon-button
              private-icon-button-blue
              verify-certificate-icon
            "
            aria-hidden="true"
          >

            <i
              className="
                bi bi-patch-check-fill
              "
            />

          </div>


          {/* ======================================================
              ENCABEZADO
              ====================================================== */}

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
              Verificación pública
            </span>


            <h1>
              Verificar constancia
            </h1>


            <p>
              Comprueba la autenticidad de una
              constancia académica mediante su
              número de identificación.
            </p>

          </div>


          {/* ======================================================
              FORMULARIO
              ====================================================== */}

          <form
            className="
              verify-certificate-form
            "
            onSubmit={handleSubmit}
          >

            <div
              className="
                verify-certificate-field
              "
            >

              <label
                htmlFor="certificate-number"
              >
                Número de constancia
              </label>


              <div
                className="
                  verify-certificate-input-wrapper
                "
              >

                <i
                  className="
                    bi bi-file-earmark-text
                  "
                  aria-hidden="true"
                />


                <input
                  id="certificate-number"
                  type="text"
                  value={certificateNumber}
                  onChange={handleChange}
                  placeholder="Ingresa el número de constancia"
                  autoComplete="off"
                  spellCheck="false"
                  disabled={loading}
                />

              </div>

            </div>


            <button
              type="submit"
              className="
                app-button
                app-button-blue
                verify-certificate-submit
              "
              disabled={loading}
            >

              <i
                className={
                  loading
                    ? "bi bi-hourglass-split"
                    : "bi bi-search"
                }
                aria-hidden="true"
              />


              <span>
                {loading
                  ? "Verificando..."
                  : "Verificar constancia"}
              </span>

            </button>

          </form>


          {/* ======================================================
              INFORMACIÓN
              ====================================================== */}

          <div
            className="
              verify-certificate-info
              verify-certificate-info-spaced
            "
          >

            <div
              className="
                verify-certificate-info-icon
              "
            >

              <i
                className="
                  bi bi-shield-check
                "
                aria-hidden="true"
              />

            </div>


            <div>

              <strong>
                Verificación oficial
              </strong>

              <p>
                También puedes utilizar el código
                QR incluido en la constancia para
                acceder directamente a su información
                de verificación.
              </p>

            </div>

          </div>


          {/* ======================================================
              VOLVER AL CV
              ====================================================== */}

          <a
            href={import.meta.env.BASE_URL}
            className="
              app-button
              app-button-blue
              verify-certificate-submit
              verify-certificate-back-button
            "
          >

            <i
              className="bi bi-arrow-left"
              aria-hidden="true"
            />

            <span>
              Volver al CV
            </span>

          </a>


          {/* ======================================================
              PIE
              ====================================================== */}

          <div
            className="
              verify-certificate-footer
            "
          >

            <i
              className="
                bi bi-lock
              "
              aria-hidden="true"
            />

            <span>
              La consulta es pública y no requiere
              iniciar sesión.
            </span>

          </div>

        </section>

      </main>

    </>

  );

}


export default VerifyCertificateSearch;