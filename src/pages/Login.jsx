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
  LoadingOutlined
} from "@ant-design/icons";

function Login() {

  console.log("URL:", window.location.origin);
  console.log("localStorage:", { ...localStorage });

  const { login } = useContext(AuthContext);
  const notification = useNotification();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  /*
   * 0 = Credenciales
   * 1 = Verificando
   * 2 = Acceso
   */
  const [currentStep, setCurrentStep] = useState(0);

  /*
   * process = proceso
   * finish  = correcto
   * error   = error
   */
  const [stepStatus, setStepStatus] = useState("process");


  /*==============================================================
  # Theme
  ==============================================================*/

  useEffect(() => {

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
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


  /*==============================================================
  # Input Change
  ==============================================================*/

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    /*
     * Si el usuario empieza nuevamente a escribir
     * después de un error, regresamos manualmente
     * al primer paso.
     *
     * NO existe ningún reset automático por tiempo.
     */
    if (stepStatus === "error") {

      setCurrentStep(0);
      setStepStatus("process");

    }

  };


  /*==============================================================
  # Login
  ==============================================================*/

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (loading) {
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;


    /*--------------------------------------------------------------
    # Validación - Datos incompletos
    --------------------------------------------------------------*/

    if (!email || !password) {

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Datos incompletos",
        description: "Correo y contraseña son obligatorios.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

      return;
    }


    /*--------------------------------------------------------------
    # Validación - Contraseña
    --------------------------------------------------------------*/

    if (password.length < 8 || password.length > 128) {

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Credenciales no válidas",
        description: "Las credenciales proporcionadas no son válidas.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

      return;
    }


    /*--------------------------------------------------------------
    # Login
    --------------------------------------------------------------*/

    try {

      setLoading(true);

      /*
       * PASO 2
       *
       * Inicia la verificación.
       */
      setCurrentStep(1);
      setStepStatus("process");

      const data = await login(email, password);

      console.log("✅ Login correcto:", data);


      /*
       * PASO 3
       *
       * Acceso correcto.
       */
      setCurrentStep(2);
      setStepStatus("finish");

      notification.success({
        title: "Inicio de sesión correcto",
        description: "Has iniciado sesión correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });


      /*
       * Solamente navegamos al dashboard.
       *
       * NO reseteamos los Steps.
       */
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (error) {

      console.error("❌ Error login:", error);


      /*------------------------------------------------------------
      # Error - Paso 2
      ------------------------------------------------------------*/

      /*
       * El paso 2 queda permanentemente en ERROR
       * hasta que el usuario vuelva a interactuar.
       */
      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Error al iniciar sesión",
        description:
          error?.message ||
          "No fue posible iniciar sesión. Verifica tus credenciales.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

      /*
       * Limpiamos los campos.
       *
       * El Stepper NO se modifica.
       */
      setFormData({
        email: "",
        password: ""
      });

    } finally {

      /*
       * loading solamente controla
       * el estado de los botones/campos.
       *
       * NO modifica el Stepper.
       */
      setLoading(false);

    }

  };


  /*==============================================================
  # Render
  ==============================================================*/

  return (

    <div className={`login-page ${isDark ? "dark" : "light"}`}>

      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
      />


      {/*------------------------------------------------------------
      # Login Steps
      ------------------------------------------------------------*/}

      <div className="login-steps">

        <Steps
          current={currentStep}
          items={[
            {
              title: "Credenciales",
              icon: <UserOutlined />
            },
            {
              title: "Verificando",
              status: stepStatus === "error" ? "error" : undefined,
              icon:
                stepStatus === "error"
                  ? <SafetyOutlined />
                  : loading
                    ? <LoadingOutlined />
                    : <SafetyOutlined />
            },
            {
              title: "Acceso",
              status: stepStatus === "finish" ? "finish" : undefined,
              icon: <LoginOutlined />
            }
          ]}
        />

      </div>


      {/*------------------------------------------------------------
      # Login Container
      ------------------------------------------------------------*/}

      <div className="login-container">

        <div className="login-box">

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/*--------------------------------------------------------
            # Security Icon
            --------------------------------------------------------*/}

            <div className="login-logo">

              <div className="login-shield">

                <span className="login-shield-check"></span>

              </div>

            </div>


            {/*--------------------------------------------------------
            # Header
            --------------------------------------------------------*/}

            <span className="login-header">
              ¡Bienvenido!
            </span>


            {/*--------------------------------------------------------
            # Email
            --------------------------------------------------------*/}

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Correo electrónico"
              className="login-input"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />


            {/*--------------------------------------------------------
            # Password
            --------------------------------------------------------*/}

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              className="login-input"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
            />


            {/*--------------------------------------------------------
            # Login Button
            --------------------------------------------------------*/}

            <button
              type="submit"
              className="login-button login-sign-in"
              disabled={loading}
            >

              {loading
                ? "Verificando..."
                : "Iniciar sesión"
              }

            </button>


            {/*--------------------------------------------------------
            # Google Login
            --------------------------------------------------------*/}

            <button
              type="button"
              className="login-button login-google"
              disabled={loading}
            >

              <svg
                className="login-google-icon"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >

                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />

                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />

                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />

                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />

              </svg>

              <span>
                Iniciar sesión con Google
              </span>

            </button>


            {/*--------------------------------------------------------
            # Footer
            --------------------------------------------------------*/}

            <p className="login-footer">

              ¿No tienes una cuenta?

              <a
                href="#"
                className="login-link"
                onClick={(event) => {

                  event.preventDefault();

                  navigate("/register");

                }}
              >
                ¡Regístrate, es gratis!
              </a>

              <br />

              <a
                href="#"
                className="login-link"
              >
                ¿Olvidaste tu contraseña?
              </a>

            </p>

          </form>

        </div>

      </div>

    </div>

  );

}

export default Login;