import {
  decryptKeyFile,
  signChallenge
} from "../utils/certificateCrypto.js";

import {
  requestCertificateLoginChallenge,
  verifyCertificateLogin
} from "./certificateService.js";


// ============================================================
// AUTENTICACIÓN CON .KEY
// ============================================================

export const authenticateWithCertificate =
  async ({
    keyFile,
    password
  }) => {

    if (!keyFile) {

      throw new Error(
        "Debes seleccionar un archivo .key."
      );

    }


    if (!password) {

      throw new Error(
        "Debes introducir la contraseña o PIN."
      );

    }


    // --------------------------------------------------------
    // Leer archivo
    // --------------------------------------------------------

    const fileText =
      await keyFile.text();


    let metadata;

    try {

      metadata =
        JSON.parse(
          fileText
        );

    } catch {

      throw new Error(
        "El archivo .key no tiene un formato válido."
      );

    }


    if (
      metadata?.type !==
      "CV-CERTIFICATE-KEY"
    ) {

      throw new Error(
        "El archivo seleccionado no es una credencial válida."
      );

    }


    if (
      !metadata.certificateId
    ) {

      throw new Error(
        "El archivo .key no contiene el identificador del certificado."
      );

    }

    // --------------------------------------------------------
    // VERIFICAR EXPIRACIÓN DEL CERTIFICADO
    // --------------------------------------------------------

    if (
      !metadata.expiresAt
    ) {

      throw new Error(
        "El archivo .key no contiene la fecha de expiración del certificado."
      );

    }


    const expiresAt =
      new Date(
        metadata.expiresAt
      );


    if (
      Number.isNaN(
        expiresAt.getTime()
      )
    ) {

      throw new Error(
        "La fecha de expiración del certificado no es válida."
      );

    }


    if (
      expiresAt <= new Date()
    ) {

      throw new Error(
        "El certificado ha expirado y ya no puede utilizarse para iniciar sesión."
      );

    }


    // --------------------------------------------------------
    // Descifrar clave privada
    // --------------------------------------------------------

    const {
      privateKey
    } =
      await decryptKeyFile(
        fileText,
        password
      );


    // --------------------------------------------------------
    // Challenge
    // --------------------------------------------------------

    const challengeResponse =
      await requestCertificateLoginChallenge(

        metadata.certificateId

      );


    // --------------------------------------------------------
    // Firma
    // --------------------------------------------------------

    const signature =
      await signChallenge(

        privateKey,

        challengeResponse.challenge

      );


    // --------------------------------------------------------
    // Verificación
    // --------------------------------------------------------

    return await verifyCertificateLogin({

      certificateId:
        metadata.certificateId,

      challengeId:
        challengeResponse.challengeId,

      challenge:
        challengeResponse.challenge,

      signature

    });

  };