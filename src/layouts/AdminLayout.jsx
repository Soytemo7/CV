import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
  AuthProvider,
} from "../context/AuthContext.jsx";

import ProfileDropdown
  from "../components/private/ProfileDropdown.jsx";

import ThemeToggle
  from "../components/common/ThemeToggle.jsx";

import AdminSidebar
  from "../components/admin/AdminSidebar.jsx";

import AdminHeader
  from "../components/admin/AdminHeader.jsx";

import "../styles/private/private-layout.css";
import "../styles/private/private-sidebar.css";
import "../styles/private/profile-dropdown.css";
import "../styles/admin/admin.css";


function AdminContent({ children }) {

  const {
    user,
    loading,
    checkSession,
  } = useContext(AuthContext);


  const location =
    useLocation();


  /*
  ============================================================
  VALIDAR SESIÓN AL CAMBIAR DE RUTA
  ============================================================
  */

  useEffect(() => {

    if (loading) {

      return;

    }

    checkSession();

  }, [
    location.pathname,
  ]);


  /*
  ============================================================
  CARGANDO
  ============================================================
  */

  if (loading) {

    return null;

  }


  /*
  ============================================================
  SESIÓN NO VÁLIDA
  ============================================================
  */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  /*
  ============================================================
  AUTORIZACIÓN ADMINISTRATIVA
  ============================================================

  El backend debe seguir protegiendo todas las operaciones
  administrativas.

  Aquí solamente protegemos la interfaz.
  ============================================================
  */

  if (user.role !== "admin") {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  return children;

}


function AdminLayout({ children }) {

  const [
    isDark,
    setIsDark,
  ] = useState(() => {

    return (
      localStorage.getItem("theme") === "dark"
    );

  });


  /*
  ============================================================
  ESCUCHAR CAMBIOS DE TEMA
  ============================================================
  */

  useEffect(() => {

    const handleThemeChange = () => {

      setIsDark(
        localStorage.getItem("theme") === "dark"
      );

    };


    window.addEventListener(
      "themechange",
      handleThemeChange
    );


    return () => {

      window.removeEventListener(
        "themechange",
        handleThemeChange
      );

    };

  }, []);


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (

    <AuthProvider checkOnMount={true}>

      <AdminContent>

        <div
          className={
            `private-layout admin-layout ${
              isDark
                ? "private-dark"
                : "private-light"
            }`
          }
        >

          {/* ==================================================
              SIDEBAR ADMINISTRATIVO
              ================================================== */}

          <AdminSidebar />


          {/* ==================================================
              HEADER ADMINISTRATIVO
              ================================================== */}

          <AdminHeader
            isDark={isDark}
            setIsDark={setIsDark}
          />


          {/* ==================================================
              CONTENIDO
              ================================================== */}

          <main className="private-main admin-main">

            {children}

          </main>

        </div>

      </AdminContent>

    </AuthProvider>

  );

}


export default AdminLayout;