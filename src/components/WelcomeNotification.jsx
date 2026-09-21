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

import {
  getAcademicCourse
} from "../services/user/academicCourseService.js";

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
         VERIFICACIÓN PÚBLICA — BÚSQUEDA
         ====================================================== */

      "/verificar-constancia": {

        title:
          "Verificar constancia",

        description:
          "Ingresa el número de una constancia académica para comprobar su autenticidad.",

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


      /* ======================================================
         ÁREA ACADÉMICA — CURSOS USUARIO
         ====================================================== */

      "/dashboard/courses": {

        title:
          "Área académica",

        description:
          "Consulta los cursos disponibles y da seguimiento a tu avance académico.",

      },


      /* ======================================================
         ADMINISTRACIÓN ACADÉMICA
         ====================================================== */

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


      "/admin/evaluaciones": {

        title:
          "Evaluaciones",

        description:
          "Consulta y seguimiento de exámenes y resultados académicos.",

      },


      "/admin/exams": {

        title:
          "Exámenes",

        description:
          "Crea y configura los exámenes, preguntas, opciones, respuestas correctas y puntuación de los cursos.",

      },

      "/admin/academic-events": {
        title: "Historial académico",
        description:
          "Consulta la trazabilidad de las actividades académicas registradas en la plataforma.",
      },

    };


    /* ========================================================
       NORMALIZAR PATHNAME
       ======================================================== */

    const pathname =
      location.pathname
        .replace(/\/+$/, "") || "/";


    /* ========================================================
       OBTENER NOTIFICACIÓN
       ======================================================== */

    let currentNotification =
      notifications[pathname];


    /* ========================================================
       VERIFICACIÓN PÚBLICA — RESULTADO DINÁMICO
       ======================================================== */

    const certificateVerificationMatch =
      pathname.match(
        /^\/verificar-constancia\/[^/]+$/
      );


    if (
      !currentNotification &&
      certificateVerificationMatch
    ) {

      currentNotification = {

        title:
          "Resultado de verificación",

        description:
          "Consulta la información oficial asociada a esta constancia académica.",

      };

    }


    /* ========================================================
       VIDEO ACADÉMICO — RUTA DINÁMICA
       ======================================================== */

    if (
      !currentNotification &&
      /^\/dashboard\/academic\/lessons\/[^/]+$/.test(
        pathname
      )
    ) {

      currentNotification = {

        title:
          "Video de la lección",

        description:
          "Visualiza el video de esta lección para consultar su contenido y registrar tu avance académico.",

      };

    }


    /* ========================================================
       EVALUACIÓN ACADÉMICA — RUTA DINÁMICA
       ======================================================== */

    if (
      !currentNotification &&
      /^\/dashboard\/academic\/assessment\/[^/]+$/.test(
        pathname
      )
    ) {

      currentNotification = {

        title:
          "Evaluación académica",

        description:
          "Presenta la evaluación del curso y comprueba los conocimientos adquiridos.",

      };

    }


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
       LECCIÓN → VIDEO ADMINISTRATIVO
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


    /* ========================================================
       CURSO ACADÉMICO → BIENVENIDA AL CURSO
       ======================================================== */

    const academicCourseMatch =
      pathname.match(
        /^\/dashboard\/academic\/courses\/([^/]+)$/
      );


    if (
      !currentNotification &&
      academicCourseMatch
    ) {

      const courseId =
        academicCourseMatch[1];


      const loadCourseNotification =
        async () => {

          try {

            const courseResponse =
              await getAcademicCourse(
                courseId
              );


            const course =
              courseResponse?.course ||
              courseResponse?.data ||
              courseResponse;


            api.destroy();


            api.info({

              title:
                "¡Bienvenido al curso!",

              description:
                `Has ingresado al curso "${course?.title}". Aquí podrás consultar sus módulos, lecciones y dar seguimiento a tu avance académico.`,

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

          } catch (error) {

            console.error(
              "Error al cargar el curso:",
              error
            );

          }

        };


      loadCourseNotification();

      return;

    }


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