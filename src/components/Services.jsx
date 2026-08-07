function Services() {
  return (
    <section id="services" className="services section">

      <div className="container section-title" data-aos="fade-up">
        <h2>Áreas de Especialización</h2>

        <p>
          Perfil profesional multidisciplinario con experiencia en Derecho Fiscal,
          Contaduría, Administración, Sistemas Computacionales y Docencia Universitaria.
        </p>
      </div>


      <div className="container">

        <div className="row gy-4">


          <ServiceItem
            delay="100"
            color="item-cyan"
            icon="bi-bank"
            title="Derecho Fiscal"
          >
            Análisis jurídico tributario, interpretación normativa y estudio
            de las disposiciones fiscales aplicables a personas y organizaciones.
          </ServiceItem>


          <ServiceItem
            delay="200"
            color="item-orange"
            icon="bi-calculator"
            title="Contaduría y Finanzas"
          >
            Gestión contable, análisis financiero, administración de recursos
            y cumplimiento de obligaciones fiscales.
          </ServiceItem>


          <ServiceItem
            delay="300"
            color="item-teal"
            icon="bi-mortarboard"
            title="Docencia Universitaria"
          >
            Formación académica, impartición de clases y desarrollo de
            contenidos en áreas jurídicas, administrativas y tecnológicas.
          </ServiceItem>


          <ServiceItem
            delay="400"
            color="item-red"
            icon="bi-code-slash"
            title="Desarrollo de Software"
          >
            Programación, desarrollo web, bases de datos y creación de
            soluciones tecnológicas para optimizar procesos.
          </ServiceItem>


          <ServiceItem
            delay="500"
            color="item-indigo"
            icon="bi-cpu"
            title="Transformación Digital"
          >
            Automatización de procesos administrativos, implementación de
            herramientas digitales y mejora de la gestión empresarial.
          </ServiceItem>


          <ServiceItem
            delay="600"
            color="item-pink"
            icon="bi-lightbulb"
            title="Investigación e Innovación"
          >
            Investigación aplicada, análisis interdisciplinario e integración
            de conocimiento jurídico, administrativo y tecnológico.
          </ServiceItem>


        </div>

      </div>

    </section>
  );
}



function ServiceItem({
  delay,
  color,
  icon,
  title,
  children
}) {

  return (

    <div
      className="col-lg-4 col-md-6"
      data-aos="fade-up"
      data-aos-delay={delay}
    >

      <div className={`service-item ${color} position-relative`}>

        <div className="icon">

          <svg
            width="100"
            height="100"
            viewBox="0 0 600 600"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              stroke="none"
              strokeWidth="0"
              fill="#f5f5f5"
              d="M300,521.0016835830174C376.1290562159157,517.8887921683347,466.0731472004068,529.7835943286574,510.70327084640275,468.03025145048787C554.3714126377745,407.6079735673963,508.03601936045806,328.9844924480964,491.2728898941984,256.3432110539036C474.5976632858925,184.082847569629,479.9380746630129,96.60480741107993,416.23090153303,58.64404602377083C348.86323505073057,18.502131276798302,261.93793281208167,40.57373210992963,193.541080693966,78.93577620505333C130.42746243093433,114.334589627462,98.30271207620316,179.96522072025542,76.75703585869454,249.04625023123273C51.97151888228291,328.5150500222984,13.704378332031375,421.85034740162234,66.52175969318447,486.19268352777647C119.04800174914682,550.1803526380478,217.28368757567262,524.383925680826,300,521.0016835830174"
            />

          </svg>


          <i className={`bi ${icon}`}></i>

        </div>


        <h3>
          {title}
        </h3>


        <p>
          {children}
        </p>


      </div>

    </div>

  );
}


export default Services;