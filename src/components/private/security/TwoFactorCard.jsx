import {
  useEffect,
  useState
} from "react";

import {
  getTwoFactorStatus
} from "../../../services/twoFactorService.js";

import TwoFactorSetup
  from "./TwoFactorSetup.jsx";

import TwoFactorDisable
  from "./TwoFactorDisable.jsx";

import {
  useNotification
} from "../../../hooks/useNotification";

import "../../../styles/private/two-factor.css";


function TwoFactorCard() {

  const notification =
    useNotification();


  const [
    twoFactor,
    setTwoFactor
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    mode,
    setMode
  ] = useState(null);


  // ============================================================
  // OBTENER ESTADO 2FA
  // ============================================================

  const loadStatus =
    async ({
      showLoading = false
    } = {}) => {

      try {

        if (showLoading) {

          setLoading(true);

        }


        const data =
          await getTwoFactorStatus();


        setTwoFactor(
          data.twoFactor
        );

      } catch (error) {

        console.error(
          "❌ Error obteniendo estado 2FA:",
          error
        );


        notification.error({

          title:
            "Error de seguridad",

          description:
            error.message ||
            "No fue posible obtener el estado de 2FA.",

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });

      } finally {

        setLoading(false);

      }

    };


  // ============================================================
  // CARGAR ESTADO INICIAL
  // ============================================================

  useEffect(() => {

    let cancelled = false;


    const loadInitialStatus =
      async () => {

        try {

          const data =
            await getTwoFactorStatus();


          if (!cancelled) {

            setTwoFactor(
              data.twoFactor
            );

          }

        } catch (error) {

          if (!cancelled) {

            console.error(
              "❌ Error obteniendo estado 2FA:",
              error
            );


            notification.error({

              title:
                "Error de seguridad",

              description:
                error.message ||
                "No fue posible obtener el estado de 2FA.",

              placement:
                "topRight",

              duration:
                8,

              showProgress:
                true,

              pauseOnHover:
                true,

              closable:
                true,

              className:
                "welcome-notification"

            });

          }

        } finally {

          if (!cancelled) {

            setLoading(false);

          }

        }

      };


    loadInitialStatus();


    return () => {

      cancelled = true;

    };

  }, [notification]);


  // ============================================================
  // COMPLETAR OPERACIÓN
  // ============================================================

  const handleComplete =
    async () => {

      setMode(null);

      await loadStatus();

    };


  // ============================================================
  // CARGANDO
  // ============================================================

  if (loading) {

    return (

      <section className="private-card">

        <div className="private-security-loading">

          <i className="bi bi-arrow-repeat" />

          <span>
            Comprobando autenticación de dos factores...
          </span>

        </div>

      </section>

    );

  }


  // ============================================================
  // CONFIGURAR 2FA
  // ============================================================

  if (mode === "setup") {

    return (

      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-shield-lock" />

          </div>


          <div>

            <h2>
              Configurar autenticación de dos factores
            </h2>

            <p>
              Añade una capa adicional de seguridad
              a tu cuenta.
            </p>

          </div>

        </div>


        <TwoFactorSetup
          onComplete={handleComplete}
          onCancel={() => setMode(null)}
        />

      </section>

    );

  }


  // ============================================================
  // DESACTIVAR 2FA
  // ============================================================

  if (mode === "disable") {

    return (

      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-shield-x" />

          </div>


          <div>

            <h2>
              Desactivar autenticación de dos factores
            </h2>

            <p>
              Confirma tu identidad para continuar.
            </p>

          </div>

        </div>


        <TwoFactorDisable
          onComplete={handleComplete}
          onCancel={() => setMode(null)}
        />

      </section>

    );

  }


  // ============================================================
  // ESTADO 2FA
  // ============================================================

  return (

    <section className="private-card">

      <div className="private-card-header">

        <div className="private-card-icon">

          <i className="bi bi-shield-lock" />

        </div>


        <div>

          <h2>
            Autenticación de dos factores
          </h2>


          <p>
            Protege tu cuenta con una aplicación
            autenticadora compatible con TOTP.
          </p>

        </div>

      </div>


      <div className="two-factor-status">

        <div
          className={
            twoFactor?.enabled
              ? "two-factor-status-icon enabled"
              : "two-factor-status-icon disabled"
          }
        >

          <i
            className={
              twoFactor?.enabled
                ? "bi bi-shield-check"
                : "bi bi-shield"
            }
          />

        </div>


        <div className="two-factor-status-info">

          <strong>

            {twoFactor?.enabled
              ? "Autenticación de dos factores activada"
              : "Autenticación de dos factores desactivada"
            }

          </strong>


          <span>

            {twoFactor?.enabled

              ? "Tu cuenta requiere un código adicional al iniciar sesión desde un nuevo acceso."

              : "Tu cuenta actualmente no utiliza autenticación de dos factores."

            }

          </span>

        </div>


        <span
          className={
            twoFactor?.enabled
              ? "two-factor-badge enabled"
              : "two-factor-badge disabled"
          }
        >

          {twoFactor?.enabled
            ? "Activa"
            : "Inactiva"
          }

        </span>

      </div>


      {/* ======================================================
          2FA ACTIVA
          ====================================================== */}

      {twoFactor?.enabled ? (

        <>

          <div className="two-factor-recovery-summary">

            <i className="bi bi-key" />

            <div>

              <strong>
                Códigos de recuperación disponibles
              </strong>

              <span>
                {twoFactor.recoveryCodesRemaining}
              </span>

            </div>

          </div>


          <button
            type="button"
            className="private-danger-button two-factor-disable-button2"
            onClick={() => setMode("disable")}
          >

            <i className="bi bi-shield-x" />

            Desactivar autenticación de dos factores

          </button>

        </>

      ) : (

        /* ====================================================
           2FA INACTIVA
           ==================================================== */

        <button
          type="button"
          className="private-primary-button two-factor-enable-button"
          onClick={() => setMode("setup")}
        >

          <i className="bi bi-shield-plus" />

          Activar autenticación de dos factores

        </button>

      )}

    </section>

  );

}


export default TwoFactorCard;