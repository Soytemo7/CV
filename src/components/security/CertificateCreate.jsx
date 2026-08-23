import { useState } from "react";

import api from "../../services/api.js";

import {
  generateCertificateKeyPair,
  exportPublicKeyPem,
  createKeyFile,
  createCertificateFile,
  downloadTextFile
} from "../../utils/certificateCrypto.js";


export default function CertificateCreate({
  onCreated,
  onCancel
}) {

  const [name, setName] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ============================================================
  // CREAR CERTIFICADO
  // ============================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      if (!name.trim()) {

        setError(
          "Introduce un nombre para el certificado."
        );

        return;
      }

      if (!password) {

        setError(
          "Introduce una contraseña para proteger la clave."
        );

        return;
      }

      try {

        setLoading(true);
        setError("");


        // ======================================================
        // 1. GENERAR ED25519 LOCALMENTE
        // ======================================================

        const keyPair =
          await generateCertificateKeyPair();


        // ======================================================
        // 2. EXPORTAR CLAVE PÚBLICA
        // ======================================================

        const publicKeyPem =
          await exportPublicKeyPem(
            keyPair.publicKey
          );


        // ======================================================
        // 3. REGISTRAR CLAVE PÚBLICA
        // ======================================================

        const response =
          await api(
            "/api/certificates",
            {
              method: "POST",

              body:
                JSON.stringify({
                  publicKeyPem,
                  name: name.trim()
                })
            }
          );


        const certificate =
          response?.certificate ||
          response?.data?.certificate ||
          response;


        if (!certificate) {

          throw new Error(
            "El servidor no devolvió el certificado creado."
          );

        }


        // ======================================================
        // 4. CERTIFICATE ID
        // ======================================================

        const certificateId =
          certificate?.certificateId ||
          certificate?._id ||
          response?.certificateId;


        if (!certificateId) {

          throw new Error(
            "No se recibió el identificador del certificado."
          );

        }


        // ======================================================
        // 5. CREAR ARCHIVO .KEY
        // ======================================================

        const keyFile =
          await createKeyFile({

            privateKey:
              keyPair.privateKey,

            password,

            publicKeyPem,

            name:
              name.trim(),

            certificateId,
            
            expiresAt:
            certificate.expiresAt

          });


        // ======================================================
        // 6. CREAR ARCHIVO .CER
        // ======================================================

        const certificateFile =
        createCertificateFile(
          publicKeyPem,
          {
            certificateId,
            name: name.trim(),
            expiresAt:
              certificate.expiresAt
          }
        );


        // ======================================================
        // 7. DESCARGAR .KEY
        // ======================================================

        downloadTextFile(
          keyFile,
          `${sanitizeFilename(name)}.key`,
          "application/json"
        );


        // ======================================================
        // 8. DESCARGAR .CER
        // ======================================================

        downloadTextFile(
          certificateFile,
          `${sanitizeFilename(name)}.cer`,
          "application/x-x509-ca-cert"
        );


        // ======================================================
        // 9. ACTUALIZAR LISTA
        // ======================================================

        onCreated?.(
          certificate
        );

      } catch (err) {

        console.error(
          "Error creating certificate:",
          err
        );

        setError(
          err?.message ||
          "No se pudo crear el certificado."
        );

      } finally {

        setLoading(false);

      }

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <form
      className="private-password-form"
      onSubmit={handleSubmit}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="private-card-header"
      >

        <div
          className="private-card-icon"
        >

          <i
            className="bi bi-shield-lock"
          />

        </div>

        <div>

          <h2>
            Crear credencial Ed25519
          </h2>

          <p>
            La clave privada se genera y protege localmente.
          </p>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div
          className="private-security-error"
        >

          <i
            className="bi bi-exclamation-triangle"
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ======================================================
          NOMBRE
      ====================================================== */}

      <div
        className="private-password-field"
      >

        <label
          htmlFor="certificate-name"
        >
          Nombre
        </label>

        <div
          className="private-password-input-wrapper"
        >

          <input
            id="certificate-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            placeholder="Mi certificado"
            disabled={loading}
            autoComplete="off"
          />

        </div>

      </div>


      {/* ======================================================
          CONTRASEÑA
      ====================================================== */}

      <div
        className="private-password-field"
      >

        <label
          htmlFor="certificate-password"
        >
          Contraseña de protección
        </label>

        <div
          className="private-password-input-wrapper"
        >

          <input
            id="certificate-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Contraseña para el archivo .key"
            disabled={loading}
            autoComplete="new-password"
          />

          <button
            type="button"
            className="private-password-toggle"
            onClick={() =>
              setShowPassword(
                value => !value
              )
            }
            disabled={loading}
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >

            <i
              className={
                showPassword
                  ? "bi bi-eye-slash"
                  : "bi bi-eye"
              }
            />

          </button>

        </div>

      </div>


      {/* ======================================================
          INFORMACIÓN DE SEGURIDAD
      ====================================================== */}

      <div
        className="private-password-2fa"
      >

        <div
          className="private-password-2fa-header"
        >

          <i
            className="bi bi-shield-check"
          />

          <div>

            <strong>
              Protección de la clave privada
            </strong>

            <span>
              La clave privada nunca se envía al servidor.
              El archivo .key se protege mediante Argon2id
              y AES-256-GCM.
            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          ACCIONES
      ====================================================== */}

      <div
        className="private-password-actions"
      >

        <button
          type="button"
          className="private-danger-button"
          onClick={onCancel}
          disabled={loading}
        >

          <i
            className="bi bi-x-lg"
          />

          <span>
            Cancelar
          </span>

        </button>


        <button
          type="submit"
          className="private-password-button"
          disabled={loading}
        >

          <i
            className={
              loading
                ? "bi bi-arrow-repeat"
                : "bi bi-shield-plus"
            }
          />

          <span>
            {loading
              ? "Generando..."
              : "Crear certificado"
            }
          </span>

        </button>

      </div>

    </form>

  );

}


// ============================================================
// SANITIZAR NOMBRE
// ============================================================

function sanitizeFilename(value) {

  return String(
    value || "certificado"
  )
    .trim()
    .replace(
      /[<>:"/\\|?*]/g,
      "_"
    )
    .replace(
      /\s+/g,
      "_"
    )
    .slice(
      0,
      100
    )
    || "certificado";

}