import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import PrivateIconButton
  from "../common/PrivateIconButton.jsx";

import SocialTooltip
  from "../common/SocialTooltip.jsx";


function AdminSidebar() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /*
  ============================================================
  CONSTANTES
  ============================================================
  */

  const SIDEBAR_WIDTH = 280;

  const PEEK_WIDTH = 14;


  /*
  ============================================================
  ESTADO
  ============================================================
  */

  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    dragOffset,
    setDragOffset,
  ] = useState(
    -(SIDEBAR_WIDTH - PEEK_WIDTH)
  );


  const [
    dragging,
    setDragging,
  ] = useState(false);


  /*
  ============================================================
  REFERENCIAS DEL DRAG
  ============================================================
  */

  const [
    dragStartX,
    setDragStartX,
  ] = useState(null);


  const [
    dragStartOffset,
    setDragStartOffset,
  ] = useState(0);


  /*
  ============================================================
  POSICIÓN CERRADA
  ============================================================
  */

  const closedOffset =
    -(SIDEBAR_WIDTH - PEEK_WIDTH);


  /*
  ============================================================
  ABRIR
  ============================================================
  */

  const openSidebar = () => {

    setOpen(true);

    setDragOffset(0);

  };


  /*
  ============================================================
  CERRAR
  ============================================================
  */

  const closeSidebar = () => {

    setOpen(false);

    setDragOffset(
      closedOffset
    );

  };


  /*
  ============================================================
  TOGGLE
  ============================================================
  */

  const toggleSidebar = () => {

    if (open) {

      closeSidebar();

    } else {

      openSidebar();

    }

  };


  /*
  ============================================================
  ESC
  ============================================================
  */

  useEffect(() => {

    const handleEscape = (event) => {

      if (event.key === "Escape") {

        closeSidebar();

      }

    };


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, [open]);


  /*
  ============================================================
  BLOQUEAR SCROLL
  ============================================================
  */

  useEffect(() => {

    if (!open) {

      return;

    }


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    return () => {

      document.body.style.overflow =
        previousOverflow;

    };

  }, [open]);


  /*
  ============================================================
  INICIAR DRAG
  ============================================================
  */

  const handlePointerDown = (event) => {

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {

      return;

    }


    setDragging(true);

    setDragStartX(
      event.clientX
    );


    setDragStartOffset(
      open
        ? 0
        : closedOffset
    );


    event.currentTarget.setPointerCapture(
      event.pointerId
    );

  };


  /*
  ============================================================
  MOVIMIENTO
  ============================================================
  */

  const handlePointerMove = (event) => {

    if (
      !dragging ||
      dragStartX === null
    ) {

      return;

    }


    const delta =
      event.clientX -
      dragStartX;


    let nextOffset =
      dragStartOffset +
      delta;


    nextOffset =
      Math.max(
        closedOffset,
        Math.min(
          0,
          nextOffset
        )
      );


    setDragOffset(
      nextOffset
    );

  };


  /*
  ============================================================
  FINALIZAR DRAG
  ============================================================
  */

  const handlePointerUp = (event) => {

    if (
      !dragging ||
      dragStartX === null
    ) {

      return;

    }


    const delta =
      event.clientX -
      dragStartX;


    const finalOffset =
      dragStartOffset +
      delta;


    const threshold =
      SIDEBAR_WIDTH * 0.35;


    if (!open) {

      if (
        finalOffset >
        closedOffset + threshold
      ) {

        openSidebar();

      } else {

        closeSidebar();

      }

    } else {

      if (
        finalOffset <
        -threshold
      ) {

        closeSidebar();

      } else {

        openSidebar();

      }

    }


    setDragging(false);

    setDragStartX(null);

    setDragStartOffset(0);

  };


  /*
  ============================================================
  CANCELAR DRAG
  ============================================================
  */

  const handlePointerCancel = () => {

    setDragging(false);

    setDragStartX(null);

    setDragStartOffset(0);


    if (open) {

      setDragOffset(0);

    } else {

      setDragOffset(
        closedOffset
      );

    }

  };


  /*
  ============================================================
  NAVEGACIÓN
  ============================================================
  */

  const handleNavigate = (path) => {

    closeSidebar();

    navigate(path);

  };


  /*
  ============================================================
  RUTA ACTIVA
  ============================================================
  */

  const isActive = (path) => {

    if (path === "/admin") {

      return location.pathname === "/admin";

    }


    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );

  };


  /*
  ============================================================
  ESTILO DINÁMICO
  ============================================================
  */

  const sidebarStyle = {

    transform:
      `translateX(${dragOffset}px)`,

  };


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (

    <>

      {/* ====================================================
          BOTÓN TOGGLE
          ==================================================== */}

      <button
        type="button"
        className={
          `private-sidebar-toggle ${
            open
              ? "active"
              : ""
          } admin-sidebar-toggle`
        }
        onClick={toggleSidebar}
        aria-label={
          open
            ? "Cerrar menú administrativo"
            : "Abrir menú administrativo"
        }
        aria-expanded={open}
      >

        <i
          className={
            `bi ${
              open
                ? "bi-x-lg"
                : "bi-list"
            }`
          }
        ></i>

      </button>


      {/* ====================================================
          SIDEBAR
          ==================================================== */}

      <aside
        className={
          `private-sidebar admin-sidebar ${
            open
              ? "open"
              : ""
          } ${
            dragging
              ? "dragging"
              : ""
          }`
        }
        style={sidebarStyle}
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerUp
        }
        onPointerCancel={
          handlePointerCancel
        }
      >

        {/* ==================================================
            CABECERA
            ================================================== */}

        <div className="private-sidebar-header">

          <div className="private-sidebar-brand">

            <PrivateIconButton
              icon="bi bi-speedometer2"
              color="yellow"
              className="private-sidebar-brand-icon"
            />


            <div>

              <strong>
                Administración
              </strong>

              <span>
                Panel administrativo
              </span>

            </div>

          </div>


          <button
            type="button"
            className="private-sidebar-close"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >

            <i className="bi bi-chevron-left"></i>

          </button>

        </div>


        {/* ==================================================
            NAVEGACIÓN
            ================================================== */}

        <nav
          className="private-sidebar-nav"
          aria-label="Menú administrativo"
        >

          {/* ==================================================
              SOCIAL
              ================================================== */}

          <div className="private-sidebar-social">

            <SocialTooltip />

            <div className="private-sidebar-social-space"></div>

          </div>


          <div className="private-sidebar-divider"></div>


          {/* ==================================================
              DASHBOARD
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/admin")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-speedometer2"
              color="blue"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/admin")
              }
              aria-label="Dashboard administrativo"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Dashboard
            </span>

          </div>


          {/* ==================================================
              USUARIOS
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/admin/users")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-people"
              color="blue"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/admin/users")
              }
              aria-label="Usuarios"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Usuarios
            </span>

          </div>


          {/* ==================================================
              CURSOS
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/admin/courses")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-mortarboard"
              color="blue"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/admin/courses")
              }
              aria-label="Cursos"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Cursos
            </span>

          </div>

          {/* ==================================================
              ESTRUCTURA DE CURSOS
              ================================================== */}

            <div
              className={
                `private-sidebar-item ${
                  isActive(
                    "/admin/course-structure"
                  )
                    ? "active"
                    : ""
                }`
              }
            >

              <PrivateIconButton
                icon="bi bi-diagram-3"
                color="blue"
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onClick={() =>
                  handleNavigate(
                    "/admin/course-structure"
                  )
                }
                aria-label="Estructura de cursos"
                className="private-sidebar-icon"
              />

              <span
                className="
                  private-sidebar-item-text
                "
              >
                Estructura de cursos
              </span>

            </div>


          {/* ==================================================
              INSCRIPCIONES
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/admin/enrollments")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-person-check"
              color="green"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/admin/enrollments")
              }
              aria-label="Inscripciones"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Inscripciones
            </span>

          </div>

          {/* ==================================================
              EXAMENES
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/admin/exams")
                  ? "active"
                  : ""
              }`
            }
          >
            <PrivateIconButton
              icon="bi bi-file-earmark-text"
              color="purple"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate(
                  "/admin/exams"
                )
              }
              aria-label="Exámenes"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Exámenes
            </span>
          </div>


          {/* ==================================================
              EVALUACIONES
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/admin/evaluaciones")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-clipboard-check"
              color="yellow"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/admin/evaluaciones")
              }
              aria-label="Evaluaciones"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Evaluaciones
            </span>

          </div>


          {/* ==================================================
              CERTIFICADOS
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/admin/certificates")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-patch-check"
              color="green"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/admin/certificates")
              }
              aria-label="Certificados"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Certificados
            </span>

          </div>


          <div className="private-sidebar-divider"></div>


          {/* ==================================================
              VOLVER AL DASHBOARD DE USUARIO
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/dashboard")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-person"
              color="blue"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/dashboard")
              }
              aria-label="Área de usuario"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Área de usuario
            </span>

          </div>


          {/* ==================================================
              VOLVER AL CV
              ================================================== */}

          <div
            className={
              `private-sidebar-item ${
                isActive("/")
                  ? "active"
                  : ""
              }`
            }
          >

            <PrivateIconButton
              icon="bi bi-house"
              color="green"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() =>
                handleNavigate("/")
              }
              aria-label="Volver a mi CV"
              className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
              Volver a mi CV
            </span>

          </div>

        </nav>


        {/* ==================================================
            FOOTER
            ================================================== */}

        <div className="private-sidebar-footer">

          <span>
            Administración
          </span>

        </div>


        {/* ==================================================
            HANDLE
            ================================================== */}

        <div
          className="private-sidebar-handle"
          aria-hidden="true"
        >

          <span></span>

        </div>

      </aside>


      {/* ====================================================
          OVERLAY
          ==================================================== */}

      {open && (

        <div
          className="private-sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>

      )}

    </>

  );

}


export default AdminSidebar;