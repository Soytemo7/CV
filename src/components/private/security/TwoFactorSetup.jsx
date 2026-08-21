import {
  useState
} from "react";

import {
  setupTwoFactor,
  enableTwoFactor
} from "../../../services/twoFactorService.js";

import {
  useNotification
} from "../../../hooks/useNotification";

import "../../../styles/private/two-factor.css";


function TwoFactorSetup({
  onComplete,
  onCancel
}) {

  const notification =
    useNotification();


  const [
    qrCode,
    setQrCode
  ] = useState(null);


  const [
    secret,
    setSecret
  ] = useState(null);


  const [
    token,
    setToken
  ] = useState("");


  const [
    recoveryCodes,
    setRecoveryCodes
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    step,
    setStep
  ] = useState(0);


  // ============================================================
  // INICIAR
  // ============================================================

  const handleStart =
    async () => {

      if (loading) {
        return;
      }


      try {

        setLoading(true);


        const data =
          await setupTwoFactor();


        setQrCode(
          data.qrCode
        );


        setSecret(
          data.secret
        );


        setStep(1);

      } catch (error) {

        console.error(
          "❌ Error iniciando 2FA:",
          error
        );


        notification.error({

          title:
            "Error configurando 2FA",

          description:
            error.message ||
            "No fue posible iniciar la configuración.",

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
  // TOKEN
  // ============================================================

  const handleTokenChange =
    event => {

      const value =
        event.target.value
          .replace(/\D/g, "")
          .slice(0, 6);


      setToken(
        value
      );

    };


  // ============================================================
  // ACTIVAR
  // ============================================================

  const handleEnable =
    async event => {

      event.preventDefault();


      if (
        !/^\d{6}$/.test(token)
      ) {

        notification.error({

          title:
            "Código no válido",

          description:
            "Introduce el código de 6 dígitos mostrado en tu aplicación de autenticación.",

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

        return;
      }


      try {

        setLoading(true);


        const data =
          await enableTwoFactor(
            token
          );


        setRecoveryCodes(
          data.recoveryCodes || []
        );


        setStep(2);


        notification.success({

          title:
            "2FA activado",

          description:
            "La autenticación de dos factores fue activada correctamente.",

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

      } catch (error) {

        console.error(
          "❌ Error activando 2FA:",
          error
        );


        notification.error({

          title:
            "Código incorrecto",

          description:
            error.message ||
            "El código de autenticación no es válido.",

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
  // FINALIZAR
  // ============================================================

  const handleFinish =
    () => {

      onComplete?.();

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="two-factor-panel">

      {/* ========================================================
          PASO 0 — INTRODUCCIÓN
          ======================================================== */}

      {step === 0 && (

        <>

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


          <div className="two-factor-intro">

            <p>
              Protege tu cuenta utilizando una aplicación
              autenticadora compatible con TOTP.
            </p>

          </div>


          <div className="two-factor-actions">

            <button
              type="button"
              className="private-primary-button"
              disabled={loading}
              onClick={handleStart}
            >

              <i className="bi bi-shield-plus" />


              {loading
                ? "Generando..."
                : "Comenzar configuración"
              }

            </button>


            <button
              type="button"
              className="private-danger-button two-factor-cancel-button"
              onClick={onCancel}
            >

              <i className="bi bi-x-lg" />

              Cancelar

            </button>

          </div>

        </>

      )}


      {/* ========================================================
          PASO 1 — QR + TOKEN
          ======================================================== */}

      {step === 1 && (

        <>

          <div className="two-factor-step">

            <span className="two-factor-step-number">

              1

            </span>


            <div>

              <strong>
                Escanea el código QR
              </strong>


              <p>
                Utiliza Google Authenticator,
                Microsoft Authenticator u otra
                aplicación compatible con TOTP.
              </p>

            </div>

          </div>


          {qrCode && (

            <div className="two-factor-qr">

              <img
                src={qrCode}
                alt="Código QR para configurar autenticación de dos factores"
              />

            </div>

          )}


          <div className="two-factor-secret">

            <span>
              Clave de configuración
            </span>


            <code>
              {secret}
            </code>

          </div>


          <div className="two-factor-step">

            <span className="two-factor-step-number">

              2

            </span>


            <div>

              <strong>
                Introduce el código
              </strong>


              <p>
                Escribe el código de 6 dígitos
                que aparece en tu aplicación.
              </p>

            </div>

          </div>


          <form
            onSubmit={handleEnable}
            className="two-factor-form"
          >

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={token}
              onChange={handleTokenChange}
              maxLength={6}
              disabled={loading}
              className="two-factor-token-input"
            />


            <button
              type="submit"
              className="private-primary-button"
              disabled={
                loading ||
                token.length !== 6
              }
            >

              <i
                className={
                  loading
                    ? "bi bi-arrow-repeat"
                    : "bi bi-check-circle"
                }
              />


              {loading
                ? "Verificando..."
                : "Activar autenticación de dos factores"
              }

            </button>

          </form>


          <button
            type="button"
            className="private-danger-button two-factor-cancel-button"
            onClick={onCancel}
          >

            <i className="bi bi-x-lg" />

            Cancelar

          </button>

        </>

      )}


      {/* ========================================================
          PASO 2 — CÓDIGOS DE RECUPERACIÓN
          ======================================================== */}

      {step === 2 && (

        <>

          <div className="private-card-header">

            <div className="private-card-icon">

              <i className="bi bi-shield-check" />

            </div>


            <div>

              <h2>
                Autenticación de dos factores activada
              </h2>


              <p>
                Tu cuenta está protegida mediante
                autenticación de dos factores.
              </p>

            </div>

          </div>


          <div className="two-factor-success">

            <p>
              Guarda estos códigos de recuperación
              en un lugar seguro. Cada código puede
              utilizarse una sola vez.
            </p>

          </div>


          <div className="two-factor-recovery-codes">

            {recoveryCodes.map(
              code => (

                <code
                  key={code}
                >

                  {code}

                </code>

              )
            )}

          </div>


          <div className="two-factor-recovery-warning">

            <i className="bi bi-exclamation-triangle" />


            <span>
              Estos códigos se muestran ahora.
              Guárdalos en un lugar seguro antes
              de continuar.
            </span>

          </div>


          <button
            type="button"
            className="private-primary-button"
            onClick={handleFinish}
          >

            <i className="bi bi-check-lg" />

            He guardado mis códigos

          </button>

        </>

      )}

    </div>

  );

}


export default TwoFactorSetup;