import React from "react";

/**
 * ============================================================
 * PROFILE — MODAL CONFIRMACIÓN DE NOMBRE OFICIAL
 * ============================================================
 */

const CertificateNameModal = ({
  certificateName,
  loading,
  onConfirm,
  onCancel,
}) => {

  return (
    <div
      className="
        private-profile-modal-overlay
      "
      role="presentation"
    >

      <div
        className="
          private-profile-modal
          animated-border
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-name-modal-title"
      >

        {/* ==================================================
            HEADER
            ================================================== */}

        <header
          className="
            private-profile-modal-header
          "
        >

          <div>

            <span className="private-page-eyebrow">
              Confirmación
            </span>

            <h2
              id="certificate-name-modal-title"
            >
              Confirmar nombre oficial
            </h2>

          </div>


          <button
            type="button"
            className="
              app-button
              app-button-red
            "
            onClick={onCancel}
            disabled={loading}
            aria-label="Cerrar"
            title="Cerrar"
          >

            <i className="bi bi-x-lg" />

          </button>

        </header>


        {/* ==================================================
            CONTENIDO
            ================================================== */}

        <div
          className="
            private-profile-modal-content
          "
        >

          <div
            className="
              private-profile-modal-icon
            "
          >

            <i className="bi bi-patch-check" />

          </div>


          <p>
            Este nombre aparecerá en tus
            constancias académicas.
          </p>


          <div
            className="
              private-profile-modal-name
            "
          >

            <span>
              Nombre oficial
            </span>

            <strong>
              {certificateName}
            </strong>

          </div>


          <p
            className="
              private-profile-modal-warning
            "
          >
            Verifica que esté escrito exactamente
            como deseas que aparezca en tus documentos.
          </p>

        </div>


        {/* ==================================================
            ACTIONS
            ================================================== */}

        <div
          className="
            private-profile-modal-actions
          "
        >

          <button
            type="button"
            className="
              app-button
              app-button-red
            "
            onClick={onCancel}
            disabled={loading}
          >

            <i className="bi bi-x-lg" />

            <span>
              Cancelar
            </span>

          </button>


          <button
            type="button"
            className="
              app-button
              app-button-blue
            "
            onClick={onConfirm}
            disabled={loading}
          >

            <i
              className={
                loading
                  ? "bi bi-hourglass-split"
                  : "bi bi-check-lg"
              }
            />

            <span>
              {loading
                ? "Guardando..."
                : "Confirmar nombre"}
            </span>

          </button>

        </div>

      </div>

    </div>
  );
};

export default CertificateNameModal;