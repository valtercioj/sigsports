/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-no-constructed-context-values */
import { setCookie } from "nookies";
import { createContext, useState } from "react";
import Router from "next/router";
import axios from "axios";
import { api2 } from "@/services/api";

type AuthContextType = {
  isAuthenticated: boolean;
  id: number;
  signIn: (credentials: SignInCredentials) => Promise<any>;
};

type SignInCredentials = {
  username: string;
  password: string;
};

export interface UserType {
  id: number;
  nome: string;
  sobrenome: string;
  matricula: string;
  adm: number;
  tour: any;
}
export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = !!token;
  const [id, setId] = useState(0);

  async function signIn({ username, password }: SignInCredentials) {
    try {
      const response = await axios.post(
        "https://suap.ifrn.edu.br/api/token/pair",
        {
          username,
          password,
        }
      );

      const response1 = await api2.get("/v1/usuarios/");
      const pessoas: UserType[] = await response1.data;
      const pessoaEncontrada = pessoas.find(
        (pessoa) => pessoa.matricula === username
      );

      if (!pessoaEncontrada) {
        setToken(null);
        return { message: "Usuário não cadastrado" }; // Garantir que a mensagem de erro seja retornada
      }

      // Se o usuário for encontrado, armazena o token e outras informações
      setCookie(undefined, "sig-token", response.data.access);
      setCookie(undefined, "sig-refreshToken", response.data.refresh);
      setCookie(undefined, "admin", `${pessoaEncontrada.adm}`);
      setCookie(undefined, "Tour", pessoaEncontrada.tour);

      setId(pessoaEncontrada.id);
      Router.push("/dashboard");

      return {}; // Nenhum erro, fluxo normal
    } catch (error: any) {
      return { message: error?.response?.data?.detail || "Erro desconhecido" }; // Erro de token ou outro erro
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, id }}>
      {children}
    </AuthContext.Provider>
  );
}
