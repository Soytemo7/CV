import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../hooks/useNotification";

function Dashboard() {

  const { user, logout } = useContext(AuthContext);
  const notification = useNotification();

  const handleLogout = async () => {

    try {

      await logout();

      notification.success({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } catch (error) {

      console.error("❌ Error cerrando sesión:", error);
      
      notification.error({
        title: "Error",
        description: "No fue posible cerrar la sesión.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });
    

    }

  };

  return (
    <main>

      <h1>Dashboard privado</h1>

      <p>
        Usuario: {user?.name || "Sin nombre"}
      </p>

      <p>
        Correo: {user?.email}
      </p>

      <button
        type="button"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>

    </main>
  );
}

export default Dashboard;