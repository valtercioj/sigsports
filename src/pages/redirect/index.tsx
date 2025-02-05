/* eslint-disable import/no-extraneous-dependencies */
import { FourSquare } from "react-loading-indicators";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { useEffect } from "react";
import api from "@/pages/api";

export type Data = {
  matricula: string;
  nome_usual: string;
  url_foto_150x200: string;
};

export default function Redirect() {
  const router = useRouter();

  const getData = async (token: string, expiresIn: string) => {
    try {
      const response = await api.getDataSuap(token);
      const dados: Data = response.data;
      setCookie(undefined, "sig-token", token, {
        maxAge: Number(expiresIn),
      });
      setCookie(null, "matricula", `${dados?.matricula}`, {
        maxAge: Number(expiresIn), // 30 dias
      });
      setCookie(null, "nome", `${dados?.nome_usual}`, {
        maxAge: Number(expiresIn), // 30 dias
      });
      setCookie(null, "foto", `${dados?.url_foto_150x200}`, {
        maxAge: Number(expiresIn), // 30 dias
      });
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Acessar o fragmento da URL no lado do cliente
    const { hash } = window.location;
    if (hash) {
      // Extrair os parâmetros de fragmento
      const params = new URLSearchParams(hash.substring(1)); // Remove o '#'

      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");
      if (accessToken && expiresIn) {
        getData(accessToken, expiresIn);
      }
      // router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, []); // O useEffect será executado apenas uma vez após o carregamento no lado do cliente

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <FourSquare
        color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]}
        size="large"
        text="Carregando..."
        style={{ fontSize: 25 }}
        textColor="#33CC36"
      />
    </div>
  );
}
