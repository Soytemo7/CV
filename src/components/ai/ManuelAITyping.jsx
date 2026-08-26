export default function ManuelAITyping() {

  return (

    <div
      className="manuel-ai-typing"
      aria-label="Manuel IA está escribiendo"
    >

      <div
        className="manuel-ai-typing__avatar"
        aria-hidden="true"
      >

        <img
          src={
            `${import.meta.env.BASE_URL}img/manuel-ai.png`
          }
          alt=""
        />

      </div>


      <div
        className="manuel-ai-typing__bubble"
        aria-hidden="true"
      >

        <span />
        <span />
        <span />

      </div>

    </div>

  );

}