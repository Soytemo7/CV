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
        content="Manuel Cuauhtémoc Parra Flores: Ingeniero en Computación, desarrollador de software, contador público, abogado fiscalista y docente universitario."
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

      {/* Open Graph */}

      <meta
        property="og:title"
        content="Manuel Cuauhtémoc Parra Flores | Software, Tecnología, Derecho y Finanzas"
      />

      <meta
        property="og:description"
        content="Perfil profesional de Manuel Cuauhtémoc Parra Flores: Ingeniero en Computación, desarrollador de software, contador público, abogado fiscalista y docente universitario."
      />

      <meta
        property="og:image"
        content="https://soytemo7.github.io/CV/img/foto-perfil.jpeg"
      />

      <meta
        property="og:url"
        content="https://soytemo7.github.io/CV/"
      />

      <meta
        property="og:type"
        content="profile"
      />

      <meta
        property="og:locale"
        content="es_MX"
      />

      {/* Twitter */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content="Manuel Cuauhtémoc Parra Flores | Software, Tecnología y Derecho"
      />

      <meta
        name="twitter:description"
        content="Trayectoria profesional en desarrollo de software, sistemas computacionales, tecnología, derecho fiscal, contabilidad, finanzas y docencia."
      />

      <meta
        name="twitter:image"
        content="https://soytemo7.github.io/CV/img/foto-perfil.jpeg"
      />

      <meta
        name="twitter:url"
        content="https://soytemo7.github.io/CV/"
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