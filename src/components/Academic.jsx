import useIsotope from "../hooks/useIsotope";
import useGLightbox from "../hooks/useGLightbox";
import GravityGallery from "./GravityGallery";

function Academic() {

  useIsotope();
  useGLightbox();

  return (
    <section id="academic" className="portfolio section">

      <div className="container section-title" data-aos="fade-up">

        <h2>Producción Académica</h2>

        <p>
          En esta sección se presentan algunos de mis principales logros académicos,
          publicaciones y participaciones como conferencista, reflejando mi trayectoria
          profesional en las áreas del Derecho, Contaduría, Administración e Ingeniería.
        </p>

      </div>


      <div className="container">

        <div
          className="isotope-layout"
          data-default-filter="*"
          data-layout="masonry"
          data-sort="original-order"
        >

          <ul
            className="portfolio-filters isotope-filters"
            data-aos="fade-up"
            data-aos-delay="100"
          >

            <li data-filter="*" className="filter-active">
              Todo
            </li>

            <li data-filter=".filter-app">
              Títulos
            </li>

            <li data-filter=".filter-product">
              Artículos
            </li>

            <li data-filter=".filter-branding">
              Ponencias
            </li>

          </ul>


          <div
            className="row gy-4 isotope-container"
            data-aos="fade-up"
            data-aos-delay="200"
          >


            {/* TITULOS */}

            <AcademicItem
              filter="filter-app"
              image="titulo1.jpg"
              title="Doctorado en Derecho Fiscal"
              text="Especialización en investigación jurídica y Derecho Tributario."
            />


            <AcademicItem
              filter="filter-app"
              image="titulo2.jpg"
              title="Licenciatura en Derecho"
              text="Formación jurídica en Derecho Público, Privado y Administrativo."
            />


            <AcademicItem
              filter="filter-app"
              image="titulo3.jpg"
              title="Ingeniería en Sistemas"
              text="Desarrollo de software, bases de datos e ingeniería de software."
            />



            {/* ARTICULOS */}

            <AcademicItem
              filter="filter-product"
              image="articulo1.jpg"
              title="Revista PAF 875"
              text="Actualización del límite a los ingresos totales anuales de una S.A.S. en 2026."
            />


            <AcademicItem
              filter="filter-product"
              image="articulo2.jpg"
              title="Revista PAF 874"
              text="Pérdidas fiscales en el régimen de intereses de personas físicas."
            />


            <AcademicItem
              filter="filter-product"
              image="articulo3.jpg"
              title="Revista PAF 870"
              text="Proyección de cuotas obrero patronales del IMSS-INFONAVIT y Régimen de Arrendamiento."
            />



            {/* PONENCIAS */}

            <AcademicItem
              filter="filter-branding"
              image="ponencia1.jpg"
              title="Medios de defensa fiscal"
              text="Conferencia impartida el 9 de noviembre de 2021 en el Instituto Tecnológico Superior de la Montaña."
            />


            <AcademicItem
              filter="filter-branding"
              image="ponencia2.jpg"
              title="El juicio contencioso administrativo como un medio eficaz para los contribuyentes"
              text="Ponencia presentada el 31 de mayo de 2021 en la Escuela Libre de Derecho del Estado de Hidalgo."
            />


            <AcademicItem
              filter="filter-branding"
              image="ponencia3.jpg"
              title="Las TIC'S como herramienta para el estudio y aplicación del derecho en México"
              text="Conferencia internacional impartida para la Universidad César Vallejo de Perú."
            />


          </div>

        </div>

      </div>

      <GravityGallery />

    </section>
  );
}



function AcademicItem({
  filter,
  image,
  title,
  text
}) {

  const imagePath = `${import.meta.env.BASE_URL}img/portfolio/${image}`;

  return (

    <div
      className={`col-lg-4 col-md-6 portfolio-item isotope-item ${filter}`}
    >

      <img
        src={imagePath}
        className="img-fluid"
        alt={title}
      />


      <div className="portfolio-info">

        <h4>{title}</h4>

        <p>{text}</p>


        <a
          href={imagePath}
          title={title}
          className="glightbox preview-link"
        >

          <i className="bi bi-zoom-in"></i>

        </a>


      </div>


    </div>

  );
}


export default Academic;