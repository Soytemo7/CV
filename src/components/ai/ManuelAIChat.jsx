import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  sendAIMessage
} from "../../services/aiService.js";

import ManuelAIMessage from "./ManuelAIMessage.jsx";
import ManuelAITyping from "./ManuelAITyping.jsx";


const MAX_QUESTION_LENGTH = 500;


export default function ManuelAIChat({
  onClose
}) {

  const [
    messages,
    setMessages
  ] = useState([]);


  const [
    question,
    setQuestion
  ] = useState("");


  const [
    isLoading,
    setIsLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const messagesRef =
    useRef(null);


  const inputRef =
    useRef(null);


  useEffect(() => {

    inputRef.current?.focus();

  }, []);


  useEffect(() => {

    if (!messagesRef.current) {
      return;
    }


    messagesRef.current.scrollTop =
      messagesRef.current.scrollHeight;

  }, [
    messages,
    isLoading
  ]);


  async function handleSubmit(event) {

    event.preventDefault();


    const cleanQuestion =
      question.trim();


    if (!cleanQuestion) {
      return;
    }


    if (
      cleanQuestion.length >
      MAX_QUESTION_LENGTH
    ) {

      setError(
        `La pregunta no puede superar los ${MAX_QUESTION_LENGTH} caracteres.`
      );

      return;

    }


    if (isLoading) {
      return;
    }


    setError("");


    setMessages(
      previous => [
        ...previous,

        {
          id:
            crypto.randomUUID(),

          role:
            "user",

          content:
            cleanQuestion
        }
      ]
    );


    setQuestion("");
    setIsLoading(true);


    try {

      const result =
        await sendAIMessage(
          cleanQuestion
        );


      setMessages(
        previous => [
          ...previous,

          {
            id:
              crypto.randomUUID(),

            role:
              "assistant",

            content:
              result.answer
          }
        ]
      );


    } catch (requestError) {

      setError(
        requestError.message ||
        "No fue posible procesar la pregunta."
      );


    } finally {

      setIsLoading(false);

    }

  }


  return (

    <section
      className="manuel-ai-chat"
      aria-label="Manuel IA"
    >

      {/* =====================================================
          CABECERA
          ===================================================== */}

      <header
        className="manuel-ai-chat__header"
      >

        <div
          className="manuel-ai-chat__identity"
        >

          <div
            className="manuel-ai-chat__mini-avatar"
          >

            <img
              src={
                `${import.meta.env.BASE_URL}img/manuel-ai.png`
              }
              alt=""
            />

          </div>


          <div
            className="manuel-ai-chat__identity-text"
          >

            <h2>
              Manuel IA
            </h2>

            <span>
              Asistente personal
            </span>

          </div>

        </div>


        <button
          type="button"
          className="manuel-ai-chat__close"
          onClick={onClose}
          aria-label="Cerrar Manuel IA"
        >
          ×
        </button>

      </header>


      {/* =====================================================
          MENSAJES
          ===================================================== */}

      <div
        ref={messagesRef}
        className="manuel-ai-chat__messages"
      >

        {messages.length === 0 && (

          <div
            className="manuel-ai-chat__welcome"
          >

            <h3>
              Hola 👋
            </h3>

            <p>
              Soy Manuel IA.
              Puedes preguntarme sobre Manuel,
              su formación, proyectos,
              experiencia, tecnologías e intereses.
            </p>

          </div>

        )}


        {messages.map(
          message => (

            <ManuelAIMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />

          )
        )}


        {isLoading && (
          <ManuelAITyping />
        )}

      </div>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (

        <div
          className="manuel-ai-chat__error"
          role="alert"
        >
          {error}
        </div>

      )}


      {/* =====================================================
          FORMULARIO
          ===================================================== */}

      <form
        className="manuel-ai-chat__form"
        onSubmit={handleSubmit}
      >

        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={
            event =>
              setQuestion(
                event.target.value
              )
          }
          placeholder="Pregúntale a Manuel IA..."
          maxLength={MAX_QUESTION_LENGTH}
          disabled={isLoading}
          aria-label="Pregunta para Manuel IA"
        />


        <button
          type="submit"
          disabled={
            isLoading ||
            !question.trim()
          }
          aria-label="Enviar pregunta"
        >
          ➤
        </button>

      </form>

    </section>

  );

}