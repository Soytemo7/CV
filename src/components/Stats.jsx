import { useEffect, useState } from "react";

function Counter({ end, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let animationFrame;
    let timeout;

    const startCounter = () => {
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(progress * end);

        setCount(currentValue);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
          setFinished(true);

          timeout = setTimeout(() => {
            setFinished(false);
            setCount(0);
            startCounter();
          }, 2000);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    startCounter();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [end, duration]);

  return (
    <span className={`stats-counter ${finished ? "stats-counter-finished" : ""}`}>
      {count}
    </span>
  );
}

function Stats() {
  return (
    <section id="stats" className="stats section">

      <div className="container" data-aos="fade-up" data-aos-delay="100">

        <div className="row gy-4">

          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">

            <i className="bi bi-emoji-smile"></i>

            <div className="stats-item">

              <Counter end={7} duration={1000} />

              <p>Formaciones Profesionales</p>

            </div>

          </div>


          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">

            <i className="bi bi-journal-richtext"></i>

            <div className="stats-item">

              <Counter end={15} duration={1000} />

              <p>Tecnologías Utilizadas</p>

            </div>

          </div>


          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">

            <i className="bi bi-headset"></i>

            <div className="stats-item">

              <Counter end={21} duration={1000} />

              <p>Años de Experiencia</p>

            </div>

          </div>


          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">

            <i className="bi bi-people"></i>

            <div className="stats-item">

              <Counter end={5} duration={1000} />

              <p>Sectores de Experiencia</p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Stats;