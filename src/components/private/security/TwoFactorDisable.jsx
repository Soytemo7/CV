import {
  useState
} from "react";

import {
  disableTwoFactor
} from "../../../services/twoFactorService.js";

import {
  useNotification
} from "../../../hooks/useNotification";

import "../../../styles/private/two-factor.css";


function TwoFactorDisable({
  onComplete,
  onCancel
}) {

  const notification =
    useNotification();


  const [
    method,
    setMethod
  ] = useState("token");


  const [
    value,
    setValue
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const handleSubmit =
    async event => {

      event.preventDefault();


      if (
        method === "token" &&
        !/^\d{6}$/.test(value)
      ) {

        notification.error({

          title:
            "Código no válido",

          description:
            "Introduce un código TOTP de 6 dígitos.",

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


      if (
        method === "recovery" &&
        !value.trim()
      ) {

        notification.error({

          title:
            "Código requerido",

          description:
            "Introduce un código de recuperación.",

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


        if (
          method === "token"
        ) {

          await disableTwoFactor({

            token:
              value

          });

        } else {

          await disableTwoFactor({

            recoveryCode:
              value

          });

        }


        notification.success({

          title:
            "2FA desactivado",

          description:
            "La autenticación de dos factores fue desactivada correctamente.",

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


        onComplete?.();

      } catch (error) {

        console.error(
          "❌ Error desactivando 2FA:",
          error
        );


        notification.error({

          title:
            "No fue posible desactivar 2FA",

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


  const handleChange =
    event => {

      let value =
        event.target.value;


      if (
        method === "token"
      ) {

        value =
          value
            .replace(/\D/g, "")
            .slice(0, 6);

      }


      setValue(
        value
      );

    };


  return (

    <div className="two-factor-panel">

      <div className="two-factor-panel-icon danger">

        <i className="bi bi-shield-x" />

      </div>


      <h3>
        Desactivar autenticación de dos factores
      </h3>


      <p>
        Para desactivar 2FA debes confirmar tu
        identidad utilizando tu código TOTP o
        uno de tus códigos de recuperación.
      </p>


      <div className="two-factor-methods">

        <button
          type="button"
          className={
            method === "token"
              ? "active"
              : ""
          }
          onClick={() => {

            setMethod("token");

            setValue("");

          }}
          disabled={loading}
        >

          Código TOTP

        </button>


        <button
          type="button"
          className={
            method === "recovery"
              ? "active"
              : ""
          }
          onClick={() => {

            setMethod("recovery");

            setValue("");

          }}
          disabled={loading}
        >

          Código de recuperación

        </button>

      </div>


      <form
        onSubmit={handleSubmit}
        className="two-factor-form"
      >

        <input
          type="text"
          inputMode={
            method === "token"
              ? "numeric"
              : "text"
          }
          autoComplete="off"
          placeholder={
            method === "token"
              ? "000000"
              : "Código de recuperación"
          }
          value={value}
          onChange={handleChange}
          disabled={loading}
          maxLength={
            method === "token"
              ? 6
              : 8
          }
          className="two-factor-token-input"
        />


          <div className="two-factor-actions two-factor-disable-actions">

            <button
              type="submit"
              className="private-danger-button two-factor-disable-confirm"
              disabled={
                loading ||
                !value.trim()
              }
            >

              <i className="bi bi-shield-x" />

              {loading
                ? "Desactivando..."
                : "Desactivar 2FA"
              }

            </button>


            <button
              type="button"
              className="private-secondary-button two-factor-disable-cancel"
              onClick={onCancel}
              disabled={loading}
            >

              <i className="bi bi-x-lg" />

              Cancelar

            </button>

          </div>

      </form>

    </div>

  );

}


export default TwoFactorDisable;