import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  AuthContext
} from "../../context/AuthContext.jsx";

import {
  useNotification
} from "../../hooks/useNotification.js";

import {
  changePassword
} from "../../services/authService.js";

import "../../styles/private/security.css";

import TwoFactorCard
  from "../../components/private/security/TwoFactorCard.jsx";


function Security() {

  const {
    getActiveSessions,
    logoutSession
  } = useContext(AuthContext);


  const notification =
    useNotification();


  // ============================================================
  // SESIONES
  // ============================================================

  const [
    sessions,
    setSessions
  ] = useState([]);


  const [
    loadingSessions,
    setLoadingSessions
  ] = useState(true);


  const [
    closingSessionId,
    setClosingSessionId
  ] = useState(null);


  const [
    error,
    setError
  ] = useState(null);


  // ============================================================
  // CAMBIO DE CONTRASEÑA
  // ============================================================

  const [
    currentPassword,
    setCurrentPassword
  ] = useState("");


  const [
    newPassword,
    setNewPassword
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");


  const [
    loadingPassword,
    setLoadingPassword
  ] = useState(false);


  const [
    showCurrentPassword,
    setShowCurrentPassword
  ] = useState(false);


  const [
    showNewPassword,
    setShowNewPassword
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);


  // ============================================================
  // SEGUNDO FACTOR PARA CAMBIO DE CONTRASEÑA
  // ============================================================

  const [
    requiresTwoFactor,
    setRequiresTwoFactor
  ] = useState(false);


  const [
    twoFactorMode,
    setTwoFactorMode
  ] = useState("totp");


  const [
    totpCode,
    setTotpCode
  ] = useState("");


  const [
    recoveryCode,
    setRecoveryCode
  ] = useState("");


  // ============================================================
  // REGLAS DE CONTRASEÑA
  // ============================================================

  const passwordRules = [

    {
      id: "min",
      label: "Mínimo 8 caracteres",
      valid:
        newPassword.length >= 8
    },

    {
      id: "max",
      label: "Máximo 50 caracteres",
      valid:
        newPassword.length <= 50
    },

    {
      id: "uppercase",
      label: "Al menos una mayúscula",
      valid:
        /[A-Z]/.test(newPassword)
    },

    {
      id: "lowercase",
      label: "Al menos una minúscula",
      valid:
        /[a-z]/.test(newPassword)
    },

    {
      id: "number",
      label: "Al menos un número",
      valid:
        /[0-9]/.test(newPassword)
    },

    {
      id: "special",
      label: "Al menos un carácter especial",
      valid:
        /[^A-Za-z0-9]/.test(newPassword)
    },

    {
      id: "match",
      label: "Las contraseñas coinciden",
      valid:
        newPassword.length > 0 &&
        newPassword === confirmPassword
    }

  ];


  const passwordValid =
    passwordRules.every(
      rule => rule.valid
    );


  // ============================================================
  // OBTENER SESIONES ACTIVAS
  // ============================================================

  useEffect(() => {

    let cancelled = false;


    const loadSessions = async () => {

      try {

        setLoadingSessions(true);
        setError(null);


        console.log(
          "🔵 Security: cargando sesiones"
        );


        const data =
          await getActiveSessions();


        if (!cancelled) {

          setSessions(
            data || []
          );

        }

      } catch (error) {

        if (!cancelled) {

          console.error(
            "❌ Error obteniendo sesiones:",
            error
          );


          setError(
            error.message ||
            "No fue posible obtener las sesiones activas."
          );

        }

      } finally {

        if (!cancelled) {

          setLoadingSessions(false);

        }

      }

    };


    loadSessions();


    return () => {

      cancelled = true;

    };

  }, [getActiveSessions]);


  // ============================================================
  // CAMBIO DE CONTRASEÑA
  // ============================================================

  const handleChangePassword = async (
    event
  ) => {

    event.preventDefault();


    if (loadingPassword) {

      return;

    }


    // ----------------------------------------------------------
    // CONTRASEÑA ACTUAL
    // ----------------------------------------------------------

    if (!currentPassword) {

      notification.error({

        title:
          "Contraseña actual requerida",

        description:
          "Ingresa tu contraseña actual.",

        placement: "topRight",

        duration: 8,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className:
          "welcome-notification"

      });

      return;

    }


    // ----------------------------------------------------------
    // VALIDACIÓN DE NUEVA CONTRASEÑA
    // ----------------------------------------------------------

    if (!passwordValid) {

      notification.error({

        title:
          "Contraseña no válida",

        description:
          "La nueva contraseña no cumple con todos los requisitos de seguridad.",

        placement: "topRight",

        duration: 8,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className:
          "welcome-notification"

      });

      return;

    }


    // ----------------------------------------------------------
    // VALIDACIÓN TOTP
    // ----------------------------------------------------------

    if (
      requiresTwoFactor &&
      twoFactorMode === "totp"
    ) {

      if (
        !/^\d{6}$/.test(
          totpCode
        )
      ) {

        notification.error({

          title:
            "Código TOTP inválido",

          description:
            "Introduce el código de 6 dígitos generado por tu aplicación autenticadora.",

          placement: "topRight",

          duration: 8,

          showProgress: true,

          pauseOnHover: true,

          closable: true,

          className:
            "welcome-notification"

        });

        return;

      }

    }


    // ----------------------------------------------------------
    // VALIDACIÓN CÓDIGO DE RECUPERACIÓN
    // ----------------------------------------------------------

    if (
      requiresTwoFactor &&
      twoFactorMode === "recovery"
    ) {

      if (
        !recoveryCode.trim()
      ) {

        notification.error({

          title:
            "Código de recuperación requerido",

          description:
            "Introduce uno de tus códigos de recuperación.",

          placement: "topRight",

          duration: 8,

          showProgress: true,

          pauseOnHover: true,

          closable: true,

          className:
            "welcome-notification"

        });

        return;

      }

    }


    // ----------------------------------------------------------
    // SOLICITUD
    // ----------------------------------------------------------

    try {

      setLoadingPassword(true);


      const response =
        await changePassword(

          currentPassword,

          newPassword,

          requiresTwoFactor &&
          twoFactorMode === "totp"
            ? totpCode
            : undefined,

          requiresTwoFactor &&
          twoFactorMode === "recovery"
            ? recoveryCode
            : undefined

        );


      // --------------------------------------------------------
      // ÉXITO
      // --------------------------------------------------------

      notification.success({

        title:
          "Contraseña actualizada",

        description:
          response?.message ||
          "Tu contraseña se cambió correctamente. Por seguridad, debes iniciar sesión nuevamente.",

        placement: "topRight",

        duration: 8,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className:
          "welcome-notification"

      });


      // --------------------------------------------------------
      // LIMPIAR FORMULARIO
      // --------------------------------------------------------

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTotpCode("");
      setRecoveryCode("");

      setRequiresTwoFactor(false);

      setTwoFactorMode("totp");


    } catch (error) {

      console.error(
        "❌ Error cambiando contraseña:",
        error
      );


      // --------------------------------------------------------
      // EL BACKEND INDICA QUE SE NECESITA 2FA
      // --------------------------------------------------------

      if (
        error?.message ===
        "Debes proporcionar un código TOTP o un código de recuperación."
      ) {

        setRequiresTwoFactor(true);

        setTwoFactorMode("totp");

        notification.warning({

          title:
            "Verificación adicional requerida",

          description:
            "Tu cuenta tiene TOTP activado. Introduce el código de tu aplicación autenticadora para continuar.",

          placement: "topRight",

          duration: 8,

          showProgress: true,

          pauseOnHover: true,

          closable: true,

          className:
            "welcome-notification"

        });

        return;

      }


      // --------------------------------------------------------
      // TOTP / RECOVERY INCORRECTO
      // --------------------------------------------------------

      notification.error({

        title:
          "No fue posible cambiar la contraseña",

        description:
          error?.message ||
          "Ocurrió un error al cambiar tu contraseña.",

        placement: "topRight",

        duration: 8,

        showProgress: true,

        pauseOnHover: true,

        closable: true,

        className:
          "welcome-notification"

      });

    } finally {

      setLoadingPassword(false);

    }

  };


  // ============================================================
  // CERRAR SESIÓN ESPECÍFICA
  // ============================================================

  const handleLogoutSession = async (
    sessionId
  ) => {

    try {

      setClosingSessionId(
        sessionId
      );

      setError(null);


      await logoutSession(
        sessionId
      );


      setSessions(
        previousSessions =>
          previousSessions.filter(
            session =>
              session.sessionId !== sessionId
          )
      );

    } catch (error) {

      console.error(
        "❌ Error cerrando sesión:",
        error
      );


      setError(
        error.message ||
        "No fue posible cerrar la sesión."
      );

    } finally {

      setClosingSessionId(null);

    }

  };


  // ============================================================
  // FORMATEAR FECHA
  // ============================================================

  const formatDate = (
    date
  ) => {

    if (!date) {

      return "Desconocido";

    }


    return new Date(date)
      .toLocaleString(
        "es-MX",
        {
          dateStyle: "medium",
          timeStyle: "short"
        }
      );

  };


  // ============================================================
  // ICONO DEL DISPOSITIVO
  // ============================================================

  const getDeviceIcon = (
    operatingSystem
  ) => {

    if (!operatingSystem) {

      return "bi bi-device-unknown";

    }


    const system =
      operatingSystem.toLowerCase();


    if (
      system.includes("android")
    ) {

      return "bi bi-phone";

    }


    if (
      system.includes("ios") ||
      system.includes("iphone") ||
      system.includes("ipad")
    ) {

      return "bi bi-phone";

    }


    if (
      system.includes("mac")
    ) {

      return "bi bi-laptop";

    }


    if (
      system.includes("windows")
    ) {

      return "bi bi-pc-display";

    }


    if (
      system.includes("linux")
    ) {

      return "bi bi-pc-display";

    }


    return "bi bi-laptop";

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="private-page-container">


      {/* ========================================================
          ENCABEZADO
          ======================================================== */}

      <div className="private-page-header">

        <span className="private-page-eyebrow">
          Seguridad
        </span>


        <h1>
          Seguridad de la cuenta
        </h1>


        <p>
          Administra los dispositivos, accesos y sesiones
          asociadas a tu cuenta.
        </p>

      </div>


            {/* ========================================================
          SESIONES ACTIVAS
          ======================================================== */}

      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-shield-check" />

          </div>


          <div>

            <h2>
              Sesiones activas
            </h2>


            <p>
              Revisa dónde está iniciada tu cuenta
              y cierra cualquier sesión que no reconozcas.
            </p>

          </div>

        </div>


        {/* ======================================================
            ERROR
            ====================================================== */}

        {error && (

          <div className="private-security-error">

            <i className="bi bi-exclamation-triangle" />


            <span>
              {error}
            </span>

          </div>

        )}


        {/* ======================================================
            CARGANDO
            ====================================================== */}

        {loadingSessions ? (

          <div className="private-security-loading">

            <i className="bi bi-arrow-repeat" />


            <span>
              Cargando sesiones...
            </span>

          </div>

        ) : sessions.length === 0 ? (

          <div className="private-security-empty">

            <div className="private-security-empty-icon">

              <i className="bi bi-shield-check" />

            </div>


            <strong>
              No hay sesiones activas
            </strong>


            <span>
              No se encontraron sesiones activas
              asociadas a tu cuenta.
            </span>

          </div>

        ) : (

          <div className="private-sessions-list">

            {sessions.map(
              session => (

                <article
                  key={session.sessionId}
                  className="private-session-item"
                >

                  <div className="private-session-icon">

                    <i
                      className={getDeviceIcon(
                        session.operatingSystem
                      )}
                    />

                  </div>


                  <div className="private-session-info">

                    <div className="private-session-title">

                      <strong>

                        {session.browser !== "Desconocido"
                          ? session.browser
                          : "Dispositivo desconocido"
                        }

                      </strong>


                      {session.isCurrent && (

                        <span className="private-session-current">

                          Este dispositivo

                        </span>

                      )}


                      <span className="private-session-status">

                        <span className="private-session-status-dot" />

                        Activa

                      </span>

                    </div>


                    <span className="private-session-device">

                      {session.operatingSystem !== "Desconocido"
                        ? session.operatingSystem
                        : "Sistema operativo desconocido"
                      }

                    </span>


                    <div className="private-session-meta">

                      <span>

                        <i className="bi bi-globe2" />

                        {session.ip ||
                          "IP desconocida"
                        }

                      </span>


                      <span>

                        <i className="bi bi-clock" />

                        Última actividad:{" "}

                        {formatDate(
                          session.lastActivityAt
                        )}

                      </span>


                      <span>

                        <i className="bi bi-calendar3" />

                        Inicio:{" "}

                        {formatDate(
                          session.createdAt
                        )}

                      </span>

                    </div>

                  </div>


                  <div className="private-session-actions">

                    <button
                      type="button"
                      className="private-danger-button"
                      disabled={
                        closingSessionId ===
                        session.sessionId
                      }
                      onClick={() =>
                        handleLogoutSession(
                          session.sessionId
                        )
                      }
                    >

                      <i
                        className={
                          closingSessionId ===
                          session.sessionId
                            ? "bi bi-arrow-repeat"
                            : "bi bi-box-arrow-right"
                        }
                      />


                      {closingSessionId ===
                      session.sessionId
                        ? "Cerrando..."
                        : "Cerrar sesión"
                      }

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

      {/* ========================================================
          CAMBIAR CONTRASEÑA
          ======================================================== */}

      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-key" />

          </div>


          <div>

            <h2>
              Cambiar contraseña
            </h2>


            <p>
              Actualiza la contraseña utilizada para
              iniciar sesión en tu cuenta.
            </p>

          </div>

        </div>


        <form
          className="private-password-form"
          onSubmit={handleChangePassword}
        >


          {/* ====================================================
              CONTRASEÑA ACTUAL
              ==================================================== */}

          <div className="private-password-field">

            <label htmlFor="currentPassword">
              Contraseña actual
            </label>


            <div className="private-password-input-wrapper">

              <input
                id="currentPassword"
                name="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                disabled={loadingPassword}
                placeholder="Contraseña actual"
              />


              <button
                type="button"
                className="private-password-toggle"
                onClick={() =>
                  setShowCurrentPassword(
                    previous => !previous
                  )
                }
                disabled={loadingPassword}
                aria-label={
                  showCurrentPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >

                <i
                  className={
                    showCurrentPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                />

              </button>

            </div>

          </div>


          {/* ====================================================
              NUEVA CONTRASEÑA
              ==================================================== */}

          <div className="private-password-field">

            <label htmlFor="newPassword">
              Nueva contraseña
            </label>


            <div className="private-password-input-wrapper">

              <input
                id="newPassword"
                name="newPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                disabled={loadingPassword}
                placeholder="Nueva contraseña"
              />


              <button
                type="button"
                className="private-password-toggle"
                onClick={() =>
                  setShowNewPassword(
                    previous => !previous
                  )
                }
                disabled={loadingPassword}
                aria-label={
                  showNewPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >

                <i
                  className={
                    showNewPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                />

              </button>

            </div>


            {/* ==================================================
                REGLAS
                ================================================== */}

            <div className="private-password-rules">

              {passwordRules.map(
                rule => (

                  <div
                    key={rule.id}
                    className={
                      `private-password-rule ${
                        rule.valid
                          ? "valid"
                          : ""
                      }`
                    }
                  >

                    <i
                      className={
                        rule.valid
                          ? "bi bi-check-circle-fill"
                          : "bi bi-circle"
                      }
                    />


                    <span>
                      {rule.label}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          {/* ====================================================
              CONFIRMAR CONTRASEÑA
              ==================================================== */}

          <div className="private-password-field">

            <label htmlFor="confirmPassword">
              Confirmar nueva contraseña
            </label>


            <div className="private-password-input-wrapper">

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                disabled={loadingPassword}
                placeholder="Confirma tu nueva contraseña"
              />


              <button
                type="button"
                className="private-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    previous => !previous
                  )
                }
                disabled={loadingPassword}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >

                <i
                  className={
                    showConfirmPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                />

              </button>

            </div>

          </div>


          {/* ====================================================
              SEGUNDO FACTOR
              ==================================================== */}

          {requiresTwoFactor && (

            <div className="private-password-2fa">

              <div className="private-password-2fa-header">

                <i className="bi bi-shield-lock" />

                <div>

                  <strong>
                    Verificación de seguridad
                  </strong>

                  <span>
                    Tu cuenta tiene autenticación de dos factores
                    activada.
                  </span>

                </div>

              </div>


              {/* ==================================================
                  SELECTOR TOTP / RECUPERACIÓN
                  ================================================== */}

              <div className="private-password-2fa-tabs">

                <button
                  type="button"
                  className={
                    twoFactorMode === "totp"
                      ? "active"
                      : ""
                  }
                  onClick={() => {

                    setTwoFactorMode(
                      "totp"
                    );

                    setRecoveryCode("");

                  }}
                  disabled={loadingPassword}
                >

                  <i className="bi bi-phone" />

                  Código TOTP

                </button>


                <button
                  type="button"
                  className={
                    twoFactorMode === "recovery"
                      ? "active"
                      : ""
                  }
                  onClick={() => {

                    setTwoFactorMode(
                      "recovery"
                    );

                    setTotpCode("");

                  }}
                  disabled={loadingPassword}
                >

                  <i className="bi bi-key" />

                  Código de recuperación

                </button>

              </div>


              {/* ==================================================
                  TOTP
                  ================================================== */}

              {twoFactorMode === "totp" && (

                <div className="private-password-field">

                  <label htmlFor="changePasswordTotp">
                    Código de autenticación
                  </label>


                  <input
                    id="changePasswordTotp"
                    name="changePasswordTotp"
                    className="private-password-2fa-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={totpCode}
                    onChange={(event) =>
                      setTotpCode(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    disabled={loadingPassword}
                    placeholder="000000"
                  />


                  <span className="private-password-2fa-help">

                    Introduce el código de 6 dígitos
                    generado por tu aplicación autenticadora.

                  </span>

                </div>

              )}


              {/* ==================================================
                  CÓDIGO DE RECUPERACIÓN
                  ================================================== */}

              {twoFactorMode === "recovery" && (

                <div className="private-password-field">

                  <label htmlFor="changePasswordRecovery">
                    Código de recuperación
                  </label>


                  <input
                    id="changePasswordRecovery"
                    name="changePasswordRecovery"
                    className="private-password-2fa-input"
                    type="text"
                    autoComplete="off"
                    value={recoveryCode}
                    onChange={(event) =>
                      setRecoveryCode(
                        event.target.value
                      )
                    }
                    disabled={loadingPassword}
                    placeholder="Código de recuperación"
                  />


                  <span className="private-password-2fa-help">

                    Puedes utilizar uno de tus códigos
                    de recuperación si no tienes acceso
                    a tu aplicación autenticadora.

                  </span>

                </div>

              )}

            </div>

          )}


          {/* ====================================================
              BOTÓN
              ==================================================== */}

          <div className="private-password-actions">

            <button
              type="submit"
              className="private-password-button"
              disabled={
                loadingPassword
              }
            >

              <i
                className={
                  loadingPassword
                    ? "bi bi-arrow-repeat"
                    : "bi bi-shield-lock"
                }
              />


              {loadingPassword
                ? "Actualizando..."
                : "Cambiar contraseña"
              }

            </button>

          </div>

        </form>

      </section>  


      {/* ========================================================
          TOTP
          ======================================================== */}

      <TwoFactorCard />

    </div>

  );

}


export default Security;