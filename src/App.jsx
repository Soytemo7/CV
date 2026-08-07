import MainLayout from "./layouts/MainLayout";
import Hero from "./components/Hero";
import About from "./components/About";
import Stats from "./components/Stats";
import Skills from "./components/Skills";
import Resume from "./components/Resume";
import Academic from "./components/Academic";
import Services from "./components/Services";
import Books from "./components/Books";
import Contact from "./components/Contact";
import { useScrollSpy } from "./hooks/useScrollSpy";
import useVisitCounter from "./hooks/useVisitCounter";

function App() {

  useScrollSpy();
  useVisitCounter();

  return (
    <MainLayout>
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
  );
}

export default App;