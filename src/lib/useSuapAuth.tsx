import { useRouter } from "next/navigation";

export const SUAP_CLIENT_ID = "EeAjx2Vb0zZ6wFGHb1fXXuUMrs0WW85ylBwe5XS3";
export const SUAP_REDIRECT_URI = "http://localhost:3000/auth/callback";

export function LoginWithSuap() {
  const router = useRouter();

  const authUrl = `https://suap.ifrn.edu.br/o/authorize/?response_type=token&client_id=${SUAP_CLIENT_ID}&redirect_uri=${SUAP_REDIRECT_URI}&scope=identificacao%20email%20documentos_pessoais`;

  router.push(authUrl);
}
