import ProfileCard from "./ProfileCard";

function About() {
  
    const website =
    `${window.location.origin}${import.meta.env.BASE_URL}`;

  
  return (
    <section id="about" className="about section">

      <div className="container section-title" data-aos="fade-up">
        <h2>Acerca de...</h2>

        <p>
          Técnico Programador Analista de Sistemas, Licenciado en Administración de las Finanzas, Licenciado en Contaduría Pública, Licenciado en Derecho e Ingeniero en Computación, con formación especializada en tecnologías de información, desarrollo de software, análisis de sistemas, transformación digital y aplicación de soluciones tecnológicas en los ámbitos financiero, administrativo y fiscal. Actualmente cursa Ingeniería en Desarrollo de Software y la Maestría en Dirección e Ingeniería de Software, fortaleciendo sus competencias en programación, arquitectura de software, innovación tecnológica y automatización de procesos. Es Contador Público certificado, Maestro en Derecho Fiscal, Master en Impuestos y Doctor en Derecho Fiscal, integrando una visión multidisciplinaria que combina tecnología, finanzas, contabilidad, administración y derecho. Se desempeña como catedrático a nivel licenciatura en las áreas de Ingeniería en Computación, Derecho, Administración y Contaduría Pública, así como en programas de Maestría y Doctorado. Actualmente ejerce como abogado y contador público independiente, además de desarrollar actividades relacionadas con análisis financiero y mercados bursátiles. Es articulista de diversas revistas fiscales de circulación nacional e internacional y coautor de los libros “Defensa Fiscal. Estrategias básicas de impugnación en el juicio contencioso administrativo ante el TFJA”, “Revisiones electrónicas. La nueva facultad de las autoridades fiscales”, “Praxis del juicio contencioso administrativo en línea”, “Defensa Fiscal. Conceptos de impugnación ganadores/perdedores ante el TFJA” y “Estudio práctico del Régimen Opcional para Grupos de Sociedades”. Ha participado como ponente en temas de tecnología aplicada a los negocios, transformación digital, sistemas de información, finanzas, fiscalidad y administración, destacando por la integración del conocimiento tecnológico con las áreas jurídica, contable y empresarial.
        </p>

      </div>


      <div className="container" data-aos="fade-up" data-aos-delay="100">

        <div className="row gy-4 justify-content-center">

          <div className="col-lg-4">
            <ProfileCard
              name="Manuel Parra"
              title="Dr. en Derecho Fiscal"
              handle="manuelparra"
              status="Disponible"
              contactText="Contactar"
              avatarUrl={`${import.meta.env.BASE_URL}img/profile-img.jpg`}
              showUserInfo={false}
              enableTilt={true}
              enableMobileTilt={true}
              onContactClick={() => console.log("Contact clicked")}
              behindGlowColor="rgba(125, 190, 255, 0.67)"
              iconUrl={`${import.meta.env.BASE_URL}img/iconpattern.png`}
              behindGlowEnabled={true}
              innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
              grainUrl={`${import.meta.env.BASE_URL}img/grain.webp`}
            />
          </div>


          <div className="col-lg-8 content">

            <h2>
              Dr. en Derecho Fiscal, Trader &amp; Desarrollador de Software.
            </h2>

            <p className="fst-italic py-3">
              Profesional con formación en Derecho Fiscal, Contaduría, Finanzas y Sistemas Computacionales, enfocado en el desarrollo de soluciones tecnológicas y administrativas. Experiencia en desarrollo de software, análisis fiscal y gestión empresarial.
            </p>


            <div className="row">

              <div className="col-lg-6">
                <ul>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Especialidad:</strong>
                    <span>Derecho Fiscal &amp; Tecnología</span>
                  </li>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Website:</strong>

                    <span>
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {website}
                      </a>
                    </span>

                  </li>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Experiencia:</strong>
                    <span>Impuestos, Software y Finanzas</span>
                  </li>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Ubicación:</strong>
                    <span>Chilpancingo, Guerrero, México</span>
                  </li>

                </ul>
              </div>


              <div className="col-lg-6">
                <ul>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Grado Académico:</strong>
                    <span>Doctorado</span>
                  </li>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Enfoque:</strong>
                    <span>Tecnología, Finanzas e Impuestos</span>
                  </li>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Email:</strong>
                    <span>contador.manuel0@gmail.com</span>
                  </li>

                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Disponibilidad:</strong>
                    <span>Proyectos y colaboraciones</span>
                  </li>

                </ul>
              </div>

            </div>


            <p className="py-3">
              Interés constante en la innovación tecnológica, el análisis financiero, la defensa fiscal, contabilidad y el desarrollo de herramientas digitales aplicadas al ámbito profesional y empresarial.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default About;