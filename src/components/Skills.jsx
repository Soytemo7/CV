import useSkillsAnimation from "../hooks/useSkillsAnimation";
import RippleDistortion from "../components/RippleDistortion";

function Skills() {

    useSkillsAnimation();

  return (
    <section id="skills" className="skills section">

      <div className="container section-title" data-aos="fade-up">
        <h2>Habilidades</h2>
        <p>
          Perfil multidisciplinario con experiencia en tecnología, contabilidad,
          finanzas y defensa fiscal, enfocado en el aprendizaje continuo y el
          desarrollo de soluciones eficientes.
        </p>
      </div>


      <div
        className="container"
        data-aos="fade-up"
        data-aos-delay="100"
      >

        <div className="row skills-content skills-animation">

          <div className="col-lg-6">

            <div className="progress">
              <span className="skill">
                <span>Defensa Fiscal</span>
                <i className="val">80%</i>
              </span>

              <div className="progress-bar-wrap">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow="80"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>


            <div className="progress">
              <span className="skill">
                <span>Contabilidad</span>
                <i className="val">85%</i>
              </span>

              <div className="progress-bar-wrap">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow="85"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>


            <div className="progress">
              <span className="skill">
                <span>Trading</span>
                <i className="val">67%</i>
              </span>

              <div className="progress-bar-wrap">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow="67"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

          </div>


          <div className="col-lg-6">

            <div className="progress">
              <span className="skill">
                <span>Desarrollo Web</span>
                <i className="val">66%</i>
              </span>

              <div className="progress-bar-wrap">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow="66"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>


            <div className="progress">
              <span className="skill">
                <span>Programación</span>
                <i className="val">62%</i>
              </span>

              <div className="progress-bar-wrap">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow="62"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>


            <div className="progress">
              <span className="skill">
                <span>Administración Financiera</span>
                <i className="val">75%</i>
              </span>

              <div className="progress-bar-wrap">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>

            <div
        className="container"
        data-aos="fade-up"
        data-aos-delay="100"
          style={{
          marginTop: "80px"
        }}
      >

        <div
          style={{
            width: "100%",
            height: "600px"
          }}
        >

          <RippleDistortion
            src={`${import.meta.env.BASE_URL}img/principal.jpg`}
            brushSize={150}
            strength={0.2}
            swirl={1}
            rings={4}
            grayscale
            spread={5}
            fade={3}
            spacing={15}
            dispersion={0}
            glint={0}
            tint="#0066ff"
            tintAmount={0.1}
            highlightColor="#ffffff"
            trigger="hover"
            clickStrength={2}
            quality="low"
            enabled
          />

        </div>

      </div>

    </section>
  );
}

export default Skills;