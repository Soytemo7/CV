import {
  Navigate
} from "react-router-dom";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  AuthContext,
  AuthProvider
} from "../context/AuthContext.jsx";

import ProfileDropdown
  from "../components/private/ProfileDropdown.jsx";

import ThemeToggle
  from "../components/common/ThemeToggle.jsx";

import "../styles/private/private-layout.css";


function PrivateContent({ children }) {

  const {
    user,
    loading
  } = useContext(AuthContext);


  if (loading) {

    return null;

  }


  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return children;

}


function PrivateLayout({ children }) {

  const [
    isDark,
    setIsDark
  ] = useState(() => {

    return (
      localStorage.getItem("theme") === "dark"
    );

  });


  /*==============================================================
  # Escuchar cambios de tema
  ==============================================================*/

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


  /*==============================================================
  # Render
  ==============================================================*/

  return (

    <AuthProvider checkOnMount={true}>

      <PrivateContent>

        <div
          className={
            `private-layout ${
              isDark
                ? "private-dark"
                : "private-light"
            }`
          }
        >

          {/* ==================================================
              HEADER PRIVADO
              ================================================== */}

          <header className="private-header">

            <div className="private-header-right">

              <div className="private-profile-container">

                <ProfileDropdown />

              </div>


              <div className="private-theme-container">

                <ThemeToggle
                  isDark={isDark}
                  setIsDark={setIsDark}
                />

              </div>

            </div>

          </header>


          {/* ==================================================
              CONTENIDO PRIVADO
              ================================================== */}

          <main className="private-main">

            {children}

          </main>

        </div>

      </PrivateContent>

    </AuthProvider>

  );

}


export default PrivateLayout;