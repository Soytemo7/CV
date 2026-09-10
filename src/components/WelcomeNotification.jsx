/* ============================================================
   WELCOME NOTIFICATION
   ============================================================ */

import { useEffect } from "react";

import {
  ConfigProvider,
  notification
} from "antd";

import {
  useLocation
} from "react-router-dom";

import "../styles/welcome-notification.css";


function WelcomeNotification() {

  const [
    api,
    contextHolder
  ] = notification.useNotification();


  const location =
    useLocation();


  useEffect(() => {

    /* ========================================================
       NOTIFICACIONES POR RUTA
       ======================================================== */

    const notifications = {

      /* ======================================================
         PÚBLICO
         ====================================================== */

      "/": {

        title:
          "¡Bienvenido!",

        description:
          "Bienvenido a mi CV profesional.",

      },


      /* ======================================================
         AUTENTICACIÓN
         ====================================================== */

      "/login": {

        title:
          "Inicio de sesión",

        description:
          "Bienvenido al área de acceso.",

      },


      "/register": {

        title:
          "Crear cuenta",

        description:
          "Regístrate para acceder al sistema.",

      },


      "/forgot-password": {

        title:
          "Recuperar contraseña",

        description:
          "Solicita un enlace para recuperar el acceso a tu cuenta.",

      },


      "/reset-password": {

        title:
          "Restablecer contraseña",

        description:
          "Establece una nueva contraseña para tu cuenta.",

      },


      /* ======================================================
         ÁREA PRIVADA — USUARIO
         ====================================================== */

      "/dashboard": {

        title:
          "Panel de control",

        description:
          "Bienvenido a tu panel de control.",

      },


      "/dashboard/profile": {

        title:
          "Mi perfil",

        description:
          "Consulta la información asociada a tu cuenta.",

      },


      "/dashboard/security": {

        title:
          "Seguridad",

        description:
          "Administra los dispositivos, accesos y sesiones asociadas a tu cuenta.",

      },


      /* ======================================================
         ÁREA ADMINISTRATIVA
         ====================================================== */

      "/admin": {

        title:
          "Panel administrativo",

        description:
          "Bienvenido al área de administración.",

      },


      "/admin/users": {

        title:
          "Administración de usuarios",

        description:
          "Consulta y administra las cuentas registradas en la plataforma.",

      },


      /* ======================================================
         ÁREA ACADÉMICA — CURSOS
         ====================================================== */

      "/admin/courses": {

        title:
          "Administración de cursos",

        description:
          "Consulta, crea y administra los cursos académicos de la plataforma.",

      },


      /* ======================================================
         ÁREA ACADÉMICA — VIDEO USUARIO
         ====================================================== */

      "/academic/video": {

        title:
          "Video de la lección",

        description:
          "Reproduce el contenido académico para registrar tu avance en la lección.",

      },

      "/admin/course-structure": {
        title:
          "Estructura de cursos",
        description:
          "Consulta en una sola vista la estructura completa de un curso, incluyendo módulos, lecciones y videos.",
      },

      "/admin/enrollments": {
        title:
          "Inscripciones",
        description:
          "Consulta y da seguimiento al avance académico de los alumnos inscritos en los cursos.",
      },

    };


    /* ========================================================
       NORMALIZAR PATHNAME
       ======================================================== */

    const pathname =
      location.pathname
        .replace(/\/+$/, "") || "/";


    /* ========================================================
       DIAGNÓSTICO
       ======================================================== */

    console.log(
      "📍 WelcomeNotification pathname:",
      location.pathname
    );

    console.log(
      "📍 WelcomeNotification pathname normalizado:",
      pathname
    );


    /* ========================================================
       OBTENER NOTIFICACIÓN
       ======================================================== */

    let currentNotification =
      notifications[pathname];


    /* ========================================================
       CURSO → CONTENIDO / MÓDULOS
       ======================================================== */

    if (
      !currentNotification &&
      /^\/admin\/courses\/[^/]+\/content$/.test(
        pathname
      )
    ) {

      currentNotification = {

        title:
          "Contenido del curso",

        description:
          "Administra los módulos que forman parte de este curso académico.",

      };

    }


    /* ========================================================
       MÓDULO → LECCIONES
       ======================================================== */

    else if (
      !currentNotification &&
      /^\/admin\/courses\/[^/]+\/content\/module\/[^/]+\/lessons$/.test(
        pathname
      )
    ) {

      currentNotification = {

        title:
          "Lecciones del módulo",

        description:
          "Administra las lecciones que forman parte de este módulo académico.",

      };

    }


    /* ========================================================
       LECCIÓN → VIDEO
       ======================================================== */

    else if (
      !currentNotification &&
      /^\/admin\/courses\/[^/]+\/content\/module\/[^/]+\/lessons\/[^/]+\/video$/.test(
        pathname
      )
    ) {

      currentNotification = {

        title:
          "Video de la lección",

        description:
          "Administra el contenido multimedia asociado a esta lección.",

      };

    }


    console.log(
      "📍 WelcomeNotification actual:",
      currentNotification
    );


    /* ========================================================
       RUTA SIN NOTIFICACIÓN
       ======================================================== */

    if (
      !currentNotification
    ) {

      return;

    }


    /* ========================================================
       ELIMINAR NOTIFICACIONES ANTERIORES
       ======================================================== */

    api.destroy();


    /* ========================================================
       MOSTRAR NOTIFICACIÓN
       ======================================================== */

    api.info({

      title:
        currentNotification.title,

      description:
        currentNotification.description,

      placement:
        window.innerWidth <= 576
          ? "bottom"
          : "bottomRight",

      duration:
        8,

      showProgress:
        true,

      pauseOnHover:
        true,

      closable:
        true,

      stack: {

        threshold:
          3,

      },

      className:
        "welcome-notification",

    });

  }, [

    location.pathname,
    api

  ]);


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <ConfigProvider

      theme={{

        components: {

          Notification: {

            colorBgElevated:
              "#000000",

            colorText:
              "#ffffff",

            colorTextHeading:
              "#ffffff",

            colorIcon:
              "rgba(255, 255, 255, 0.65)",

            colorIconHover:
              "#ffffff",

            width:
              384,

            borderRadiusLG:
              8,

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