import { useEffect, useState } from "react";
import { useNotification } from "../hooks/useNotification";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Steps } from "antd";
import {
  LockOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";

import { resetPassword } from "../services/authService.js";

import "../styles/login.css";

import ThemeToggle from "../components/common/ThemeToggle";


function ResetPassword() {

  const notification = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  /*==============================================================
  # Código de recuperación
  ==============================================================*/

  const oobCode = searchParams.get("oobCode");


  /*==============================================================
  # Theme
  ==============================================================*/

  const [isDark, setIsDark] = useState(() => {

    return localStorage.getItem("theme") === "dark";

  });


  /*==============================================================
  # Form
  ==============================================================*/

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });


  const [loading, setLoading] = useState(false);


  /*
   * 0 = Nueva contraseña
   * 1 = Verificando
   * 2 = Contraseña actualizada
   */

  const [currentStep, setCurrentStep] = useState(0);


  /*
   * process = proceso
   * finish  = correcto
   * error   = error
   */

  const [stepStatus, setStepStatus] = useState("process");


  /*==============================================================
  # Password Rules
  ==============================================================*/

  const passwordRules = [
    {
      label: "Mínimo 8 caracteres",
      valid: formData.password.length >= 8
    },
    {
      label: "Máximo 50 caracteres",
      valid: formData.password.length <= 50
    },
    {
      label: "Una letra mayúscula",
      valid: /[A-Z]/.test(formData.password)
    },
    {
      label: "Una letra minúscula",
      valid: /[a-z]/.test(formData.password)
    },
    {
      label: "Un número",
      valid: /[0-9]/.test(formData.password)
    },
    {
      label: "Un carácter especial",
      valid: /[^A-Za-z0-9]/.test(formData.password)
    },
    {
      label: "Las contraseñas coinciden",
      valid:
        formData.password !== "" &&
        formData.password === formData.confirmPassword
    }
  ];


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

    const {
      name,
      value
    } = event.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));


    /*
     * Si anteriormente hubo un error,
     * regresamos al primer paso.
     */

    if (stepStatus === "error") {

      setCurrentStep(0);
      setStepStatus("process");

    }

  };


  /*==============================================================
  # Cambiar contraseña
  ==============================================================*/

  const handleSubmit = async (event) => {

    event.preventDefault();


    if (loading) {
      return;
    }


    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;


    /*--------------------------------------------------------------
    # Verificar oobCode
    --------------------------------------------------------------*/

    if (!oobCode) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Enlace no válido",

        description:
          "El enlace de recuperación no es válido o está incompleto.",

        placement: "topRight",

        duration: 10,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className: "welcome-notification",

      });


      return;

    }


    /*--------------------------------------------------------------
    # Contraseña obligatoria
    --------------------------------------------------------------*/

    if (!password || !confirmPassword) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Datos incompletos",

        description:
          "Debes ingresar y confirmar tu nueva contraseña.",

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
    # Longitud
    --------------------------------------------------------------*/

    if (
      password.length < 8 ||
      password.length > 50
    ) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Contraseña no válida",

        description:
          "La contraseña debe tener entre 8 y 50 caracteres.",

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
    # Mayúscula
    --------------------------------------------------------------*/

    if (!/[A-Z]/.test(password)) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Contraseña no válida",

        description:
          "La contraseña debe contener al menos una letra mayúscula.",

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
    # Minúscula
    --------------------------------------------------------------*/

    if (!/[a-z]/.test(password)) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Contraseña no válida",

        description:
          "La contraseña debe contener al menos una letra minúscula.",

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
    # Número
    --------------------------------------------------------------*/

    if (!/[0-9]/.test(password)) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Contraseña no válida",

        description:
          "La contraseña debe contener al menos un número.",

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
    # Carácter especial
    --------------------------------------------------------------*/

    if (!/[^A-Za-z0-9]/.test(password)) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Contraseña no válida",

        description:
          "La contraseña debe contener al menos un carácter especial.",

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
    # Confirmar contraseña
    --------------------------------------------------------------*/

    if (password !== confirmPassword) {

      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "Las contraseñas no coinciden",

        description:
          "La nueva contraseña y su confirmación deben coincidir.",

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

      setCurrentStep(1);
      setStepStatus("process");


      await resetPassword(
        oobCode,
        password
      );


      /*------------------------------------------------------------
      # Éxito
      ------------------------------------------------------------*/

      setCurrentStep(2);
      setStepStatus("finish");


      notification.success({

        title: "Contraseña actualizada",

        description:
          "Tu contraseña se cambió correctamente. Ya puedes iniciar sesión.",

        placement: "topRight",

        duration: 10,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className: "welcome-notification",

      });


      setFormData({
        password: "",
        confirmPassword: ""
      });


      /*
       * Después de unos segundos
       * regresamos al login.
       */

      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      console.error(
        "❌ Error restableciendo contraseña:",
        error
      );


      setCurrentStep(1);
      setStepStatus("error");


      notification.error({

        title: "No fue posible cambiar la contraseña",

        description:
          error?.message ||
          "El enlace de recuperación no es válido o ha expirado.",

        placement: "topRight",

        duration: 10,

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
              title: "Nueva contraseña",
              icon: <LockOutlined />
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
              title: "Actualizada",

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
      # Reset Layout
      ------------------------------------------------------------*/}

      <div
        className="reset-layout"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(5px)"
        }}
      >


        {/*----------------------------------------------------------
        # Container
        ----------------------------------------------------------*/}

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

                Nueva contraseña

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

                Ingresa tu nueva contraseña
                y confirma el cambio.

              </p>


              {/*------------------------------------------------------
              # Password
              ------------------------------------------------------*/}

              <input

                id="password"

                name="password"

                type="password"

                placeholder="Nueva contraseña"

                className="login-input"

                value={formData.password}

                onChange={handleChange}

                autoComplete="new-password"

                maxLength={50}

                disabled={loading}

              />


              {/*------------------------------------------------------
              # Confirm Password
              ------------------------------------------------------*/}

              <input

                id="confirmPassword"

                name="confirmPassword"

                type="password"

                placeholder="Confirmar contraseña"

                className="login-input"

                value={formData.confirmPassword}

                onChange={handleChange}

                autoComplete="new-password"

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
                  : "Cambiar contraseña"
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


        {/*----------------------------------------------------------
        # Password Rules
        # Fuera de form y login-container
        ----------------------------------------------------------*/}

        <div
          className="password-rules"
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(100% + 18px)",
            transform: "translateX(-50%)",
            width: "220px",
            padding: "14px 16px",
            boxSizing: "border-box",
            borderRadius: "14px",
            background: isDark
              ? "rgba(10, 10, 12, 0.92)"
              : "rgba(255, 255, 255, 0.94)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: isDark
              ? "0 12px 30px rgba(0, 0, 0, 0.35)"
              : "0 12px 30px rgba(0, 0, 0, 0.12)",
            zIndex: 30
          }}
        >

          <div
            style={{
              marginBottom: "8px",
              color: isDark ? "#fff" : "#111",
              fontSize: "13px",
              fontWeight: 700
            }}
          >
            Reglas de contraseña
          </div>


          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px"
            }}
          >

            {passwordRules.map((rule) => (

              <div
                key={rule.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: rule.valid
                    ? "#52c41a"
                    : isDark
                      ? "rgba(255, 255, 255, 0.52)"
                      : "rgba(0, 0, 0, 0.48)",
                  fontSize: "11px",
                  lineHeight: "1.35",
                  transition: "color 0.2s ease"
                }}
              >

                <span
                  style={{
                    width: "12px",
                    flexShrink: 0,
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 700
                  }}
                >

                  {rule.valid
                    ? "✓"
                    : "○"
                  }

                </span>


                <span>
                  {rule.label}
                </span>

              </div>

            ))}

          </div>

        </div>


      </div>

    </div>

  );

}


export default ResetPassword;