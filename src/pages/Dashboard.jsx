import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../hooks/useNotification";


function Dashboard() {

  const {
    user,
    logout,
    logoutAll
  } = useContext(AuthContext);

  const notification = useNotification();


  /*==============================================================
  # Cerrar sesión actual
  ==============================================================*/

  const handleLogout = async () => {

    try {

      await logout();

      notification.success({
        title: "Sesión cerrada",
        description:
          "Has cerrado sesión correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } catch (error) {

      console.error(
        "❌ Error cerrando sesión:",
        error
      );

      notification.error({
        title: "Error",
        description:
          error?.message ||
          "No fue posible cerrar la sesión.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    }

  };


  /*==============================================================
  # Cerrar todas las sesiones
  ==============================================================*/

  const handleLogoutAll = async () => {

    try {

      await logoutAll();

      notification.success({
        title: "Sesiones cerradas",
        description:
          "Todas las sesiones activas han sido cerradas correctamente.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    } catch (error) {

      console.error(
        "❌ Error cerrando todas las sesiones:",
        error
      );

      notification.error({
        title: "Error",
        description:
          error?.message ||
          "No fue posible cerrar todas las sesiones.",
        placement: "topRight",
        duration: 8,
        showProgress: true,
        pauseOnHover: true,
        closable: true,
        className: "welcome-notification",
      });

    }

  };


  /*==============================================================
  # Render
  ==============================================================*/

  return (

    <main>

      <h1>
        Dashboard privado
      </h1>


      <section>

        <h2>
          Información de la cuenta
        </h2>

        <p>
          <strong>Usuario:</strong>{" "}
          {user?.name || "Sin nombre"}
        </p>

        <p>
          <strong>Correo:</strong>{" "}
          {user?.email || "Sin correo"}
        </p>

      </section>


      <section>

        <h2>
          Seguridad
        </h2>

        <p>
          Administra las sesiones activas de tu cuenta.
        </p>


        <div>

          <button
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>


          <button
            type="button"
            onClick={handleLogoutAll}
          >
            Cerrar todas las sesiones
          </button>

        </div>

      </section>

    </main>

  );

}


export default Dashboard;