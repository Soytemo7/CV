import api from "./api.js";


// ============================================================
// ADMINISTRACIÓN
// ============================================================

export const registerCertificate =
  async (
    publicKeyPem,
    name
  ) => {

    return await api(
      "/api/certificates",
      {
        method:
          "POST",

        body:
          JSON.stringify({

            publicKeyPem,

            name

          })

      }
    );

  };


export const getCertificates =
  async () => {

    return await api(
      "/api/certificates",
      {
        method:
          "GET"
      }
    );

  };


export const revokeCertificate =
  async (
    certificateId
  ) => {

    return await api(

      `/api/certificates/${encodeURIComponent(
        certificateId
      )}`,

      {
        method:
          "DELETE"
      }

    );

  };


// ============================================================
// LOGIN
// ============================================================

export const requestCertificateLoginChallenge =
  async (
    certificateId
  ) => {

    return await api(
      "/api/certificates/challenge",
      {
        method:
          "POST",

        body:
          JSON.stringify({

            certificateId

          })

      }
    );

  };


export const verifyCertificateLogin =
  async ({
    certificateId,
    challengeId,
    challenge,
    signature
  }) => {

    return await api(
      "/api/certificates/verify",
      {
        method:
          "POST",

        body:
          JSON.stringify({

            certificateId,

            challengeId,

            challenge,

            signature

          })

      }
    );

  };