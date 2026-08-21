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
import { GoogleLogin } from "@react-oauth/google";


function Login() {

  console.log("URL:", window.location.origin);
  console.log("localStorage:", { ...localStorage });


  const {
    login,
    loginWithGoogle
  } = useContext(AuthContext);

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

        setCurrentStep(1);
        setStepStatus("error");

        notification.error({
          title:
            error?.status === 403
              ? "Correo no verificado"
              : "Error al iniciar sesión",

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
  # Login con Google
  ==============================================================*/

  const handleGoogleSuccess = async (credentialResponse) => {

    if (loading) {
      return;
    }


    try {

      setLoading(true);


      /*
       * PASO 2
       *
       * Inicia la verificación con Google.
       */
      setCurrentStep(1);
      setStepStatus("process");


      const data = await loginWithGoogle(
        credentialResponse.credential
      );


      console.log("✅ Google correcto:", data);

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
       * PASO 3
       *
       * Acceso correcto.
       */
      setCurrentStep(2);
      setStepStatus("finish");


      notification.success({
        title: "Inicio de sesión correcto",
        description: "Has iniciado sesión correctamente con Google.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });


      setTimeout(() => {
        navigate("/dashboard");
      }, 700);


    } catch (error) {

      console.error("❌ Error Google:", error);


      /*
       * El backend puede devolver 409 cuando
       * el correo ya existe con contraseña.
       */
      setCurrentStep(1);
      setStepStatus("error");


      notification.error({
        title: "Error con Google",
        description:
          error?.message ||
          "No fue posible iniciar sesión con Google.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });


    } finally {

      setLoading(false);

    }

  };


  /*==============================================================
  # Error Google
  ==============================================================*/

  const handleGoogleError = () => {

    setCurrentStep(1);
    setStepStatus("error");


    notification.error({
      title: "Error con Google",
      description: "No fue posible iniciar sesión con Google.",
      placement: "topRight",
      duration: 8,
      showProgress: true,
      pauseOnHover: true,
      closable: true,
      className: "welcome-notification",
    });

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

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme={isDark ? "filled_black" : "outline"}
              size="large"
              text="continue_with"
              shape="rectangular"
              width="250"
              useOneTap={false}
            />


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
                onClick={(event) => {

                  event.preventDefault();

                  navigate("/forgot-password");

                }}
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