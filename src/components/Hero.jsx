import useTyped from "../hooks/useTyped";
import "../styles/hero-social.css";

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


            {/*==================================================
            # SOCIAL LINKS
            ==================================================*/}

            <ul className="hero-social-links">


              {/*================================================
              # FACEBOOK
              =================================================*/}

              <li className="hero-social-item">

                <a
                  data-social="facebook"
                  aria-label="Facebook"
                  href="https://www.facebook.com/manuelcuauhtemoc.parraflores.9/"
                  target="_blank"
                  rel="noreferrer"
                >

                  <div className="hero-social-filled"></div>


                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >

                    <path
                      d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"
                    />

                  </svg>

                </a>


                <div className="hero-social-tooltip">
                  Facebook
                </div>

              </li>


              {/*================================================
              # INSTAGRAM
              =================================================*/}

              <li className="hero-social-item">

                <a
                  data-social="instagram"
                  aria-label="Instagram"
                  href="https://www.instagram.com/manuelcuauhtemoc/"
                  target="_blank"
                  rel="noreferrer"
                >

                  <div className="hero-social-filled"></div>


                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >

                    <path
                      d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42C12.73.222 12.148.087 11.297.048 10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-2.388-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"
                    />

                  </svg>

                </a>


                <div className="hero-social-tooltip">
                  Instagram
                </div>

              </li>

              {/*================================================
              # GITHUB
              ================================================*/}

              <li className="hero-social-item">

                <a
                  data-social="github"
                  aria-label="GitHub"
                  href="https://github.com/soytemo7"
                  target="_blank"
                  rel="noreferrer"
                >

                  <div className="hero-social-filled"></div>


                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >

                    <path
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 4.58c1.02 0 2.05.14 3.01.42 2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12C24 5.37 18.63 0 12 0Z"
                    />

                  </svg>

                </a>


                <div className="hero-social-tooltip">
                  GitHub
                </div>

              </li>


            </ul>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;