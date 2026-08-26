import { useEffect, useRef } from "react";

import "../../styles/mouse-particle-trail.css";


const MAX_PARTICLES = 1000;

const MIN_DISTANCE = 6;

const MIN_INTERVAL = 30;


const MouseParticleTrail = () => {

  const containerRef =
    useRef(null);

  const particlesRef =
    useRef([]);

  const lastXRef =
    useRef(0);

  const lastYRef =
    useRef(0);

  const lastTimeRef =
    useRef(0);


  useEffect(() => {

    // ========================================================
    // DISPOSITIVOS TÁCTILES
    // ========================================================

    const mediaQuery =
      window.matchMedia("(pointer: fine)");


    if (!mediaQuery.matches) {
      return undefined;
    }


    const container =
      containerRef.current;


    if (!container) {
      return undefined;
    }


    // ========================================================
    // CREAR PARTICULA
    // ========================================================

    const createParticle =
      (x, y) => {

        if (
          particlesRef.current.length >=
          MAX_PARTICLES
        ) {
          return;
        }


        const particle =
          document.createElement("span");


        particle.className =
          "mouse-particle";


        // ====================================================
        // COLOR
        // ====================================================

        const particleType =
          Math.random();


        if (
          particleType < 0.45
        ) {

          particle.classList.add(
            "mouse-particle-blue"
          );

        } else if (
          particleType < 0.80
        ) {

          particle.classList.add(
            "mouse-particle-cyan"
          );

        } else {

          particle.classList.add(
            "mouse-particle-white"
          );

        }


        // ====================================================
        // TAMAÑO
        // ====================================================

        const size =
          Math.random() * 5 + 2;


        // ====================================================
        // DURACION
        // ====================================================

        const duration =
          Math.random() * 1.2 + 1.4;


        // ====================================================
        // APERTURA HORIZONTAL
        //
        // Cada particula obtiene su propio destino.
        //
        // Algunas:
        //   ← izquierda
        //
        // Otras:
        //   ↑ centro
        //
        // Otras:
        //   → derecha
        // ====================================================

        const driftX =
          (Math.random() - 0.5) * 200;


        // ====================================================
        // ALTURA
        //
        // No todas llegan exactamente a la misma altura.
        // ====================================================

        const rise =
          Math.random() * 80 + 150;


        // ====================================================
        // PEQUEÑA VARIACION DE ESCALA
        // ====================================================

        const finalScale =
          Math.random() * 0.3 + 0.25;


        // ====================================================
        // OPACIDAD
        // ====================================================

        const opacity =
          Math.random() * 0.35 + 0.45;


        // ====================================================
        // POSICION INICIAL
        // ====================================================

        particle.style.left =
          `${x}px`;

        particle.style.top =
          `${y}px`;


        // ====================================================
        // DIMENSIONES
        // ====================================================

        particle.style.width =
          `${size}px`;

        particle.style.height =
          `${size}px`;


        // ====================================================
        // PROPIEDADES DE ANIMACION
        // ====================================================

        particle.style.opacity =
          opacity;


        particle.style.setProperty(
          "--particle-drift-x",
          `${driftX}px`
        );


        particle.style.setProperty(
          "--particle-rise",
          `${rise}px`
        );


        particle.style.setProperty(
          "--particle-final-scale",
          finalScale
        );


        particle.style.animationDuration =
          `${duration}s`;


        // ====================================================
        // INSERTAR
        // ====================================================

        container.appendChild(
          particle
        );


        particlesRef.current.push(
          particle
        );


        // ====================================================
        // LIMPIEZA
        // ====================================================

        particle.addEventListener(
          "animationend",
          () => {

            particle.remove();


            particlesRef.current =
              particlesRef.current.filter(
                item =>
                  item !== particle
              );

          },
          {
            once: true
          }
        );

      };


    // ========================================================
    // MOVIMIENTO DEL MOUSE
    // ========================================================

    const handleMouseMove =
      (event) => {

        const now =
          performance.now();


        // ----------------------------------------------------
        // THROTTLE
        // ----------------------------------------------------

        if (
          now -
          lastTimeRef.current <
          MIN_INTERVAL
        ) {
          return;
        }


        const x =
          event.clientX;


        const y =
          event.clientY;


        // ----------------------------------------------------
        // DISTANCIA RECORRIDA
        // ----------------------------------------------------

        const dx =
          x -
          lastXRef.current;


        const dy =
          y -
          lastYRef.current;


        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );


        if (
          distance <
          MIN_DISTANCE
        ) {
          return;
        }


        lastXRef.current =
          x;


        lastYRef.current =
          y;


        lastTimeRef.current =
          now;


        // ====================================================
        // CANTIDAD
        // ====================================================

        const particleCount =
          Math.floor(
            Math.random() * 3
          ) + 3;


        for (
          let i = 0;
          i < particleCount;
          i += 1
        ) {

          createParticle(
            x,
            y
          );

        }

      };


    // ========================================================
    // EVENTO
    // ========================================================

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );


    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );


      particlesRef.current.forEach(
        particle => {
          particle.remove();
        }
      );


      particlesRef.current =
        [];

    };

  }, []);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      ref={containerRef}
      className="mouse-particle-trail"
      aria-hidden="true"
    />

  );

};


export default MouseParticleTrail;