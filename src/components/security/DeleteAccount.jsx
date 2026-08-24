import { useState } from "react";
import { useNotification } from "../../hooks/useNotification";
import "../../styles/delete-account.css";

const API_URL = import.meta.env.VITE_API_URL;

const DeleteAccount = () => {
  const notification = useNotification();

  const [confirmation, setConfirmation] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // VALIDACIONES
  // ============================================================

  const confirmationValid =
    confirmation === "ELIMINAR";

  const tokenValid =
    /^\d{6}$/.test(token);

  const canDelete =
    confirmationValid &&
    tokenValid &&
    !loading;

  // ============================================================
  // CAMBIO CONFIRMACIÓN
  // ============================================================

  const handleConfirmationChange = (event) => {
    setConfirmation(
      event.target.value.toUpperCase()
    );
  };

  // ============================================================
  // CAMBIO TOTP
  // ============================================================

  const handleTokenChange = (event) => {
    const value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 6);

    setToken(value);
  };

  // ============================================================
  // ELIMINAR CUENTA
  // ============================================================

  const handleDeleteAccount = async () => {
    if (!confirmationValid) {
      notification.error({
        title: "Confirmación requerida",
        description:
          "Debes escribir ELIMINAR para continuar."
      });

      return;
    }

    if (!tokenValid) {
      notification.error({
        title: "Código TOTP requerido",
        description:
          "Debes proporcionar un código de autenticación de 6 dígitos."
      });

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/delete-account`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            confirmation,
            token
          })
        }
      );

      const data =
        await response.json().catch(
          () => ({})
        );

      // ========================================================
      // ERROR DEL BACKEND
      // ========================================================

      if (!response.ok) {
        throw new Error(
          data?.error ||
          "No fue posible eliminar la cuenta."
        );
      }

      // ========================================================
      // ÉXITO
      // ========================================================

      notification.success({
        title: "Cuenta eliminada",
        description:
          "Tu cuenta y sus datos fueron eliminados permanentemente."
      });

      /*
       * El backend ya eliminó:
       *
       * - sesión
       * - deviceId
       * - sesiones MongoDB
       * - credenciales
       * - Passkeys
       * - 2FA
       * - historial
       * - dispositivos
       * - cuenta Firebase
       *
       * También limpió las cookies desde el servidor.
       */

      setTimeout(() => {
        window.location.href = import.meta.env.PROD
          ? "/CV/login"
          : "/login";
      }, 900);

    } catch (error) {
      console.error(
        "❌ Error eliminando cuenta:",
        error
      );

      notification.error({
        title: "No se pudo eliminar la cuenta",
        description:
          error?.message ||
          "Ocurrió un error inesperado."
      });

    } finally {
      /*
       * IMPORTANTE:
       * Evita que el botón se quede permanentemente
       * en "Eliminando cuenta..." después de un error.
       */
      setLoading(false);
    }
  };

  return (
    <section
      className="private-card private-delete-account-card"
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="private-card-header">

        <div className="private-delete-account-icon">
          <i className="bi bi-trash3" />
        </div>

        <div>
          <h2>
            Eliminar cuenta
          </h2>

          <p>
            Eliminación permanente de tu cuenta y datos
          </p>
        </div>

      </div>


      {/* ======================================================
          ADVERTENCIA
          ====================================================== */}

      <div className="private-delete-account-warning">

        <div className="private-delete-account-warning-icon">
          <i className="bi bi-exclamation-triangle" />
        </div>

        <div className="private-delete-account-warning-content">

          <strong>
            Esta acción es permanente
          </strong>

          <span>
            Al eliminar tu cuenta se eliminarán permanentemente
            tus datos, sesiones activas, dispositivos registrados,
            historial de accesos, credenciales de seguridad,
            Passkeys y configuración de autenticación de dos factores.
          </span>

        </div>

      </div>


      {/* ======================================================
          FORMULARIO
          ====================================================== */}

      <div className="private-delete-account-form">

        {/* ====================================================
            CONFIRMACIÓN
            ==================================================== */}

        <div className="private-delete-account-field">

          <label htmlFor="delete-account-confirmation">
            Confirmación
          </label>

          <input
            id="delete-account-confirmation"
            type="text"
            value={confirmation}
            onChange={handleConfirmationChange}
            placeholder="Escribe ELIMINAR"
            autoComplete="off"
            disabled={loading}
            spellCheck={false}
            className={
              confirmation.length > 0
                ? confirmationValid
                  ? "valid"
                  : "invalid"
                : ""
            }
          />

          <div
            className={
              `private-delete-account-validation ${
                confirmation.length === 0
                  ? ""
                  : confirmationValid
                    ? "valid"
                    : "invalid"
              }`
            }
          >

            <i
              className={
                confirmation.length === 0
                  ? "bi bi-info-circle"
                  : confirmationValid
                    ? "bi bi-check-circle"
                    : "bi bi-x-circle"
              }
            />

            <span>
              {confirmation.length === 0
                ? "Escribe exactamente ELIMINAR."
                : confirmationValid
                  ? "Confirmación correcta."
                  : "La confirmación debe ser exactamente ELIMINAR."
              }
            </span>

          </div>

        </div>


        {/* ====================================================
            TOTP
            ==================================================== */}

        <div className="private-delete-account-field">

          <label htmlFor="delete-account-token">
            Código de autenticación de dos factores
          </label>

          <div className="private-delete-account-token-wrapper">

            <input
              id="delete-account-token"
              type={
                showToken
                  ? "text"
                  : "password"
              }
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={token}
              onChange={handleTokenChange}
              placeholder="000000"
              autoComplete="one-time-code"
              disabled={loading}
              className={
                token.length > 0
                  ? tokenValid
                    ? "valid"
                    : "invalid"
                  : ""
              }
            />

            <button
              type="button"
              className="private-delete-account-token-toggle"
              onClick={() =>
                setShowToken(
                  previous => !previous
                )
              }
              disabled={loading}
              aria-label={
                showToken
                  ? "Ocultar código"
                  : "Mostrar código"
              }
            >

              <i
                className={
                  showToken
                    ? "bi bi-eye-slash"
                    : "bi bi-eye"
                }
              />

            </button>

          </div>

          <div className="private-delete-account-help">

            <i className="bi bi-shield-lock" />

            <span>
              Introduce el código actual de tu aplicación
              de autenticación.
            </span>

          </div>

        </div>


        {/* ====================================================
            BOTÓN
            ==================================================== */}

        <div className="private-delete-account-actions">

          <button
            type="button"
            className="private-delete-account-button"
            onClick={handleDeleteAccount}
            disabled={!canDelete}
          >

            <i
              className={
                loading
                  ? "bi bi-arrow-repeat"
                  : "bi bi-trash3"
              }
            />

            <span>
              {loading
                ? "Eliminando cuenta..."
                : "Eliminar cuenta permanentemente"
              }
            </span>

          </button>

        </div>

      </div>

    </section>
  );
};

export default DeleteAccount;