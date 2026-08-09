import SEO from "../components/common/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollTop from "../components/common/ScrollTop";
import ThemeToggle from "../components/common/ThemeToggle";

import useAOS from "../hooks/useAOS";
import usePureCounter from "../hooks/usePureCounter";


function MainLayout({ children, isDark, setIsDark }) {

  useAOS();
  usePureCounter();


  return (
    <>
      <SEO />

      <Header isDark={isDark} setIsDark={setIsDark} />

      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
      />

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

      <ScrollTop />
    </>
  );
}


export default MainLayout;