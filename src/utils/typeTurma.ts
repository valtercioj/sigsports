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
