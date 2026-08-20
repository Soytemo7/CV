/* ============================================================
   PROFILE DROPDOWN
   ============================================================ */

import {
  useContext,
  useState,
  useRef,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  AuthContext
} from "../../context/AuthContext.jsx";

import "../../styles/private/profile-dropdown.css";


function ProfileDropdown() {

  const {
    user,
    logout,
    logoutAll
  } = useContext(AuthContext);


  const navigate =
    useNavigate();


  const [
    open,
    setOpen
  ] = useState(false);


  const dropdownRef =
    useRef(null);


  /*==============================================================
  # Cerrar al hacer clic fuera
  ==============================================================*/

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {

        setOpen(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  /*==============================================================
  # Cerrar con Escape
  ==============================================================*/

  useEffect(() => {

    const handleEscape = (event) => {

      if (event.key === "Escape") {

        setOpen(false);

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

  }, []);


  /*==============================================================
  # Datos del usuario
  ==============================================================*/

  const name =
    user?.name ||
    "Usuario";


  const email =
    user?.email ||
    "";


  const photoURL =
    user?.photoURL ||
    null;


  /*==============================================================
  # Avatar
  ==============================================================*/

  const avatarContent = photoURL ? (

    <img
      src={photoURL}
      alt={`Foto de perfil de ${name}`}
      className="profile-dropdown-avatar-image"
    />

  ) : (

    <span className="profile-dropdown-avatar-letter">

      {name.charAt(0).toUpperCase()}

    </span>

  );


  /*==============================================================
  # Ir al Dashboard
  ==============================================================*/

  const handleDashboard = () => {

    setOpen(false);

    navigate("/dashboard");

  };


  /*==============================================================
  # Cerrar sesión
  ==============================================================*/

  const handleLogout = async () => {

    setOpen(false);

    await logout();

  };


  /*==============================================================
  # Cerrar todas las sesiones
  ==============================================================*/

  const handleLogoutAll = async () => {

    setOpen(false);

    await logoutAll();

  };


  /*==============================================================
  # Ir al perfil
  ==============================================================*/

  const handleProfile = () => {

    setOpen(false);

    navigate("/dashboard/profile");

  };


  /*==============================================================
  # Ir a seguridad
  ==============================================================*/

  const handleSecurity = () => {

    setOpen(false);

    navigate("/dashboard/security");

  };


  /*==============================================================
  # Render
  ==============================================================*/

  return (

    <div
      ref={dropdownRef}
      className="profile-dropdown"
    >

      {/* ========================================================
          BOTÓN PRINCIPAL
          ======================================================== */}

      <button
        type="button"
        className={
          `profile-dropdown-trigger ${
            open
              ? "active"
              : ""
          }`
        }
        onClick={() =>
          setOpen(prev => !prev)
        }
        aria-expanded={open}
        aria-haspopup="menu"
      >

        <span className="profile-dropdown-avatar">

          {avatarContent}

        </span>


        <span className="profile-dropdown-user">

          <span className="profile-dropdown-name">

            {name}

          </span>


          <span className="profile-dropdown-email">

            {email}

          </span>

        </span>


        <i
          className={
            `bi ${
              open
                ? "bi-chevron-up"
                : "bi-chevron-down"
            } profile-dropdown-arrow`
          }
        ></i>

      </button>


      {/* ========================================================
          MENÚ
          ======================================================== */}

      {open && (

        <div
          className="profile-dropdown-menu"
          role="menu"
        >

          {/* ====================================================
              DASHBOARD
              ==================================================== */}

          <button
            type="button"
            className="profile-dropdown-item"
            role="menuitem"
            onClick={handleDashboard}
          >

            <i className="bi bi-grid"></i>

            <span>
              Dashboard
            </span>

          </button>


          {/* ====================================================
              MI PERFIL
              ==================================================== */}

          <button
            type="button"
            className="profile-dropdown-item"
            role="menuitem"
            onClick={handleProfile}
          >

            <i className="bi bi-person"></i>

            <span>
              Mi perfil
            </span>

          </button>


          {/* ====================================================
              SEGURIDAD
              ==================================================== */}

          <button
            type="button"
            className="profile-dropdown-item"
            role="menuitem"
            onClick={handleSecurity}
          >

            <i className="bi bi-shield-lock"></i>

            <span>
              Seguridad
            </span>

          </button>


          {/* ====================================================
              DIVISOR
              ==================================================== */}

          <div className="profile-dropdown-divider"></div>


          {/* ====================================================
              CERRAR SESIÓN
              ==================================================== */}

          <button
            type="button"
            className="profile-dropdown-item danger"
            role="menuitem"
            onClick={handleLogout}
          >

            <i className="bi bi-box-arrow-right"></i>

            <span>
              Cerrar sesión
            </span>

          </button>


          {/* ====================================================
              CERRAR TODAS LAS SESIONES
              ==================================================== */}

          <button
            type="button"
            className="profile-dropdown-item danger"
            role="menuitem"
            onClick={handleLogoutAll}
          >

            <i className="bi bi-shield-x"></i>

            <span>
              Cerrar todas las sesiones
            </span>

          </button>

        </div>

      )}

    </div>

  );

}


export default ProfileDropdown;