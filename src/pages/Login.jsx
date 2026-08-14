import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../hooks/useNotification";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login() {

  const { login } = useContext(AuthContext);
  const notification = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
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

    if (password.length < 8 || password.length > 128) {
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

    try {

      setLoading(true);

      const data = await login(email, password);

      console.log("✅ Login correcto:", data);

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

      navigate("/dashboard");

    } catch (error) {

      console.error("❌ Error login:", error);

      notification.error({
        title: "Error al iniciar sesión",
        description: error.message,
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

      setLoading(false);

    }

  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-box">

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-logo">

              <div className="login-shield">
                <span className="login-shield-check"></span>
              </div>

            </div>

            <span className="login-header">
              ¡Bienvenido!
            </span>

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

            <button
              type="submit"
              className="login-button login-sign-in"
              disabled={loading}
            >
              {loading
                ? "Iniciando sesión..."
                : "Iniciar sesión"
              }
            </button>

            <button
              type="button"
              className="login-button login-google"
              disabled={loading}
            >

              <svg
                className="login-google-icon"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
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