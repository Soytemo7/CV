function Footer() {
  return (
    <footer
      id="footer"
      className="footer position-relative light-background"
    >

      <div className="container">

        <h3 className="sitename">
          Dr. Manuel Parra
        </h3>

        <p>
          Profesional multidisciplinario en Derecho Fiscal,
          Contaduría, Administración y Sistemas,
          con experiencia en docencia, investigación y
          transformación digital.
        </p>


        <div className="social-links d-flex justify-content-center">

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



        <div className="container">


          <div className="copyright">

            <span>
              Copyright
            </span>


            <strong className="px-1 sitename">
              Manuel Parra
            </strong>


            <span>
              Todos los derechos reservados
            </span>


          </div>




          <div className="credits">

            Diseño original por{" "}

            <a
              href="https://bootstrapmade.com/"
              target="_blank"
              rel="noreferrer"
            >
              BootstrapMade (Alex Smith)
            </a>


            {" "}distribuido por{" "}


            <a
              href="https://themewagon.com/"
              target="_blank"
              rel="noreferrer"
            >
              ThemeWagon
            </a>


            <br />


            Adaptación, personalización y contenido realizado por{" "}

            <strong>
              Manuel Parra
            </strong>


          </div>


        </div>


      </div>


    </footer>
  );
}


export default Footer;