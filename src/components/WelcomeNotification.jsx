import { useEffect } from "react";
import { ConfigProvider, notification } from "antd";
import { useLocation } from "react-router-dom";
import "../styles/welcome-notification.css";

function WelcomeNotification() {
  const [api, contextHolder] = notification.useNotification();
  const location = useLocation(); 

  useEffect(() => {
    const notifications = {
      "/": {
        title: "¡Bienvenido!",
        description:
          "Bienvenido a mi CV profesional.",
      },

      "/login": {
        title: "Inicio de sesión",
        description:
          "Bienvenido al área de acceso.",
      },

      "/register": {
        title: "Crear cuenta",
        description:
          "Regístrate para acceder al sistema.",
      },

      "/forgot-password": {
        title: "Recuperar contraseña",
        description:
          "Solicita un enlace para recuperar el acceso a tu cuenta.",
      },

      "/reset-password": {
        title: "Restablecer contraseña",
        description:
          "Establece una nueva contraseña para tu cuenta.",
      },

      "/dashboard": {
        title: "Panel de control",
        description:
          "Bienvenido a tu panel de control.",
      },
    };

    const currentNotification =
      notifications[location.pathname];

    if (!currentNotification) {
      return;
    }

    api.destroy();

    api.info({
      title: currentNotification.title,

      description:
        currentNotification.description,

      placement:
        window.innerWidth <= 576
          ? "bottom"
          : "bottomRight",

      duration: 8,

      showProgress: true,

      pauseOnHover: true,

      closable: true,

      stack: {
        threshold: 3,
      },

      className: "welcome-notification",
    });
  }, [location.pathname, api]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Notification: {
            colorBgElevated: "#000000",

            colorText: "#ffffff",

            colorTextHeading: "#ffffff",

            colorIcon:
              "rgba(255, 255, 255, 0.65)",

            colorIconHover:
              "#ffffff",

            width: 384,

            borderRadiusLG: 8,

            boxShadow:
              "0 8px 24px rgba(0, 0, 0, 0.35)",
          },
        },
      }}
    >
      {contextHolder}
    </ConfigProvider>
  );
}

export default WelcomeNotification;