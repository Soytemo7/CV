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

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useScrollSpy } from "./hooks/useScrollSpy";
import useVisitCounter from "./hooks/useVisitCounter";

import MainLayout from "./layouts/MainLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

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
      <Routes>

        {/* CV — SPA actual */}
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
          element={<Login />}
        />

        {/* Registro */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
           element={<PrivateLayout><Dashboard /></PrivateLayout>}
        />

        {/* Cualquier ruta inexistente */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;