import SEO from "../components/common/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollTop from "../components/common/ScrollTop";
import ThemeToggle from "../components/common/ThemeToggle";
import ManuelAI
  from "../components/ai/ManuelAI.jsx";

import useAOS from "../hooks/useAOS";
import usePureCounter from "../hooks/usePureCounter";

import "../styles/certificate-verify-button.css";

function MainLayout({ children, isDark, setIsDark }) {

  useAOS();
  usePureCounter();

  return (
    <>

      <SEO />

      <Header
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <div className="main-layout-controls">

        <a
          href={`${import.meta.env.BASE_URL}verificar-constancia`}
          className={`certificate-verify-button ${
            isDark
              ? "dark"
              : "light"
          }`}
          aria-label="Verificar constancia académica"
          title="Verificar constancia"
        >

          <span className="certificate-verify-icon">
            <i
              className="bi bi-patch-check-fill"
              aria-hidden="true"
            />
          </span>

          <span className="certificate-verify-label">
            VERIFICAR CONSTANCIA
          </span>

        </a>

        <ThemeToggle
          isDark={isDark}
          setIsDark={setIsDark}
        />

      </div>

      <main
        className={`main ${
          isDark
            ? "dark-background"
            : "light-background"
        }`}
      >
        {children}
      </main>

      <Footer isDark={isDark} />

      <ScrollTop isDark={isDark} />

      <ManuelAI />

    </>
  );
}

export default MainLayout;