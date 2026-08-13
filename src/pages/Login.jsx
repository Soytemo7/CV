import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../hooks/useNotification";

function Login() {

  const { login } = useContext(AuthContext);
  const notification = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Correo y contraseña son obligatorios.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Las credenciales no son válidas.");
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

    } catch (error) {

      console.error("❌ Error login:", error);

      setError(error.message);

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

    } finally {

      setLoading(false);

    }

  };

  return (
    <form onSubmit={handleSubmit}>

      <div>
        <label htmlFor="email">
          Correo electrónico
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password">
          Contraseña
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={loading}
        />
      </div>

      {error && (
        <p>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        disabled={loading}
      >
        Ir al Dashboard
      </button>

    </form>
  );
}

export default Login;