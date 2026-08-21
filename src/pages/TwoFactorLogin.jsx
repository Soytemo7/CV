import {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  verifyTwoFactorLogin
} from "../services/twoFactorService.js";

import {
  useNotification
} from "../hooks/useNotification";

import ThemeToggle
  from "../components/common/ThemeToggle";

import "../styles/private/two-factor.css";


function TwoFactorLogin() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const notification =
    useNotification();


  const [
    challenge,
    setChallenge
  ] = useState(
    location.state?.challenge || null
  );


  const [
    method,
    setMethod
  ] = useState("token");


  const [
    value,
    setValue
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    isDark,
    setIsDark
  ] = useState(() => {

    return (
      localStorage.getItem("theme") === "dark"
    );

  });


  useEffect(() => {

    if (!challenge) {

      notification.error({

        title:
          "Autenticación no válida",

        description:
          "No existe un proceso de autenticación 2FA válido.",

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
          "welcome-notification"

      });


      navigate(
        "/login",
        {
          replace:
            true
        }
      );

    }

  }, [
    challenge,
    navigate,
    notification
  ]);


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

  }, [isDark]);


  const handleChange =
    event => {

      let nextValue =
        event.target.value;


      if (
        method === "token"
      ) {

        nextValue =
          nextValue
            .replace(/\D/g, "")
            .slice(0, 6);

      }


      setValue(
        nextValue
      );

    };


  const handleSubmit =
    async event => {

      event.preventDefault();


      if (loading) {
        return;
      }


      if (!challenge) {
        return;
      }


      if (
        method === "token" &&
        !/^\d{6}$/.test(value)
      ) {

        notification.error({

          title:
            "Código no válido",

          description:
            "Introduce el código TOTP de 6 dígitos.",

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
            "welcome-notification"

        });

        return;
      }


      if (
        method === "recovery" &&
        !value.trim()
      ) {

        notification.error({

          title:
            "Código requerido",

          description:
            "Introduce un código de recuperación.",

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
            "welcome-notification"

        });

        return;
      }


      try {

        setLoading(true);


        const data =
          method === "token"

            ? await verifyTwoFactorLogin({

                challenge,

                token:
                  value

              })

            : await verifyTwoFactorLogin({

                challenge,

                recoveryCode:
                  value

              });


        if (
          !data?.success
        ) {

          throw new Error(
            "No fue posible completar la autenticación."
          );

        }


        notification.success({

          title:
            "Autenticación completada",

          description:
            "Has iniciado sesión correctamente.",

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
            "welcome-notification"

        });


        navigate(
          "/dashboard",
          {
            replace:
              true
          }
        );

      } catch (error) {

        console.error(
          "❌ Error 2FA:",
          error
        );


        notification.error({

          title:
            "Autenticación no válida",

          description:
            error.message ||
            "El código de autenticación no es válido.",

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
            "welcome-notification"

        });


        setValue("");

      } finally {

        setLoading(false);

      }

    };


  return (

    <div
      className={
        `login-page ${
          isDark
            ? "dark"
            : "light"
        }`
      }
    >

      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
      />


      <div className="login-container login-container2">

        <div className="login-box login-box2">

          <div className="two-factor-panel">


            {/* ====================================================
               ICONO
               ==================================================== */}

            <div className="two-factor-panel-icon">

              <i className="bi bi-shield-lock" />

            </div>


            {/* ====================================================
               ENCABEZADO
               ==================================================== */}

            <h3>
              Verificación de seguridad
            </h3>


            <p>
              Tu cuenta tiene activada la
              autenticación de dos factores.
              Introduce el código solicitado
              para completar el inicio de sesión.
            </p>


            {/* ====================================================
               MÉTODOS
               ==================================================== */}

            <div className="two-factor-methods">

              <button
                type="button"
                className={
                  method === "token"
                    ? "active"
                    : ""
                }
                onClick={() => {

                  setMethod("token");
                  setValue("");

                }}
                disabled={loading}
              >

                <i className="bi bi-shield-lock" />

                <span>
                  Código TOTP
                </span>

              </button>


              <button
                type="button"
                className={
                  method === "recovery"
                    ? "active"
                    : ""
                }
                onClick={() => {

                  setMethod("recovery");
                  setValue("");

                }}
                disabled={loading}
              >

                <i className="bi bi-key" />

                <span>
                  Código de recuperación
                </span>

              </button>

            </div>


            {/* ====================================================
               FORMULARIO
               ==================================================== */}

            <form
              className="two-factor-form"
              onSubmit={handleSubmit}
            >

              <input
                type="text"
                inputMode={
                  method === "token"
                    ? "numeric"
                    : "text"
                }
                autoComplete="one-time-code"
                placeholder={
                  method === "token"
                    ? "000000"
                    : "Código de recuperación"
                }
                value={value}
                onChange={handleChange}
                disabled={loading}
                maxLength={
                  method === "token"
                    ? 6
                    : 8
                }
                className="two-factor-token-input"
                autoFocus
              />


              <button
                type="submit"
                className="private-primary-button"
                disabled={
                  loading ||
                  !value.trim()
                }
              >

                <i className="bi bi-shield-check" />

                <span>
                  {loading
                    ? "Verificando..."
                    : "Verificar y continuar"
                  }
                </span>

              </button>

            </form>


            {/* ====================================================
               CANCELAR
               ==================================================== */}

            <button
              type="button"
              className="private-secondary-button two-factor-cancel-button"
              onClick={() =>
                navigate(
                  "/login",
                  {
                    replace:
                      true
                  }
                )
              }
              disabled={loading}
            >

              <i className="bi bi-arrow-left" />

              <span>
                Cancelar inicio de sesión
              </span>

            </button>


          </div>

        </div>

      </div>

    </div>

  );

}


export default TwoFactorLogin;