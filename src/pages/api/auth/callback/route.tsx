"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      console.log(params)
      if (accessToken) {
        localStorage.setItem("suap_access_token", accessToken);
        router.push("/dashboard"); // Redireciona para a página protegida
      } else {
        router.push("/login"); // Se não houver token, volta para login
      }
    }
  }, []);

  return <p>Processando login...</p>;
}
