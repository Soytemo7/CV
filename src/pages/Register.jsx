import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../hooks/useNotification";

function Register() {

  const { register } = useContext(AuthContext);
  const notification = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name || !email || !password) {
      setError("Nombre, correo y contraseña son obligatorios.");
      return;
    }

    if (name.length < 2 || name.length > 100) {
      setError("El nombre debe tener entre 2 y 100 caracteres.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("La contraseña debe tener entre 8 y 128 caracteres.");
      return;
    }

    try {

      setLoading(true);

      const data = await register(
        name,
        email,
        password
      );

      console.log("✅ Registro correcto:", data);

      notification.success({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } catch (error) {

      console.error("❌ Error registro:", error);

      setError(error.message);

      notification.error({
        title: "Error en el registro",
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
        <label htmlFor="name">
          Nombre
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          disabled={loading}
        />
      </div>

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
          autoComplete="new-password"
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
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        disabled={loading}
      >
        Iniciar sesión
      </button>

    </form>
  );
}

export default Register;