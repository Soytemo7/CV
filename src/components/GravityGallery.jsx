import { useEffect, useRef } from "react";
import Matter from "matter-js";

const M = Matter;

const IMAGES = [
  `${import.meta.env.BASE_URL}img/revistas/revista1.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista2.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista3.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista4.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista5.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista6.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista7.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista8.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista9.jpg`,
  `${import.meta.env.BASE_URL}img/revistas/revista10.jpg`,
];

const ITEM_SIZE = 150;

function GravityGallery() {

  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {

    const container = containerRef.current;

    if (!container) {
      return;
    }

    /*
     * La física solamente comienza cuando
     * la galería entra en la pantalla.
     */
    const observer = new IntersectionObserver(
      (entries) => {

        const entry = entries[0];

        if (!entry.isIntersecting || startedRef.current) {
          return;
        }

        startedRef.current = true;

        observer.disconnect();

        startPhysics();

      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(container);


    function startPhysics() {

      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) {
        return;
      }

      const engine = M.Engine.create({
        enableSleeping: false,

        gravity: {
          x: 0,
          y: 1,
        },
      });

      const wallThickness = 100;

      const floor = M.Bodies.rectangle(
        width / 2,
        height - wallThickness / 2,
        width + wallThickness * 2,
        wallThickness,
        {
          isStatic: true,
        }
      );   

      const leftWall = M.Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height + wallThickness * 2,
        {
          isStatic: true,
        }
      );


      const rightWall = M.Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height + wallThickness * 2,
        {
          isStatic: true,
        }
      );


      M.Composite.add(
        engine.world,
        [
          floor,
          leftWall,
          rightWall,
        ]
      );


      const bodies = [];


      IMAGES.forEach((_, index) => {

        const column = index % 5;
        const row = Math.floor(index / 5);

        const spacing =
          Math.max(
            ITEM_SIZE + 10,
            (width - ITEM_SIZE) / 4
          );


        const x =
          ITEM_SIZE / 2 +
          column * spacing;


        const y =
          -ITEM_SIZE -
          row * (ITEM_SIZE + 80) -
          Math.random() * 250;


        const body =
          M.Bodies.rectangle(
            x,
            y,
            ITEM_SIZE,
            ITEM_SIZE,
            {
              restitution: 0.35,
              friction: 0.7,
              frictionAir: 0.015,
              density: 0.001,

              chamfer: {
                radius: 4,
              },
            }
          );


        M.Body.setAngle(
          body,
          (Math.random() - 0.5) * 0.5
        );


        bodies.push(body);

      });


      M.Composite.add(
        engine.world,
        bodies
      );


      const mouse =
        M.Mouse.create(container);


      const mouseConstraint =
        M.MouseConstraint.create(
          engine,
          {
            mouse,

            constraint: {
              stiffness: 0.92,
              damping: 0.08,
              angularStiffness: 0,

              render: {
                visible: false,
              },
            },
          }
        );


      M.Composite.add(
        engine.world,
        mouseConstraint
      );


      /*
       * Permitimos que la rueda del mouse
       * continúe desplazando la página.
       */
      mouse.element.removeEventListener(
        "wheel",
        mouse.mousewheel
      );

      mouse.element.removeEventListener(
        "mousewheel",
        mouse.mousewheel
      );

      mouse.element.removeEventListener(
        "DOMMouseScroll",
        mouse.mousewheel
      );


      const elements =
        Array.from(
          container.querySelectorAll(
            "[data-gravity-item]"
          )
        );


      let draggedBody = null;


      M.Events.on(
        mouseConstraint,
        "startdrag",
        (event) => {

          draggedBody = event.body;

        }
      );


      M.Events.on(
        mouseConstraint,
        "enddrag",
        () => {

          draggedBody = null;

        }
      );


      const update = () => {

        M.Engine.update(
          engine,
          1000 / 60
        );


        bodies.forEach(
          (body, index) => {

            const element =
              elements[index];

            if (!element) {
              return;
            }


            element.style.transform =
              `translate3d(
                ${body.position.x - ITEM_SIZE / 2}px,
                ${body.position.y - ITEM_SIZE / 2}px,
                0
              )
              rotate(${body.angle}rad)`;


            if (body === draggedBody) {

              element.classList.add(
                "is-dragging"
              );

            } else {

              element.classList.remove(
                "is-dragging"
              );

            }

          }
        );


        animationRef.current =
          requestAnimationFrame(update);

      };


      update();


      /*
       * Limpieza de Matter.js.
       */
      container._gravityCleanup = () => {

        if (animationRef.current) {

          cancelAnimationFrame(
            animationRef.current
          );

          animationRef.current = null;

        }


        M.Events.off(
          mouseConstraint,
          "startdrag"
        );


        M.Events.off(
          mouseConstraint,
          "enddrag"
        );


        M.World.clear(
          engine.world,
          false
        );


        M.Engine.clear(
          engine
        );

      };

    }


    return () => {

      observer.disconnect();

      if (container._gravityCleanup) {

        container._gravityCleanup();

        delete container._gravityCleanup;

      }

    };

  }, []);


  return (

    <div className="container gravity-gallery-wrapper">

      <div
        ref={containerRef}
        className="gravity-gallery"
      >

        {IMAGES.map(
          (image, index) => (

            <div
              key={index}
              data-gravity-item=""
              className="gravity-gallery-item"
            >

              <img
                src={image}
                alt={`Revista académica ${index + 1}`}
                draggable="false"
              />

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default GravityGallery;