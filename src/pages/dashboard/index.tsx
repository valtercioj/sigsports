/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Quicksand } from "next/font/google";
import Link from "next/link";
import { MoreOutlined } from "@ant-design/icons";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { Dropdown, Menu } from "antd";
import Layout from "@/components/Layout";
import { api } from "@/services/api";
import CriarTurma from "@/components/Forms/CriarTurma";

const quicksand = Quicksand({
  weight: "600",
  style: "normal",
  subsets: ["latin"],
});
const Pie = dynamic(() => import("@ant-design/plots").then(({ Pie }) => Pie), {
  ssr: false,
});
const Column = dynamic(
  () => import("@ant-design/plots").then(({ Column }) => Column),
  {
    ssr: false,
  }
);

type Turma = {
  id: number;
  nomeTurma: string;
  modalidade: string;
  categoria: string;
  vagas: number;
  professor: string;
  genero: string;
  dias: string;
  horarioInicial: string;
  horarioFinal: string;
  turno: string;
  espaco: string;
};

type AlunoType = {
  turma_id: number;
  nome_turma: string;
  vagas_restantes: number;
  genero: string;
};

type TurmaComAlunos = Turma & {
  vagas_restantes: number;
  alunosMatriculados: number;
  vagaDisponivel: boolean;
};

const IndexPage = ({
  turmas,
  alunosT,
}: {
  turmas: Turma[];
  alunosT: AlunoType[];
}) => {
  const [somaVagas, setSoma] = useState(0);
  const [selectedGenero, setSelectedGenero] = useState<string | undefined>(
    undefined
  );
  const turmasComAlunos: TurmaComAlunos[] = alunosT
    .map((aluno: AlunoType): TurmaComAlunos | null => {
      const turma = turmas.find((turma: Turma) => turma.id === aluno.turma_id);
      if (turma) {
        return {
          ...turma,
          vagas_restantes: aluno.vagas_restantes,
          alunosMatriculados:
            turma.vagas - aluno.vagas_restantes > turma.vagas
              ? turma.vagas
              : turma.vagas - aluno.vagas_restantes,
          vagaDisponivel: aluno.vagas_restantes > 0,
        };
      }
      return null;
    })
    .filter((turma): turma is TurmaComAlunos => turma !== null); // Removendo nulls
  const turmasAlunosOrdenadas: TurmaComAlunos[] = turmasComAlunos.sort(
    (a, b) => {
      // Primeiro, ordena por alunos matriculados (do maior para o menor)
      if (b.alunosMatriculados !== a.alunosMatriculados) {
        return b.alunosMatriculados - a.alunosMatriculados;
      }

      // Em caso de empate, ordena por vagas totais (do maior para o menor)
      return b.vagas - a.vagas;
    }
  );

  // Função para buscar turmas equivalentes
  const buscarTurmasEquivalentes = (
    turmas: TurmaComAlunos[]
  ): TurmaComAlunos[] =>
    turmas.map((turma) => ({
      ...turma,
      vagaDisponivel: turma.vagas_restantes > 0,
    }));

  const equivalentesTodos: TurmaComAlunos[] =
    buscarTurmasEquivalentes(turmasComAlunos);
  const primeirosSeis: TurmaComAlunos[] = turmasAlunosOrdenadas.slice(0, 3);
  const equivalentesPrimeirosTres: TurmaComAlunos[] =
    buscarTurmasEquivalentes(primeirosSeis);
  // Continue com o código para preparar os gráficos
  const customColors = ["#34DAFF", "#8BFFBA", "#058C42"];

  const data = equivalentesPrimeirosTres
    .map((turma: any) => ({
      type: turma.nomeTurma,
      value: turma.alunosMatriculados,
    }))
    .sort((a, b) => b.value - a.value);

  const config: any = {
    appendPadding: 16,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    innerRadius: 0.7,
    color: customColors,
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false,
      content: {
        style: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: 20,
        },
        content: `Alunos`,
      },
    },
    legend: {
      itemName: {
        style: {
          fontSize: 16,
          marginRight: 40,
        },
      },
    },
  };

  const data1: any = [];
  equivalentesTodos.forEach((el: any) => {
    if (!selectedGenero || el.genero === selectedGenero) {
      data1.push(
        {
          name: "Vagas Preenchidas",
          titulo: el.nomeTurma,
          value:
            el.alunosMatriculados > el.vagas ? el.vagas : el.alunosMatriculados,
        },
        {
          name: "Vagas Totais",
          titulo: el.nomeTurma,
          value: el.vagas,
        }
      );
    }
  });
  console.log(equivalentesTodos);
  const config1: any = {
    data: data1,
    xField: "titulo",
    yField: "value",
    isGroup: true,
    seriesField: "name",
    color: ["#058C42", "#AAAAAA"],
    label: {
      layout: [
        { type: "interval-adjust-position" },
        { type: "interval-hide-overlap" },
        { type: "adjust-color" },
      ],
    },
    legend: {
      position: "top",
      itemName: {
        style: {
          fontSize: 18,
        },
      },
    },
  };

  useEffect(() => {
    const soma = equivalentesTodos.reduce(
      (total, turma) => total + turma.vagas_restantes,
      0
    );
    setSoma(soma);
  }, [equivalentesTodos]);

  const handleMenuClick = (genero: string) => {
    setSelectedGenero(genero);
  };

  const menu = (
    <Menu className="custom-dropdown-menu">
      <Menu.Item key="1" onClick={() => handleMenuClick("Masculino")}>
        <div className="flex items-center text-green-bg">
          <Image
            src="/people.svg"
            alt="people"
            width={14}
            height={14}
            className="fill-current"
          />
          <span className={`${quicksand.className} ml-2  font-medium`}>
            Masculino
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleMenuClick("Feminino")}>
        <div className="flex items-center text-green-bg">
          <Image
            src="/people.svg"
            alt="people"
            width={14}
            height={14}
            className="fill-current"
          />
          <span className={`${quicksand.className} ml-2  font-medium`}>
            Feminino
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="3" onClick={() => handleMenuClick("Misto")}>
        <div className="flex items-center text-green-bg">
          <Image
            src="/peoples.svg"
            alt="people"
            width={14}
            height={14}
            className="fill-current"
          />
          <span className={`${quicksand.className} ml-2  font-medium`}>
            Misto
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="4" onClick={() => handleMenuClick("")}>
        <div className="flex items-center text-green-bg">
          <Image
            src="/peoples.svg"
            alt="people"
            width={18}
            height={18}
            className="fill-current"
          />
          <span className={`${quicksand.className} ml-2  font-medium`}>
            Todos
          </span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout title="Dashboard" rollback={false} op SidebarComponent={() => null}>
      <>
        <div className="mt-4 flex w-full flex-col items-center justify-between gap-y-4 pr-8 2xl:flex-row">
          <div className="flex h-[16.813rem] w-full flex-col items-center rounded-lg border border-l-8 border-r-8 border-green-200 p-8 shadow-md 2xl:w-[35.063rem] ">
            <h2 className={`${quicksand.className} text-lg font-bold`}>
              Esportes mais procurados
            </h2>
            <div className="flex h-full w-full items-center justify-around px-4">
              <div
                className={`${quicksand.className} flex h-56 w-full flex-row-reverse justify-center`}
              >
                <Pie {...config} className="w-full" />
              </div>
            </div>
          </div>
          <div className="flex h-[16.813rem] w-full flex-col items-center justify-evenly rounded-lg border border-l-8 border-r-8 border-green-200 shadow-md 2xl:w-[18.188rem] ">
            <h1 className={`${quicksand.className} text-[22px] font-bold`}>
              VAGAS DISPONIVEIS
            </h1>
            <h1 className={`${quicksand.className} text-[75px] font-medium`}>
              {somaVagas}
            </h1>
            <p
              className={`${quicksand.className} w-[116px] text-center text-lg font-medium leading-normal`}
            >
              {/* Vagas totais */}
            </p>
          </div>

          <div
            className={`${quicksand.className} flex w-full flex-col justify-between gap-y-4 2xl:w-[19.875rem]`}
          >
            <CriarTurma
              text="CRIAR TURMA"
              quicksand={quicksand}
              isMenu={false}
            />
            <Link
              href="/listarTurmas"
              className="flex h-[69px] w-full items-center justify-center rounded-lg border border-cyan-600 text-lg font-bold shadow-md transition-colors duration-300 hover:scale-105 hover:cursor-pointer"
            >
              LISTAR TURMAS
            </Link>
            <button
              type="button"
              className="flex h-[69px] w-full items-center justify-center rounded-lg border border-cyan-600 text-lg font-bold shadow-md transition-colors duration-300 hover:scale-105 hover:cursor-pointer"
            >
              EMPRÉSTIMOS
            </button>
          </div>
        </div>
        <div className={`${quicksand.className} mt-9 w-[98%] shadow-xl`}>
          <h1 className="flex h-20 w-full items-center justify-between rounded bg-gradient-to-br from-green-200 to-green-500 text-center text-base font-bold uppercase text-white-default md:text-2xl lg:text-2xl">
            <span className="flex-1 text-center">
              Quantidade de alunos por esporte
            </span>
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomLeft"
              className="w-10"
            >
              <span className="relative ml-4 flex items-center hover:cursor-pointer">
                <MoreOutlined className="cursor-pointer text-4xl text-white-default" />
              </span>
            </Dropdown>
          </h1>
        </div>
        <div className="mb-6 flex h-[400px] w-full justify-center md:mb-0">
          <Column {...config1} className="w-full overflow-x-auto" />
        </div>
      </>
    </Layout>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies["sig-token"];
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const response = await api.get("v1/listarTurmas");
  const resp1 = await api.get(`v1/vagasDeTurmas`);
  const turmas = await response.data;
  const alunosT = await resp1.data;
  return {
    props: {
      turmas,
      alunosT,
    },
  };
};
