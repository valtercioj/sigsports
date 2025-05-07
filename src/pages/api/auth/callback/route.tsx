"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Captura o fragmento da URL
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");

      if (accessToken) {
        // Calcula o tempo de expiração
        const expires = new Date(Date.now() + Number(expiresIn) * 1000);

        // Salva o token em cookies
        setCookie(null, "suap_access_token", accessToken, {
          path: "/",
          expires,
          secure: process.env.NODE_ENV === "production",
          httpOnly: false, // true impediria o acesso no cliente
        });

        // Remove o fragmento da URL para segurança
        router.replace("/dashboard");
      } else {
        // Se não houver token, volta para login
        router.replace("/login");
      }
    }
  }, [router]);

  return <p>Processando login...</p>;
}
