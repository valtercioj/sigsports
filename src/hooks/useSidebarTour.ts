import { TourProps } from "antd";

export const useSidebarTour = (refs: {
  ref1: React.RefObject<HTMLDivElement>;
  ref2: React.RefObject<HTMLDivElement>;
  ref3: React.RefObject<HTMLDivElement>;
  ref4: React.RefObject<HTMLDivElement>;
  ref5: React.RefObject<HTMLDivElement>;
}) => {
  const { ref1, ref2, ref3, ref4, ref5 } = refs;

  const condintions = (title: string) => {
    if (title === "Criar Turma") {
      return ref1;
    }
    if (title === "Listar Turmas") {
      return ref2;
    }
    if (title === "Sugestões") {
      return ref3;
    }
    if (title === "Empréstimo") {
      return ref4;
    }
    if (title === "Usuários") {
      return ref5;
    }
  };

  const steps: TourProps["steps"] = [
    {
      title: "Criar Turma",
      description: "Formulário de criação de uma turma no sistema",
      target: () => ref1.current,
      arrow: true,
    },
    {
      title: "Listar Turmas",
      description: "Listagem de todas as turmas do sistema",
      target: () => ref2.current,
      placement: "right",
    },
    {
      title: "Sugestões",
      description: "Sugestões de esportes escolhidos pelos alunos",
      target: () => ref3.current,
      placement: "top",
    },
    {
      title: "Empréstimo",
      description: "Formulário de empréstimo de materiais",
      target: () => ref4.current,
      placement: "right",
    },
  ];

  const steps1: TourProps["steps"] = steps.slice(0, 4);

  return { condintions, steps, steps1 };
};
