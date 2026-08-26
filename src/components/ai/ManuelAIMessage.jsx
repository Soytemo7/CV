export default function ManuelAIMessage({
  role,
  content
}) {

  const isUser =
    role === "user";


  return (

    <div
      className={
        `manuel-ai-message ${
          isUser
            ? "manuel-ai-message--user"
            : "manuel-ai-message--assistant"
        }`
      }
    >

      {!isUser && (

        <div
          className="manuel-ai-message__avatar"
          aria-hidden="true"
        >

          <img
            src={
              `${import.meta.env.BASE_URL}img/manuel-ai.png`
            }
            alt=""
          />

        </div>

      )}


      <div
        className="manuel-ai-message__content"
      >
        {content}
      </div>

    </div>

  );

}