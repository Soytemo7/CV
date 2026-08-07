import SEO from "../components/common/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollTop from "../components/common/ScrollTop";
import useAOS from "../hooks/useAOS";
import usePureCounter from "../hooks/usePureCounter";


function MainLayout({ children }) {

  useAOS();
  usePureCounter();

  return (
    <>
      <SEO />

      <Header />         

      <main className="main">
        {children}
      </main>


      <Footer />
      
      <ScrollTop />
    </>
  );
}

export default MainLayout;