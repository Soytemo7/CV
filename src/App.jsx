import { useEffect, useState } from "react";

import Hero from "./components/Hero";
import About from "./components/About";
import Stats from "./components/Stats";
import Skills from "./components/Skills";
import Resume from "./components/Resume";
import Academic from "./components/Academic";
import Services from "./components/Services";
import Books from "./components/Books";
import Contact from "./components/Contact";
import WelcomeNotification from "./components/WelcomeNotification";
import NotificationProvider from "./components/NotificationProvider";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useScrollSpy } from "./hooks/useScrollSpy";
import useVisitCounter from "./hooks/useVisitCounter";

import MainLayout from "./layouts/MainLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/private/Profile";
import Security from "./pages/private/Security";

import { AuthProvider } from "./context/AuthContext.jsx";


function App() {

  const [isDark, setIsDark] = useState(() => {

    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "dark";

  });


  useScrollSpy();
  useVisitCounter();


  useEffect(() => {

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );

  }, [isDark]);


  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>

      <NotificationProvider>

        <WelcomeNotification />

        <Routes>

          {/* CV — SPA pública */}

          <Route
            path="/"
            element={
              <MainLayout
                isDark={isDark}
                setIsDark={setIsDark}
              >
                <Hero />
                <About />
                <Stats />
                <Skills />
                <Resume />
                <Academic />
                <Services />
                <Books />
                <Contact />
              </MainLayout>
            }
          />


          {/* Login */}

          <Route
            path="/login"
            element={
              <AuthProvider>
                <Login />
              </AuthProvider>
            }
          />


          {/* Registro */}

          <Route
            path="/register"
            element={
              <AuthProvider>
                <Register />
              </AuthProvider>
            }
          />

          {/* Verificación de correo */}

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          {/* Recuperación de contraseña */}

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />


          {/* Restablecer contraseña */}

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />


            {/* =========================================================
            ZONA PRIVADA
            ========================================================= */}

          <Route
            path="/dashboard"
            element={
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <PrivateLayout>
                <Profile />
              </PrivateLayout>
            }
          />

          <Route
            path="/dashboard/security"
            element={
              <PrivateLayout>
                <Security />
              </PrivateLayout>
            }
          />


          {/* Cualquier ruta inexistente */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </NotificationProvider>

    </BrowserRouter>
  );

}


export default App;