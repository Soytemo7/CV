import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";


const books = [
  {
    image: "libro1.jpg",
    title: "Defensa fiscal",
    subtitle:
      "Estrategias básicas de impugnación en el juicio contencioso administrativo ante el TFJA",
    description:
      "Obra especializada en estrategias de defensa fiscal y análisis de los medios de impugnación dentro del juicio contencioso administrativo ante el Tribunal Federal de Justicia Administrativa.",
    info: (
      <>
        Editorial Flores | 1ra. Edición, 2022
        <br />
        ISBN: 978-607-610-958-8
        <br />
        552 páginas
      </>
    ),
    link:
      "https://www.floreseditor.com.mx/producto/defensa-fiscal/"
  },

  {
    image: "libro2.jpg",
    title: "Revisiones electrónicas",
    subtitle:
      "La nueva facultad de las autoridades fiscales",
    description:
      "Análisis de las facultades de comprobación electrónica de las autoridades fiscales y sus implicaciones jurídicas para los contribuyentes.",
    info: (
      <>
        Editorial Flores | 1ra. Edición, 2019
        <br />
        ISBN: 978-607-610-800-0
        <br />
        154 páginas
      </>
    ),
    link:
      "https://www.floreseditor.com.mx/producto/revisiones-electronicas-la-nueva-facultad-de-las-autoridades-fiscales/"
  },

  {
    image: "libro3.jpg",
    title: "Praxis del juicio contencioso administrativo en línea",
    subtitle:
      "Procedimiento administrativo digital",
    description:
      "Estudio práctico del procedimiento contencioso administrativo en línea y las herramientas digitales aplicadas a la justicia administrativa.",
    info: (
      <>
        Editorial Flores | 1ra. Edición, 2019
        <br />
        ISBN: 978-607-610-751-5
        <br />
        328 páginas
      </>
    ),
    link:
      "https://www.floreseditor.com.mx/producto/praxis-del-juicio-contencioso-administrativo-en-linea/"
  },

  {
    image: "libro4.jpg",
    title: "Defensa Fiscal",
    subtitle:
      "Conceptos de impugnación ganadores/perdedores ante el TFJA",
    description:
      "Análisis de conceptos de impugnación utilizados en medios de defensa fiscal ante el Tribunal Federal de Justicia Administrativa.",
    info: (
      <>
        Editorial Flores | 1ra. Edición, 2018
        <br />
        ISBN: 978-607-610-654-9
        <br />
        496 páginas
      </>
    ),
    link:
      "https://www.floreseditor.com.mx/producto/defensa-fiscal-conceptos-de-impugnacion-ganadores-perdedores-ante-el-tfja/"
  }
];


function Books() {

  return (

    <section id="books" className="testimonials section">


      <div className="container section-title" data-aos="fade-up">

        <h2>Libros Publicados</h2>

        <p>
          Obras publicadas en materia de Derecho Fiscal, defensa tributaria y
          procedimientos administrativos ante el Tribunal Federal de Justicia Administrativa.
        </p>

      </div>


      <div
        className="container"
        data-aos="fade-up"
        data-aos-delay="100"
      >


        <Swiper

          modules={[Pagination, Autoplay]}

          loop={true}

          speed={600}

          autoplay={{
            delay: 5000
          }}

          slidesPerView="auto"

          pagination={{
            clickable: true
          }}

        >


          {books.map((book, index) => {

            const imagePath =
              `${import.meta.env.BASE_URL}img/testimonials/${book.image}`;

            return (

              <SwiperSlide key={index}>

                <div className="testimonial-item">

                  <div className="row gy-4 justify-content-center">


                    <div className="col-lg-6">

                      <div className="testimonial-content">

                        <p>

                          <i className="bi bi-quote quote-icon-left"></i>

                          <span>
                            {book.description}
                          </span>

                          <i className="bi bi-quote quote-icon-right"></i>

                        </p>


                        <h3>
                          {book.title}
                        </h3>


                        <h4>
                          {book.subtitle}
                        </h4>


                        <p>
                          {book.info}
                        </p>


                      </div>

                    </div>



                    <div className="col-lg-2 text-center">

                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        <img
                          src={imagePath}
                          className="img-fluid testimonial-img"
                          alt={book.title}
                        />

                      </a>

                    </div>


                  </div>

                </div>


              </SwiperSlide>

            );

          })}


          <div className="swiper-pagination"></div>


        </Swiper>


      </div>


    </section>

  );

}


export default Books;