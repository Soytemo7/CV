export default function ManuelAIAvatar({
  isOpen,
  onClick
}) {

  const avatarUrl =
    `${import.meta.env.BASE_URL}img/manuel-ai.png`;


  return (

    <button
      type="button"

      className={
        `manuel-ai-avatar ${
          isOpen
            ? "manuel-ai-avatar--open"
            : ""
        }`
      }

      onClick={onClick}

      aria-label={
        isOpen
          ? "Cerrar Manuel IA"
          : "Abrir Manuel IA"
      }
    >

      <img
        src={avatarUrl}
        alt="Manuel IA"
        className="manuel-ai-avatar__image"
      />

    </button>

  );

}