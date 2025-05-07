/* eslint-disable no-param-reassign */
import { api } from "@/services/api";

export type ReturnValues = {
  mensage: string;
  status: boolean;
};

export async function matricularAlunoEspera(aluno: any): Promise<ReturnValues> {
  try {
    // Verifica se não há vagas disponíveis

    // Marca aluno como matriculado
    aluno[0].matriculado = 0;

    // Faz a requisição para matricular o aluno
    const response = await api.put(`v1/matriculas/${aluno[0].id}`, aluno[0]);

    // Verifica se a resposta da API não é 200
    if (response.status !== 200) {
      return {
        mensage: response.data?.mensage || "Erro ao matricular aluno",
        status: false,
      };
    }

    return {
      mensage: `Aluno ${aluno[0].nomeAluno} matriculado com sucesso`,
      status: true,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.mensage || error.message || "Erro desconhecido";
    return {
      mensage: errorMessage,
      status: false,
    };
  }
}
