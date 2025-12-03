export interface TFormData {
  dias: string[];
  horaFinal: string;
  horaInicial: string;
  nomeTurma: string;
  vagas: string;
  genero: string;
  professor: TProfessor[];
  modalidade: TModalidade[];
  categoria: Tcategoria[];
}

export interface TProfessor {
  id: number;
  nome: string;
  matricula: string;
  email: string;
}

export interface TModalidade {
  id: number;
  nomeModalidade: string;
  descricao: string;
}

export interface Tcategoria {
  id: number;
  categoria: string;
  descricao: string;
}
export interface TTurma {
  modalidade: string;
  categoria: string;
  vagas: number;
  professor: number;

  dias: string;
  horarioInicial: string;
  horarioFinal: string;
}

export type AlunosType = {
  id: number;
  nomeAluno: string;
  matricula: string;
  contato: string;
  curso: string;
  matriculado?: number;
};

export type TurmaType = {
  id: number;
  nomeTurma: "string";
  modalidade: number;
  categoria: number;
  vagas: number;
  professor: "string";
  genero: "string";
  dias: "string";
  horarioInicial: "string";
  horarioFinal: "string";
  turno: "string";
  espaco?: "string";
};
