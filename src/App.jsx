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
import TwoFactorLogin
  from "./pages/TwoFactorLogin";

import { AuthProvider } from "./context/AuthContext.jsx";

import AcademicVideo
  from "./pages/academic/AcademicVideo";

import AdminLayout
  from "./layouts/AdminLayout.jsx";

import AdminDashboard
  from "./pages/admin/Dashboard.jsx";

import AdminUsers
  from "./pages/admin/AdminUsers.jsx";

import AdminCourses
  from "./pages/admin/AdminCourses.jsx";

import AdminCourseContentPage
  from "./pages/admin/AdminCourseContentPage.jsx";

  import AdminLessonsPage
  from "./pages/admin/AdminLessonsPage.jsx";

  import AdminVideoPage
  from "./pages/admin/AdminVideoPage.jsx";


function App() {

  const [isDark, setIsDark] = useState(() => {

    const savedTheme =
      localStorage.getItem("theme");

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
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
    >

      <NotificationProvider>

        <WelcomeNotification />

        <Routes>

          {/* =========================================================
              CV — SPA PÚBLICA
              ========================================================= */}

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


          {/* =========================================================
              LOGIN
              ========================================================= */}

          <Route
            path="/login"
            element={
              <AuthProvider>
                <Login />
              </AuthProvider>
            }
          />


          <Route
            path="/two-factor"
            element={
              <TwoFactorLogin />
            }
          />


          {/* =========================================================
              REGISTRO
              ========================================================= */}

          <Route
            path="/register"
            element={
              <AuthProvider>
                <Register />
              </AuthProvider>
            }
          />


          {/* =========================================================
              VERIFICACIÓN DE CORREO
              ========================================================= */}

          <Route
            path="/verify-email"
            element={
              <VerifyEmail />
            }
          />


          {/* =========================================================
              RECUPERACIÓN DE CONTRASEÑA
              ========================================================= */}

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />


          {/* =========================================================
              RESTABLECER CONTRASEÑA
              ========================================================= */}

          <Route
            path="/reset-password"
            element={
              <ResetPassword />
            }
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


          {/* =========================================================
              ÁREA ACADÉMICA
              ========================================================= */}

          <Route
            path="/academic/video"
            element={
              <PrivateLayout>
                <AcademicVideo />
              </PrivateLayout>
            }
          />


          {/* =========================================================
              ÁREA ADMINISTRATIVA
              ========================================================= */}

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />


          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />


          {/* =========================================================
              CURSOS
              ========================================================= */}

          <Route
            path="/admin/courses"
            element={
              <AdminLayout>
                <AdminCourses />
              </AdminLayout>
            }
          />


          {/* =========================================================
              CONTENIDO ACADÉMICO DEL CURSO
              
              Curso
                ↓
              Módulos
                ↓
              Lecciones
                ↓
              Videos
              ========================================================= */}

          <Route
            path="/admin/courses/:courseId/content"
            element={
              <AdminLayout>
                <AdminCourseContentPage />
              </AdminLayout>
            }
          />


          {/* =========================================================
              PERFIL ADMINISTRATIVO
              ========================================================= */}

          <Route
            path="/admin/profile"
            element={
              <AdminLayout>
                <Profile />
              </AdminLayout>
            }
          />


          <Route
            path="/admin/security"
            element={
              <AdminLayout>
                <Security />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/courses/:courseId/content/module/:moduleId/lessons"
            element={
              <AdminLayout>
                <AdminLessonsPage />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/courses/:courseId/content/module/:moduleId/lessons/:lessonId/video"
            element={
              <AdminLayout>
                <AdminVideoPage />
              </AdminLayout>
            }
          />


          {/* =========================================================
              CUALQUIER RUTA INEXISTENTE
              ========================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </NotificationProvider>

    </BrowserRouter>
  );

}


export default App;