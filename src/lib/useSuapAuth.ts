export const SUAP_CLIENT_ID = "EeAjx2Vb0zZ6wFGHb1fXXuUMrs0WW85ylBwe5XS3";
export const SUAP_REDIRECT_URI = "http://localhost:3000/auth/callback";

export function loginWithSuap() {
  const authUrl = `https://suap.ifrn.edu.br/o/authorize/?response_type=token&grant_type=implict&client_id=${SUAP_CLIENT_ID}&scope=identificacao%20email%20documentos_pessoais`;

  window.location.href = authUrl;
}
