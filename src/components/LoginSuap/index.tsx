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
    <div className="flex mt-20 flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Login com SUAP</h1>
      <button
        type="button"
        onClick={LoginWithSuap}
        className="text-white flex items-center justify-center rounded-lg bg-white-default px-6 py-3 font-semibold shadow-md transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <img src="/suap.jpeg" alt="Google" className="mr-2 h-6 w-6" />
        Entrar com o Suap
      </button>
    </div>
  );
}
