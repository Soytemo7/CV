import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  AuthContext
} from "../../context/AuthContext.jsx";

import "../../styles/private/security.css";


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

        console.log("🔵 Security: cargando sesiones");


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
  // RENDER
  // ============================================================

  return (

    <div className="private-page-container">

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
              Administra las sesiones actualmente
              asociadas a tu cuenta.
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

            <i className="bi bi-shield-check" />


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

                <div
                  key={session.sessionId}
                  className="private-session-item"
                >

                  {/* ==================================================
                      ICONO DEL DISPOSITIVO
                      ================================================== */}

                  <div className="private-session-icon">

                    <i
                      className={
                        session.operatingSystem === "Desconocido"
                          ? "bi bi-device-unknown"
                          : "bi bi-laptop"
                      }
                    />

                  </div>


                  {/* ==================================================
                      INFORMACIÓN
                      ================================================== */}

                  <div className="private-session-info">

                    <strong>

                      {session.browser !== "Desconocido"
                        ? session.browser
                        : "Dispositivo"
                      }

                    </strong>


                    <span>

                      {session.operatingSystem !== "Desconocido"
                        ? session.operatingSystem
                        : "Sistema operativo desconocido"
                      }

                    </span>


                    <small>

                      Última actividad:{" "}

                      {formatDate(
                        session.lastActivityAt
                      )}

                    </small>


                    <small>

                      IP:{" "}

                      {session.ip || "Desconocida"}

                    </small>

                  </div>


                  {/* ==================================================
                      ACCIONES
                      ================================================== */}

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

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* ========================================================
          OTRAS OPCIONES DE SEGURIDAD
          ======================================================== */}

      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-shield-lock" />

          </div>


          <div>

            <h2>
              Opciones de seguridad
            </h2>


            <p>
              Consulta y administra otros aspectos
              relacionados con la seguridad de tu cuenta.
            </p>

          </div>

        </div>


        <div className="private-security-grid">

          <div className="private-security-item">

            <i className="bi bi-laptop" />

            <div>

              <strong>
                Dispositivos
              </strong>


              <span>
                Consulta los dispositivos desde los
                que has iniciado sesión.
              </span>

            </div>

          </div>


          <div className="private-security-item">

            <i className="bi bi-clock-history" />

            <div>

              <strong>
                Historial de accesos
              </strong>


              <span>
                Consulta los últimos accesos registrados.
              </span>

            </div>

          </div>


          <div className="private-security-item">

            <i className="bi bi-bell" />

            <div>

              <strong>
                Alertas de seguridad
              </strong>


              <span>
                Consulta las alertas generadas por
                nuevos dispositivos.
              </span>

            </div>

          </div>


          <div className="private-security-item">

            <i className="bi bi-shield-lock" />

            <div>

              <strong>
                Sesiones activas
              </strong>


              <span>
                Administra las sesiones activas de tu cuenta.
              </span>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}


export default Security;