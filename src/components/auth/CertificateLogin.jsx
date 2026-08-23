import {
  useState
} from "react";

import {
  useNotification
} from "../../hooks/useNotification";

import {
  authenticateWithCertificate
} from "../../services/certificateLoginService.js";

import {
  getPublicKeyFromKeyFile
} from "../../utils/certificateCrypto.js";

import {
  KeyOutlined,
  SafetyCertificateOutlined,
  UploadOutlined,
  LockOutlined
} from "@ant-design/icons";

import "../../styles/certificate-login.css";


// ============================================================
// COMPONENTE
// ============================================================

function CertificateLogin({
  onSuccess,
  onLoadingChange
}) {

  const notification =
    useNotification();


  const [
    keyFile,
    setKeyFile
  ] = useState(null);

  const [
  certificateFile,
  setCertificateFile
] = useState(null);


  const [
    password,
    setPassword
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleLogin =
    async () => {

      if (loading) {
        return;
      }


      // ------------------------------------------------------
      // ARCHIVO KEY
      // ------------------------------------------------------

      if (!keyFile) {

        notification.error({

          title:
            "Archivo requerido",

          description:
            "Selecciona tu archivo .key.",

          placement:
            "topRight",

          duration:
            8

        });

        return;

      }


      // ------------------------------------------------------
      // PASSWORD
      // ------------------------------------------------------

      if (!password) {

        notification.error({

          title:
            "Contraseña requerida",

          description:
            "Introduce la contraseña o PIN de tu archivo .key.",

          placement:
            "topRight",

          duration:
            8

        });

        return;

      }

      // ------------------------------------------------------
      // VALIDAR EXPIRACIÓN DEL .KEY
      // ------------------------------------------------------

      let keyMetadata;

      try {

        keyMetadata =
          getPublicKeyFromKeyFile(
            await keyFile.text()
          );

      } catch {

        notification.error({

          title:
            "Archivo .key inválido",

          description:
            "El archivo .key no tiene un formato válido.",

          placement:
            "topRight",

          duration:
            8

        });

        return;

      }


      if (
        keyMetadata?.expiresAt &&
        new Date(keyMetadata.expiresAt) <= new Date()
      ) {

        notification.error({

          title:
            "Certificado expirado",

          description:
            "Este archivo .key ya no está vigente.",

          placement:
            "topRight",

          duration:
            8

        });

        return;

      }


      try {

        setLoading(true);

        onLoadingChange?.(
          true
        );


        // ----------------------------------------------------
        // AUTENTICACIÓN
        // ----------------------------------------------------

        const data =
          await authenticateWithCertificate({

            keyFile,

            certificateFile,

            password

          });


        // ----------------------------------------------------
        // 2FA
        // ----------------------------------------------------

        if (
          data?.requiresTwoFactor &&
          data?.challenge
        ) {

          onSuccess?.(
            data
          );

          return;

        }


        // ----------------------------------------------------
        // LOGIN CORRECTO
        // ----------------------------------------------------

        notification.success({

          title:
            "Inicio de sesión correcto",

          description:
            "Has iniciado sesión mediante certificado.",

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        onSuccess?.(
          data
        );

      } catch (error) {

        console.error(
          "❌ Error certificado:",
          error
        );


        notification.error({

          title:
            "Error con certificado",

          description:
            error?.message ||
            "No fue posible autenticar con el certificado.",

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

        onLoadingChange?.(
          false
        );

      }

    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="certificate-login">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="certificate-login-header"
      >

        <SafetyCertificateOutlined />

        <span>
          Autenticación por certificado
        </span>

      </div>


      {/* ======================================================
          KEY
      ====================================================== */}

      <label
        className="certificate-file-input"
      >

        <UploadOutlined />

        <span>

          {keyFile
            ? keyFile.name
            : "Seleccionar archivo .key"
          }

        </span>


        <input
          type="file"
          accept=".key,application/json"
          onChange={(event) => {

            const file =
              event.target.files?.[0] ||
              null;

            setKeyFile(
              file
            );

          }}
          disabled={loading}
          hidden
        />

      </label>

      <label
        className="certificate-file-input"
      >

        <SafetyCertificateOutlined />

        <span>

          {certificateFile
            ? certificateFile.name
            : "Seleccionar archivo .cer"
          }

        </span>

        <input
          type="file"
          accept=".cer,application/json"
          onChange={(event) => {

            const file =
              event.target.files?.[0] ||
              null;

            setCertificateFile(
              file
            );

          }}
          disabled={loading}
          hidden
        />

      </label>


      {/* ======================================================
          PASSWORD
      ====================================================== */}

      <div
        className="certificate-password"
      >

        <LockOutlined />

        <input
          type="password"
          className="login-input"
          placeholder="Contraseña o PIN"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          disabled={loading}
          autoComplete="off"
        />

      </div>


      {/* ======================================================
          BUTTON
      ====================================================== */}

      <button
        type="button"
        className="login-button login-passkey"
        onClick={handleLogin}
        disabled={loading}
      >

        <KeyOutlined />

        <span>

          {loading
            ? "Autenticando..."
            : "Iniciar sesión con certificado"
          }

        </span>

      </button>

    </div>

  );

}


export default CertificateLogin;