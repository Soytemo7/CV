  import {
    useEffect,
    useState
  } from "react";

  import ManuelAIAvatar
    from "./ManuelAIAvatar.jsx";

  import ManuelAIChat
    from "./ManuelAIChat.jsx";

  import "../../styles/manuel-ai.css";


  export default function ManuelAI() {

    const [
      isOpen,
      setIsOpen
    ] = useState(false);


    const [
      greetingStep,
      setGreetingStep
    ] = useState(0);    

      /*
    * ============================================================
    * SECUENCIA DE PRESENTACIÓN
    *
    * 0 - 4 segundos   → Hola, soy Manuel IA.
    * 5 - 8 segundos   → Puedo ayudarte a conocer la formación.
    * 9 - 12 segundos  → experiencia y proyectos de Manuel.
    * 13 - 16 segundos → ¿En qué puedo ayudarte?
    * Después          → desaparece
    * ============================================================
    */

    useEffect(() => {

      const firstTimer =
        setTimeout(() => {

          setGreetingStep(1);

        }, 3000);


      const secondTimer =
        setTimeout(() => {

          setGreetingStep(2);

        }, 7000);


      const thirdTimer =
        setTimeout(() => {

          setGreetingStep(3);

        }, 11000);


      const finalTimer =
        setTimeout(() => {

          setGreetingStep(4);

        }, 15000);


      return () => {

        clearTimeout(firstTimer);
        clearTimeout(secondTimer);
        clearTimeout(thirdTimer);
        clearTimeout(finalTimer);

      };

    }, []);


    /*
    * ============================================================
    * ABRIR / CERRAR CHAT
    * ============================================================
    */

    function toggleChat() {

      setIsOpen(
        previous =>
          !previous
      );

    }


    function closeChat() {

      setIsOpen(false);

    }


      /*
    * ============================================================
    * MENSAJE ACTUAL
    * ============================================================
    */

    function getGreeting() {

      switch (greetingStep) {

        case 0:

          return (
            <>
              Hola, soy Manuel IA. 👋
            </>
          );


        case 1:

          return (
            <>
              Puedo ayudarte a conocer la formación...
            </>
          );


        case 2:

          return (
            <>
              experiencia y proyectos de Manuel 😄.
            </>
          );


        case 3:

          return (
            <>
              ¿En qué puedo ayudarte? 🤔
            </>
          );


        default:

          return null;

      }

    }

    return (

      <div
        className={
          `manuel-ai-widget ${
            isOpen
              ? "manuel-ai-widget--open"
              : ""
          }`
        }
      >

        {/*
        * ========================================================
        * MENSAJE DE PRESENTACIÓN
        * ========================================================
        */}

        {!isOpen &&
          greetingStep < 4 && (

          <div
            key={greetingStep}
            className="manuel-ai-greeting"
            role="status"
            aria-live="polite"
          >

            <span
              className="manuel-ai-greeting-text"
            >
              {getGreeting()}
            </span>

          </div>

        )}


        {/*
        * ========================================================
        * AVATAR
        * ========================================================
        */}

        <ManuelAIAvatar
          isOpen={isOpen}
          onClick={toggleChat}
        />


        {/*
        * ========================================================
        * CHAT
        * ========================================================
        */}

        {isOpen && (

          <ManuelAIChat
            onClose={closeChat}
          />

        )}

      </div>

    );

  }