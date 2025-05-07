/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";

export default function LoginPage() {
  const SUAP_CLIENT_ID = "EeAjx2Vb0zZ6wFGHb1fXXuUMrs0WW85ylBwe5XS3";
  const router = useRouter();
  function LoginWithSuap() {
    const authUrl = `https://suap.ifrn.edu.br/o/authorize/?response_type=token&grant_type=implict&client_id=${SUAP_CLIENT_ID}&scope=identificacao%20email%20documentos_pessoais`;

    router.push(authUrl);
  }

  return (
    <button
      type="button"
      onClick={LoginWithSuap}
      className="mt-10 h-[57.6px] w-full rounded-2xl border-none bg-[#2ED2BA] text-base font-bold leading-5 text-black"
    >
      Entrar com o Suap
    </button>
  );
}
