import "../../styles/social-tooltip.css";

function SocialTooltip() {

  const stopSidebarDrag = (event) => {
    event.stopPropagation();
  };


  return (

    <div className="social-tooltip">

      {/* BOTÓN CENTRAL */}
      <span className="social-tooltip-center">

        <i className="bi bi-send-fill"></i>

      </span>


      {/* FACEBOOK — ARRIBA */}
      <a
        href="https://www.facebook.com/manuelcuauhtemoc.parraflores.9/"
        target="_blank"
        rel="noopener noreferrer"
        className="social-tooltip-item social-tooltip-facebook"
        aria-label="Facebook"
        onPointerDown={stopSidebarDrag}
        onPointerMove={stopSidebarDrag}
        onPointerUp={stopSidebarDrag}
        onClick={stopSidebarDrag}
      >

        <i className="bi bi-facebook"></i>

      </a>


      {/* INSTAGRAM — DERECHA */}
      <a
        href="https://www.instagram.com/manuelcuauhtemoc/"
        target="_blank"
        rel="noopener noreferrer"
        className="social-tooltip-item social-tooltip-instagram"
        aria-label="Instagram"
        onPointerDown={stopSidebarDrag}
        onPointerMove={stopSidebarDrag}
        onPointerUp={stopSidebarDrag}
        onClick={stopSidebarDrag}
      >

        <i className="bi bi-instagram"></i>

      </a>


      {/* TWITTER / X — ABAJO */}
      <a
        href="https://twitter.com/TU_USUARIO"
        target="_blank"
        rel="noopener noreferrer"
        className="social-tooltip-item social-tooltip-twitter"
        aria-label="Twitter"
        onPointerDown={stopSidebarDrag}
        onPointerMove={stopSidebarDrag}
        onPointerUp={stopSidebarDrag}
        onClick={stopSidebarDrag}
      >

        <i className="bi bi-twitter"></i>

      </a>


      {/* GITHUB — IZQUIERDA */}
      <a
        href="https://github.com/Soytemo7"
        target="_blank"
        rel="noopener noreferrer"
        className="social-tooltip-item social-tooltip-github"
        aria-label="GitHub"
        onPointerDown={stopSidebarDrag}
        onPointerMove={stopSidebarDrag}
        onPointerUp={stopSidebarDrag}
        onClick={stopSidebarDrag}
      >

        <i className="bi bi-github"></i>

      </a>

    </div>

  );

}


export default SocialTooltip;