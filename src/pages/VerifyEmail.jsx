import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Steps } from "antd";
import {
  MailOutlined,
  SafetyOutlined,
  LoginOutlined,
  LoadingOutlined
} from "@ant-design/icons";

import { verifyEmail } from "../services/authService.js";
import { useNotification } from "../hooks/useNotification";
import ThemeToggle from "../components/common/ThemeToggle";

import "../styles/login.css";


function VerifyEmail() {

  const navigate = useNavigate();
  const notification = useNotification();
  const [searchParams] = useSearchParams();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);


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
  # Verificar correo
  ==============================================================*/

  useEffect(() => {

    const executeVerification = async () => {

      const oobCode = searchParams.get("oobCode");


      if (!oobCode) {

        setLoading(false);
        setSuccess(false);

        notification.error({
          title: "Enlace no válido",
          description:
            "El enlace de verificación no contiene un código válido.",
          placement: "topRight",
          duration: 8,
          showProgress: true,
          pauseOnHover: true,
          closable: true,
          className: "welcome-notification"
        });

        return;
      }


      try {

        await verifyEmail(oobCode);

        setSuccess(true);
        setLoading(false);

        notification.success({
          title: "Correo verificado",
          description:
            "Tu correo electrónico ha sido confirmado correctamente.",
          placement: "topRight",
          duration: 8,
          showProgress: true,
          pauseOnHover: true,
          closable: true,
          className: "welcome-notification"
        });


      } catch (error) {

        console.error(
          "❌ Error verificando correo:",
          error
        );

        setSuccess(false);
        setLoading(false);

        notification.error({
          title: "No fue posible verificar el correo",
          description:
            error?.message ||
            "El enlace no es válido o ha expirado.",
          placement: "topRight",
          duration: 8,
          showProgress: true,
          pauseOnHover: true,
          closable: true,
          className: "welcome-notification"
        });

      }

    };


    executeVerification();

  }, [searchParams, notification]);


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
      # Steps
      ------------------------------------------------------------*/}

      <div className="login-steps">

        <Steps
          current={success ? 2 : loading ? 1 : 1}
          status={!loading && !success ? "error" : undefined}
          items={[
            {
              title: "Solicitud",
              icon: <MailOutlined />
            },
            {
              title: loading
                ? "Verificando"
                : success
                  ? "Verificado"
                  : "Error",
              icon: loading
                ? <LoadingOutlined />
                : <SafetyOutlined />
            },
            {
              title: "Acceso",
              icon: <LoginOutlined />
            }
          ]}
        />

      </div>


      {/*------------------------------------------------------------
      # Container
      ------------------------------------------------------------*/}

      <div className="login-container">

        <div className="login-box">

          <div className="login-form">


            {/*--------------------------------------------------------
            # Icon
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

              {loading
                ? "Verificando correo..."
                : success
                  ? "¡Correo verificado!"
                  : "Enlace no válido"
              }

            </span>


            {/*--------------------------------------------------------
            # Description
            --------------------------------------------------------*/}

            <p
              style={{
                textAlign: "center",
                margin: "10px 0 20px",
                lineHeight: "1.5",
                opacity: 0.75
              }}
            >

              {loading
                ? "Estamos confirmando tu dirección de correo electrónico."
                : success
                  ? "Tu cuenta ya está verificada. Ahora puedes iniciar sesión."
                  : "El enlace de verificación no es válido o ha expirado."
              }

            </p>


            {/*--------------------------------------------------------
            # Button
            --------------------------------------------------------*/}

            {!loading && (

              <button
                type="button"
                className="login-button login-sign-in"
                onClick={() => navigate("/login")}
              >

                {success
                  ? "Iniciar sesión"
                  : "Volver al inicio de sesión"
                }

              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}


export default VerifyEmail;