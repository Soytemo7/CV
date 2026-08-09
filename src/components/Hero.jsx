import useTyped from "../hooks/useTyped";

function Hero() {

  useTyped();

  return (
    <section
      id="hero"
      className="hero section"
    >

      <img
        src={`${import.meta.env.BASE_URL}img/hero-bg.jpg`}
        alt=""
      />


      <div
        className="container"
        data-aos="zoom-out"
      >

        <div className="row justify-content-center">

          <div className="col-lg-9">

            <h2>
              Manuel C. Parra Flores
            </h2>


            <p>
              Soy{" "}

              <span
                className="typed"
                data-typed-items="
                  Dr. en Derecho Fiscal,
                  Maestro en Derecho Fiscal,
                  Lic. en Contaduría Pública,
                  Lic. en Derecho,
                  Lic. en Administración de las Finanzas,
                  Lic. en Ingeniería en Sistemas Computacionales,
                  Técnico Programador Analista de Sistemas
                "
              >
              </span>


              <span
                className="typed-cursor typed-cursor--blink"
                aria-hidden="true"
              ></span>

            </p>



            <div className="social-links">


              <a
                href="https://www.facebook.com/manuelcuauhtemoc.parraflores.9/"
                target="_blank"
                rel="noreferrer"
              >

                <i className="bi bi-facebook"></i>

              </a>



              <a
                href="https://www.instagram.com/manuelcuauhtemoc/"
                target="_blank"
                rel="noreferrer"
              >

                <i className="bi bi-instagram"></i>

              </a>


            </div>


          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;