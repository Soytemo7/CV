function Stats() {
  return (
    <section id="stats" className="stats section">

      <div className="container" data-aos="fade-up" data-aos-delay="100">

        <div className="row gy-4">

          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <i className="bi bi-emoji-smile"></i>

            <div className="stats-item">
              <span
                data-purecounter-start="0"
                data-purecounter-end="7"
                data-purecounter-duration="1"
                className="purecounter"
              ></span>

              <p>Formaciones Profesionales</p>
            </div>
          </div>


          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <i className="bi bi-journal-richtext"></i>

            <div className="stats-item">
              <span
                data-purecounter-start="0"
                data-purecounter-end="15"
                data-purecounter-duration="1"
                className="purecounter"
              ></span>

              <p>Tecnologías Utilizadas</p>
            </div>
          </div>


          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <i className="bi bi-headset"></i>

            <div className="stats-item">
              <span
                data-purecounter-start="0"
                data-purecounter-end="21"
                data-purecounter-duration="1"
                className="purecounter"
              ></span>

              <p>Años de Experiencia</p>
            </div>
          </div>


          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <i className="bi bi-people"></i>

            <div className="stats-item">
              <span
                data-purecounter-start="0"
                data-purecounter-end="5"
                data-purecounter-duration="1"
                className="purecounter"
              ></span>

              <p>Sectores de Experiencia</p>
            </div>
          </div>


        </div>

      </div>

    </section>
  );
}

export default Stats;