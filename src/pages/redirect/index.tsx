import { Spin } from "antd";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { useEffect } from "react";

export default function Redirect() {
  const router = useRouter();
  useEffect(() => {
    // Acessar o fragmento da URL no lado do cliente
    const { hash } = window.location;
    if (hash) {
      // Extrair os parâmetros de fragmento
      const params = new URLSearchParams(hash.substring(1)); // Remove o '#'

      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");
      if (accessToken && expiresIn) {
        setCookie(undefined, "sig-token", accessToken, {
          maxAge: Number(expiresIn),
        });
      }
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, []); // O useEffect será executado apenas uma vez após o carregamento no lado do cliente

  return (
    <div className="mt-14 flex h-full w-full items-center justify-center">
      <Spin size="large" />
    </div>
  );
}
