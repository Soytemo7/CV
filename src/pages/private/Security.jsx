import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  AuthContext
} from "../../context/AuthContext.jsx";

import "../../styles/private/security.css";
import TwoFactorCard
  from "../../components/private/security/TwoFactorCard.jsx";


function Security() {

  const {
    getActiveSessions,
    logoutSession
  } = useContext(AuthContext);


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

          /* ====================================================
             SIN SESIONES
             ==================================================== */

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

          /* ====================================================
             LISTA DE SESIONES
             ==================================================== */

          <div className="private-sessions-list">

            {sessions.map(
              session => (

                <article
                  key={session.sessionId}
                  className="private-session-item"
                >

                  {/* ==========================================
                      ICONO
                      ========================================== */}

                  <div className="private-session-icon">

                    <i
                      className={getDeviceIcon(
                        session.operatingSystem
                      )}
                    />

                  </div>


                  {/* ==========================================
                      INFORMACIÓN PRINCIPAL
                      ========================================== */}

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


                    {/* ========================================
                        METADATOS
                        ======================================== */}

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


                  {/* ==========================================
                      ACCIÓN
                      ========================================== */}

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

       <TwoFactorCard />

    </div>

  );

}


export default Security;