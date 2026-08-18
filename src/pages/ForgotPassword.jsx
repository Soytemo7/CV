import { useEffect, useState } from "react";
import { useNotification } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { Steps } from "antd";
import {
  MailOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";

import { forgotPassword } from "../services/authService.js";

import "../styles/login.css";

import ThemeToggle from "../components/common/ThemeToggle";


function ForgotPassword() {

  const notification = useNotification();
  const navigate = useNavigate();


  /*==============================================================
  # Theme
  ==============================================================*/

  const [isDark, setIsDark] = useState(() => {

    return localStorage.getItem("theme") === "dark";

  });


  /*==============================================================
  # Form
  ==============================================================*/

  const [email, setEmail] = useState("");


  const [loading, setLoading] = useState(false);


  /*
   * 0 = Correo
   * 1 = Verificando
   * 2 = Enlace enviado
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

    setEmail(event.target.value);


    /*
     * Si anteriormente hubo un error,
     * regresamos al primer paso cuando
     * el usuario vuelve a escribir.
     */

    if (stepStatus === "error") {

      setCurrentStep(0);
      setStepStatus("process");

    }

  };


  /*==============================================================
  # Recuperar contraseña
  ==============================================================*/

  const handleSubmit = async (event) => {

    event.preventDefault();


    if (loading) {
      return;
    }


    const cleanEmail =
      email.trim().toLowerCase();


    /*--------------------------------------------------------------
    # Validación
    --------------------------------------------------------------*/

    if (!cleanEmail) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Correo requerido",

        description:
          "Ingresa tu correo electrónico.",

        placement: "topRight",

        duration: 8,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className: "welcome-notification",

      });


      return;

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(cleanEmail)) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Correo no válido",

        description:
          "Ingresa un correo electrónico válido.",

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
    # Solicitud
    --------------------------------------------------------------*/

    try {

      setLoading(true);


      /*
       * PASO 2
       *
       * Inicia la solicitud.
       */

      setCurrentStep(1);
      setStepStatus("process");


      await forgotPassword(cleanEmail);


      /*
       * PASO 3
       *
       * Solicitud procesada.
       */

      setCurrentStep(2);
      setStepStatus("finish");


      notification.success({

        title: "Solicitud enviada",

        description:
          "Si existe una cuenta asociada a ese correo, recibirás un enlace para recuperar tu contraseña.",

        placement: "topRight",

        duration: 10,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className: "welcome-notification",

      });


      /*
       * Limpiamos el correo después
       * de completar correctamente.
       */

      setEmail("");


    } catch (error) {

      console.error(
        "❌ Error recuperación:",
        error
      );


      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Error en la recuperación",

        description:
          error?.message ||
          "No fue posible procesar la solicitud.",

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
  # Render
  ==============================================================*/

  return (

    <div
      className={`login-page ${isDark ? "dark" : "light"}`}
    >


      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
      />


      {/*------------------------------------------------------------
      # Steps
      ------------------------------------------------------------*/}

      <div className="login-steps">

        <Steps

          current={currentStep}

          items={[

            {
              title: "Correo",
              icon: <MailOutlined />
            },

            {
              title: "Verificando",

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
              title: "Enviado",

              status:
                stepStatus === "finish"
                  ? "finish"
                  : undefined,

              icon:
                <CheckCircleOutlined />
            }

          ]}

        />

      </div>


      {/*------------------------------------------------------------
      # Container
      ------------------------------------------------------------*/}

      <div className="login-container">

        <div className="login-box">

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/*------------------------------------------------------
            # Security Icon
            ------------------------------------------------------*/}

            <div className="login-logo">

              <div className="login-shield">

                <span className="login-shield-check"></span>

              </div>

            </div>


            {/*------------------------------------------------------
            # Header
            ------------------------------------------------------*/}

            <span className="login-header">

              Recuperar contraseña

            </span>


            {/*------------------------------------------------------
            # Description
            ------------------------------------------------------*/}

            <p
              style={{
                textAlign: "center",
                marginBottom: "20px"
              }}
            >

              Ingresa tu correo electrónico y
              te enviaremos un enlace para
              recuperar tu contraseña.

            </p>


            {/*------------------------------------------------------
            # Email
            ------------------------------------------------------*/}

            <input

              id="email"

              name="email"

              type="email"

              placeholder="Correo electrónico"

              className="login-input"

              value={email}

              onChange={handleChange}

              autoComplete="email"

              disabled={loading}

            />


            {/*------------------------------------------------------
            # Button
            ------------------------------------------------------*/}

            <button

              type="submit"

              className="login-button login-sign-in"

              disabled={loading}

            >

              {loading
                ? "Verificando..."
                : "Enviar enlace"
              }

            </button>


            {/*------------------------------------------------------
            # Footer
            ------------------------------------------------------*/}

            <p className="login-footer">


              <a

                href="#"

                className="login-link"

                onClick={(event) => {

                  event.preventDefault();

                  navigate("/login");

                }}

              >

                ← Volver a iniciar sesión

              </a>


            </p>


          </form>

        </div>

      </div>

    </div>

  );

}


export default ForgotPassword;