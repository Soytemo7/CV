import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext.jsx";

import { useNotification } from "../hooks/useNotification";

import "../styles/login.css";

import { useNavigate } from "react-router-dom";

import ThemeToggle from "../components/common/ThemeToggle";

import { Steps } from "antd";

import {
  UserOutlined,
  SafetyOutlined,
  LoginOutlined,
  LoadingOutlined,
  KeyOutlined,
  CloseOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";

import { GoogleLogin } from "@react-oauth/google";

import CertificateLogin
  from "../components/auth/CertificateLogin";

import MouseParticleTrail from "../components/common/MouseParticleTrail";


function Login() {

  const {
    login,
    loginWithGoogle,
    loginWithPasskey
  } = useContext(AuthContext);


  const notification =
    useNotification();


  const navigate =
    useNavigate();

  const redirectAfterLogin = (user) => {

    if (user?.role === "admin") {

      navigate("/admin/");

      return;

    }

    navigate("/dashboard");

  };


  // ==========================================================
  // THEME
  // ==========================================================

  const [
    isDark,
    setIsDark
  ] = useState(() => {

    return (
      localStorage.getItem("theme") === "dark"
    );

  });


  // ==========================================================
  // FORMULARIO
  // ==========================================================

  const [
    formData,
    setFormData
  ] = useState({
    email: "",
    password: ""
  });


  // ==========================================================
  // LOADING
  // ==========================================================

  const [
    loading,
    setLoading
  ] = useState(false);


  // ==========================================================
  // STEPS
  // ==========================================================

  /*
   * 0 = Credenciales
   * 1 = Verificando
   * 2 = Acceso
   */

  const [
    currentStep,
    setCurrentStep
  ] = useState(0);


  /*
   * process = proceso
   * finish  = correcto
   * error   = error
   */

  const [
    stepStatus,
    setStepStatus
  ] = useState("process");


  // ==========================================================
  // CERTIFICADO
  // ==========================================================

  const [
    certificateMode,
    setCertificateMode
  ] = useState(false);


  // ==========================================================
  // THEME EFFECT
  // ==========================================================

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


  // ==========================================================
  // CERRAR MODAL CERTIFICADO
  // ==========================================================

  const closeCertificateModal =
    () => {

      if (loading) {
        return;
      }

      setCertificateMode(false);

    };


  // ==========================================================
  // LOGIN CERTIFICADO
  // ==========================================================

  const handleCertificateSuccess =
    (data) => {    

      /*
       * Cerramos el modal antes de continuar.
       */

      setCertificateMode(false);


      /*
       * Si requiere 2FA,
       * vamos al challenge.
       */

      if (
        data?.requiresTwoFactor &&
        data?.challenge
      ) {

        navigate(
          "/two-factor",
          {
            state: {
              challenge:
                data.challenge
            }
          }
        );

        return;
      }


      /*
       * Login completado.
       */

      redirectAfterLogin(
        data?.user
      );

    };


  // ==========================================================
  // PASSKEY LOGIN
  // ==========================================================

  const handlePasskeyLogin =
    async () => {

      if (loading) {
        return;
      }


      try {

        setLoading(true);


        const data =
          await loginWithPasskey();
      

        notification.success({

          title:
            "Autenticación exitosa",

          description:
            "Has iniciado sesión correctamente mediante Passkey.",

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        redirectAfterLogin(
          data?.user
        );

      } catch (error) {      


        let description =
          error?.message ||
          "No fue posible iniciar sesión mediante Passkey.";


        if (
          error?.name ===
          "NotAllowedError"
        ) {

          description =
            "La autenticación mediante Passkey fue cancelada o no fue autorizada.";

        }


        if (
          error?.name ===
          "InvalidStateError"
        ) {

          description =
            "La Passkey seleccionada no está disponible para esta cuenta.";

        }


        notification.error({

          title:
            "Error con Passkey",

          description,

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

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange =
    (event) => {

      const {
        name,
        value
      } = event.target;


      setFormData(
        previous => ({
          ...previous,
          [name]: value
        })
      );


      if (
        stepStatus ===
        "error"
      ) {

        setCurrentStep(0);

        setStepStatus(
          "process"
        );

      }

    };


  // ==========================================================
  // LOGIN NORMAL
  // ==========================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (loading) {
        return;
      }


      const email =
        formData.email
          .trim()
          .toLowerCase();


      const password =
        formData.password;


      // --------------------------------------------------------
      // VALIDACIÓN
      // --------------------------------------------------------

      if (
        !email ||
        !password
      ) {

        setCurrentStep(1);

        setStepStatus(
          "error"
        );


        notification.error({

          title:
            "Datos incompletos",

          description:
            "Correo y contraseña son obligatorios.",

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


      // --------------------------------------------------------
      // PASSWORD
      // --------------------------------------------------------

      if (
        password.length < 8 ||
        password.length > 128
      ) {

        setCurrentStep(1);

        setStepStatus(
          "error"
        );


        notification.error({

          title:
            "Credenciales no válidas",

          description:
            "Las credenciales proporcionadas no son válidas.",

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


      // --------------------------------------------------------
      // LOGIN
      // --------------------------------------------------------

      try {

        setLoading(true);


        setCurrentStep(1);

        setStepStatus(
          "process"
        );


        const data =
          await login(
            email,
            password
          );      


        if (
          data?.requiresTwoFactor &&
          data?.challenge
        ) {

          navigate(
            "/two-factor",
            {
              state: {
                challenge:
                  data.challenge
              }
            }
          );

          return;
        }


        setCurrentStep(2);

        setStepStatus(
          "finish"
        );


        notification.success({

          title:
            "Inicio de sesión correcto",

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


        setTimeout(() => {

          redirectAfterLogin(
            data?.user
          );

        }, 700);


      } catch (error) {

      
        setCurrentStep(1);

        setStepStatus(
          "error"
        );


        notification.error({

          title:
            error?.status === 403
              ? "Correo no verificado"
              : "Error al iniciar sesión",

          description:
            error?.message ||
            "No fue posible iniciar sesión. Verifica tus credenciales.",

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


        setFormData({
          email: "",
          password: ""
        });

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  const handleGoogleSuccess =
    async (credentialResponse) => {

      if (loading) {
        return;
      }


      try {

        setLoading(true);


        setCurrentStep(1);

        setStepStatus(
          "process"
        );


        const data =
          await loginWithGoogle(
            credentialResponse.credential
          );

      
        if (
          data?.requiresTwoFactor &&
          data?.challenge
        ) {

          navigate(
            "/two-factor",
            {
              state: {
                challenge:
                  data.challenge
              }
            }
          );

          return;
        }


        setCurrentStep(2);

        setStepStatus(
          "finish"
        );


        notification.success({

          title:
            "Inicio de sesión correcto",

          description:
            "Has iniciado sesión correctamente con Google.",

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


        setTimeout(() => {

         redirectAfterLogin(
            data?.user
          );

        }, 700);


      } catch (error) {       


        setCurrentStep(1);

        setStepStatus(
          "error"
        );


        notification.error({

          title:
            "Error con Google",

          description:
            error?.message ||
            "No fue posible iniciar sesión con Google.",

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

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // GOOGLE ERROR
  // ==========================================================

  const handleGoogleError =
    () => {

      setCurrentStep(1);

      setStepStatus(
        "error"
      );


      notification.error({

        title:
          "Error con Google",

        description:
          "No fue posible iniciar sesión con Google.",

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

    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className={`login-page ${
        isDark
          ? "dark"
          : "light"
      }`}
    >

      <MouseParticleTrail />


      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
      />


      {/* ======================================================
          STEPS
      ====================================================== */}

      <div className="login-steps">

        <Steps

          current={
            currentStep
          }

          items={[

            {
              title:
                "Credenciales",

              icon:
                <UserOutlined />

            },

            {
              title:
                "Verificando",

              status:
                stepStatus === "error"
                  ? "error"
                  : undefined,

              icon:
                stepStatus === "error"

                  ? <SafetyOutlined />

                  : loading

                    ? <LoadingOutlined />

                    : <SafetyOutlined />

            },

            {
              title:
                "Acceso",

              status:
                stepStatus === "finish"
                  ? "finish"
                  : undefined,

              icon:
                <LoginOutlined />

            }

          ]}

        />

      </div>


      {/* ======================================================
          LOGIN
      ====================================================== */}

      <div className="login-container">

        <div className="login-box">

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/* ==================================================
                LOGO
            ================================================== */}

            <div className="login-logo">

              <div className="login-shield">

                <span className="login-shield-check"></span>

              </div>

            </div>


            {/* ==================================================
                HEADER
            ================================================== */}

            <span className="login-header">

              ¡Bienvenido!

            </span>


            {/* ==================================================
                EMAIL
            ================================================== */}

            <input

              id="email"

              name="email"

              type="email"

              placeholder="Correo electrónico"

              className="login-input"

              value={
                formData.email
              }

              onChange={
                handleChange
              }

              autoComplete="email"

              disabled={
                loading
              }

            />


            {/* ==================================================
                PASSWORD
            ================================================== */}

            <input

              id="password"

              name="password"

              type="password"

              placeholder="Contraseña"

              className="login-input"

              value={
                formData.password
              }

              onChange={
                handleChange
              }

              autoComplete="current-password"

              disabled={
                loading
              }

            />


            {/* ==================================================
                LOGIN NORMAL
            ================================================== */}

            <button

              type="submit"

              className="login-button login-sign-in"

              disabled={
                loading
              }

            >

              {
                loading
                  ? "Verificando..."
                  : "Iniciar sesión"
              }

            </button>


            {/* ==================================================
                PASSKEY
            ================================================== */}

            <button

              type="button"

              className="login-button login-passkey"

              onClick={
                handlePasskeyLogin
              }

              disabled={
                loading
              }

            >

              <KeyOutlined />

              <span>

                {
                  loading
                    ? "Autenticando..."
                    : "Iniciar sesión con Passkey"
                }

              </span>

            </button>


            {/* ==================================================
                CERTIFICADO
            ================================================== */}

            <button

              type="button"

              className="login-button login-passkey"

              onClick={() =>
                setCertificateMode(true)
              }

              disabled={
                loading
              }

            >

              <SafetyCertificateOutlined />

              <span>

                Iniciar sesión con certificado

              </span>

            </button>


            {/* ==================================================
                GOOGLE
            ================================================== */}

            <GoogleLogin

              onSuccess={
                handleGoogleSuccess
              }

              onError={
                handleGoogleError
              }

              theme={
                isDark
                  ? "filled_black"
                  : "outline"
              }

              size="large"

              text="continue_with"

              shape="rectangular"

              width="250"

              useOneTap={false}

            />


            {/* ==================================================
                FOOTER
            ================================================== */}

            <p className="login-footer">

              ¿No tienes una cuenta?


              <a

                href="#"

                className="login-link"

                onClick={(event) => {

                  event.preventDefault();

                  navigate(
                    "/register"
                  );

                }}

              >

                ¡Regístrate, es gratis!

              </a>


              <br />


              <a

                href="#"

                className="login-link"

                onClick={(event) => {

                  event.preventDefault();

                  navigate(
                    "/forgot-password"
                  );

                }}

              >

                ¿Olvidaste tu contraseña?

              </a>

            </p>


          </form>

        </div>

      </div>


      {/* ======================================================
          MODAL PERSONALIZADO — CERTIFICADO
      ====================================================== */}

      {certificateMode && (

        <div

          className="certificate-modal-overlay"

          role="dialog"

          aria-modal="true"

          aria-labelledby="certificate-modal-title"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeCertificateModal();

            }

          }}

        >

          <div
            className={`certificate-modal ${
              isDark
                ? "dark"
                : "light"
            }`}
          >


            {/* ==================================================
                HEADER MODAL
            ================================================== */}

            <div className="certificate-modal-header">

              <div className="certificate-modal-title">

                <div className="certificate-modal-icon">

                  <SafetyCertificateOutlined />

                </div>

                <div>

                  <h2
                    id="certificate-modal-title"
                  >

                    Autenticación por certificado

                  </h2>

                  <p>

                    Utiliza tu certificado Ed25519 para iniciar sesión.

                  </p>

                </div>

              </div>


              <button

                type="button"

                className="certificate-modal-close"

                onClick={
                  closeCertificateModal
                }

                disabled={
                  loading
                }

                aria-label="Cerrar"

              >

                <CloseOutlined />

              </button>

            </div>


            {/* ==================================================
                CONTENIDO
            ================================================== */}

            <div className="certificate-modal-body">

              <CertificateLogin

                onSuccess={
                  handleCertificateSuccess
                }

                onLoadingChange={
                  setLoading
                }

              />

            </div>


          </div>

        </div>

      )}

    </div>

  );

}


export default Login;