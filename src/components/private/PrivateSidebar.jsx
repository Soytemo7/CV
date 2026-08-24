import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../../styles/private/private-sidebar.css";
import PrivateIconButton
  from "../common/PrivateIconButton.jsx";
import SocialTooltip from "../common/SocialTooltip.jsx";

function PrivateSidebar() {

  const navigate = useNavigate();

  const location = useLocation();


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
    setOpen
  ] = useState(false);

  const [
    dragOffset,
    setDragOffset
  ] = useState(
    -(SIDEBAR_WIDTH - PEEK_WIDTH)
  );

  const [
    dragging,
    setDragging
  ] = useState(false);


  /*
  ============================================================
  REFERENCIAS DEL DRAG
  ============================================================
  */

  const [
    dragStartX,
    setDragStartX
  ] = useState(null);

  const [
    dragStartOffset,
    setDragStartOffset
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

    setDragOffset(closedOffset);

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

    return location.pathname === path;

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
          }`
        }
        onClick={toggleSidebar}
        aria-label={
          open
            ? "Cerrar menú"
            : "Abrir menú"
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
          `private-sidebar ${
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

        <div
          className="private-sidebar-header"
        >

          <div
            className="private-sidebar-brand"
          >

            <PrivateIconButton
                icon="bi bi-grid-1x2"
                color="yellow"
                className="private-sidebar-brand-icon"
                />


            <div>

              <strong>
                Menú
              </strong>

              <span>
                Área privada
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
          aria-label="Menú privado"
        >

             <div className="private-sidebar-social">

            <SocialTooltip />
            <div className="private-sidebar-social-space"></div>

        </div>
        <div
            className="private-sidebar-divider"
          ></div>

          {/* ==================================================
              DASHBOARD
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
                    icon="bi bi-grid"
                    color="blue"
                    onPointerDown={(event) => {
                    event.stopPropagation();
  }}
                    onClick={() =>
                    handleNavigate("/dashboard")
                    }
                    aria-label="Dashboard"
                    className="private-sidebar-icon"
                />

                <span className="private-sidebar-item-text">
                    Dashboard
                </span>

                </div>

          {/* ==================================================
              PERFIL
              ================================================== */}

        <div
            className={
                `private-sidebar-item ${
                isActive("/dashboard/profile")
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
                handleNavigate("/dashboard/profile")
                }
                aria-label="Mi perfil"
                className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
                Mi perfil
            </span>

            </div>


          {/* ==================================================
              SEGURIDAD
              ================================================== */}

          <div
            className={
                `private-sidebar-item ${
                isActive("/dashboard/security")
                    ? "active"
                    : ""
                }`
            }
            >

            <PrivateIconButton
                icon="bi bi-shield-lock"
                color="red"
                onPointerDown={(event) => {
                    event.stopPropagation();
                }}
                onClick={() =>
                handleNavigate("/dashboard/security")
                }
                aria-label="Seguridad"
                className="private-sidebar-icon"
            />

            <span className="private-sidebar-item-text">
                Seguridad
            </span>

            </div>

          <div
            className="private-sidebar-divider"
          ></div>

            {/* ==================================================
            VOLVER A MI CV
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

        <div
          className="private-sidebar-footer"
        >

          <span>
            Navegación privada
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


export default PrivateSidebar;