import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../hooks/useNotification";
import "../styles/login.css";
import "../styles/register.css";
import ThemeToggle from "../components/common/ThemeToggle";
import { Steps } from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  LoginOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";

function Register() {

  const {
    register,
    loginWithGoogle
  } = useContext(AuthContext);

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);


  /*
   * 0 = Datos
   * 1 = Verificando
   * 2 = Cuenta creada
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
     * Si el registro anterior terminó en error
     * y el usuario vuelve a escribir,
     * regresamos manualmente al primer paso.
     *
     * NO existe ningún reset automático por tiempo.
     */
    if (stepStatus === "error") {

      setCurrentStep(0);
      setStepStatus("process");

    }

  };


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
  # Register
  ==============================================================*/

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (loading) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;


    /*--------------------------------------------------------------
    # Validación - Datos incompletos
    --------------------------------------------------------------*/

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Datos incompletos",
        description:
          "Nombre, correo, contraseña y confirmación de contraseña son obligatorios.",
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
    # Validación - Nombre
    --------------------------------------------------------------*/

    if (name.length < 2 || name.length > 100) {

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Nombre no válido",
        description:
          "El nombre debe tener entre 2 y 100 caracteres.",
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
    # Validación - Correo
    --------------------------------------------------------------*/

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Correo no válido",
        description:
          "El correo electrónico no tiene un formato válido.",
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
    # Validación - Longitud de contraseña
    --------------------------------------------------------------*/

    if (password.length < 8 || password.length > 50) {

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
    # Validación - Mayúscula
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
    # Validación - Minúscula
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
    # Validación - Número
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
    # Validación - Carácter especial
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
    # Validación - Confirmación de contraseña
    --------------------------------------------------------------*/

    if (password !== confirmPassword) {

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Contraseñas no coinciden",
        description:
          "La contraseña y su confirmación deben ser exactamente iguales.",
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
    # Registro
    --------------------------------------------------------------*/

    try {

      setLoading(true);

      setCurrentStep(1);
      setStepStatus("process");

      const data = await register(
        name,
        email,
        password
      );

      console.log("✅ Registro correcto:", data);

      setCurrentStep(2);
      setStepStatus("finish");


      /*------------------------------------------------------------
      # Notificación de éxito
      ------------------------------------------------------------*/

      notification.success({
        title: "Registro exitoso",
        description:
          "Tu cuenta ha sido creada correctamente. Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });


      /*------------------------------------------------------------
      # Limpiar formulario
      ------------------------------------------------------------*/

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });


      /*------------------------------------------------------------
      # Redirección automática
      ------------------------------------------------------------*/

      setTimeout(() => {
        navigate("/login");
      }, 1800);


    } catch (error) {

      console.error("❌ Error registro:", error);

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Error en el registro",
        description:
          error?.message ||
          "No fue posible crear la cuenta. Intenta nuevamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

      setFormData((previous) => ({
        ...previous,
        password: "",
        confirmPassword: ""
      }));


    } finally {

      setLoading(false);

    }

  };


  /*==============================================================
  # Google Register
  ==============================================================*/

  const handleGoogleSuccess = async (credentialResponse) => {

    if (loading) {
      return;
    }

    try {

      setLoading(true);

      setCurrentStep(1);
      setStepStatus("process");

      const data = await loginWithGoogle(
        credentialResponse.credential
      );

      console.log("✅ Google correcto:", data);

      setCurrentStep(2);
      setStepStatus("finish");

      notification.success({
         title: "Registro exitoso",
        description:
          "Tu cuenta ha sido creada correctamente mediante Google.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      console.error("❌ Error Google:", error);

      setCurrentStep(1);
      setStepStatus("error");

      notification.error({
        title: "Error con Google",
        description:
          error?.message ||
          "No fue posible completar el registro con Google.",
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
  # Google Error
  ==============================================================*/

  const handleGoogleError = () => {

    setCurrentStep(1);
    setStepStatus("error");

    notification.error({
      title: "Google",
      description:
        "No fue posible completar la autenticación con Google.",
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

    <div className={`login-page register-page ${isDark ? "dark" : "light"}`}>

      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
      />


      {/*------------------------------------------------------------
      # Register Steps
      ------------------------------------------------------------*/}

      <div className="login-steps">

        <Steps
          current={currentStep}
          status={stepStatus}
          items={[
            {
              title: "Datos",
              icon: <UserOutlined />
            },
            {
              title: "Verificando",
              icon: loading
                ? <LoadingOutlined />
                : <SafetyOutlined />
            },
            {
              title: "Cuenta creada",
              icon: <LoginOutlined />
            }
          ]}
        />

      </div>


      {/*------------------------------------------------------------
      # Register Layout
      ------------------------------------------------------------*/}

      <div
        className="register-layout"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(5px)"
        }}
      >

        {/*----------------------------------------------------------
        # Register Container
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
                ¡Crea tu cuenta!
              </span>


              {/*------------------------------------------------------
              # Name
              ------------------------------------------------------*/}

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre"
                className="login-input"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
              />


              {/*------------------------------------------------------
              # Email
              ------------------------------------------------------*/}

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


              {/*------------------------------------------------------
              # Password
              ------------------------------------------------------*/}

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
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
              # Register Button
              ------------------------------------------------------*/}

              <button
                type="submit"
                className="login-button login-sign-in"
                disabled={loading}
              >

                {loading
                  ? "Creando cuenta..."
                  : "Crear cuenta"
                }

              </button>


              {/*------------------------------------------------------
              # Google Register
              ------------------------------------------------------*/}

              <div
                className="login-google"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}
              >

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

              </div>


              {/*------------------------------------------------------
              # Footer
              ------------------------------------------------------*/}

              <p className="login-footer">

                ¿Ya tienes una cuenta?

                <a
                  href="#"
                  className="login-link"
                  onClick={(event) => {

                    event.preventDefault();

                    navigate("/login");

                  }}
                >
                  Inicia sesión
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
                  {rule.valid ? "✓" : "○"}
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

export default Register;