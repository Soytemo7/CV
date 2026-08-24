import { Link } from "react-router-dom";
import "../../styles/privateIconButton.css";


/* ============================================================
   PRIVATE ICON BUTTON
   ============================================================ */

export default function PrivateIconButton({

  to,

  icon,

  label,

  ariaLabel,

  onClick,

  disabled = false,

}) {


  /* ============================================================
     CLASES
     ============================================================ */

  const className = [

    "private-icon-button",

    disabled
      ? "is-disabled"
      : "",

  ]
    .filter(Boolean)
    .join(" ");


  /* ============================================================
     CONTENIDO
     ============================================================ */

  const content = (

    <>

      {/* Efectos visuales */}

      <span
        className="private-icon-button-effect"
        aria-hidden="true"
      />


      {/* Icono dinámico */}

      <i
        className={`bi ${icon}`}
        aria-hidden="true"
      />


      {/* Texto opcional */}

      {label && (

        <span
          className="private-icon-button-label"
        >
          {label}
        </span>

      )}

    </>

  );


  /* ============================================================
     DESHABILITADO
     ============================================================ */

  if (disabled) {

    return (

      <span
        className={className}
        aria-disabled="true"
      >

        {content}

      </span>

    );

  }


  /* ============================================================
     NAVEGACIÓN
     ============================================================ */

  if (to) {

    return (

      <Link
        to={to}
        className={className}
        aria-label={ariaLabel || label}
        onClick={onClick}
      >

        {content}

      </Link>

    );

  }


  /* ============================================================
     BOTÓN / ACCIÓN
     ============================================================ */

  return (

    <button
      type="button"
      className={className}
      aria-label={ariaLabel || label}
      onClick={onClick}
    >

      {content}

    </button>

  );

}