import { Helmet } from "react-helmet-async";

export default function SEO() {
  return (
    <Helmet>

      <title>
        Manuel Cuauhtémoc Parra Flores | Ingeniero en Computación,
        Software, Tecnología y Derecho
      </title>

      <meta
        name="description"
        content="Manuel Cuauhtémoc Parra Flores: Ingeniero en Computación, Desarrollador de software, Contador público, Abogado fiscalista y Docente universitario."
      />

      <meta
        name="keywords"
        content="Manuel Cuauhtémoc Parra Flores, Ingeniero en Computación, desarrollo de software, ingeniería de software, programación, sistemas computacionales, tecnología, transformación digital, inteligencia artificial, derecho fiscal, contador público, finanzas, administración, docente universitario"
      />

      <meta
        name="author"
        content="Manuel Cuauhtémoc Parra Flores"
      />

      <meta
        name="copyright"
        content="Manuel Cuauhtémoc Parra Flores"
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <meta
        name="googlebot"
        content="index, follow"
      />

      <link
        rel="canonical"
        href="https://soytemo7.github.io/CV/"
      />

      {/* Schema.org */}

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Manuel Cuauhtémoc Parra Flores",
          url: "https://soytemo7.github.io/CV/",
          jobTitle:
            "Ingeniero en Computación, Desarrollador de Software, Contador Público y Abogado Fiscalista",
          sameAs: [
            "https://github.com/soytemo7",
          ],
        })}
      </script>

    </Helmet>
  );
}