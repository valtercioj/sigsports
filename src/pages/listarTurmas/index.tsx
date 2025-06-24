/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Montserrat, Quicksand } from "next/font/google";
import { Dropdown, Menu } from "antd";
import CriarTurma from "@/components/Forms/CriarTurma";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import { api } from "@/services/api";
import ImportFile from "@/components/Excel";

const quicksand = Quicksand({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export type TurmaType = {
  id: number;
  nomeTurma: "string";
  modalidade: number;
  categoria: number;
  vagas: number;
  professor: string;
  genero: "string";
  dias: "string";
  horarioInicial: "string";
  horarioFinal: "string";
  turno: "string";
};

export default function ListarTurmas({
  turmas,
  modalidades,
  categorias,
  professores,
}: {
  turmas: TurmaType[];
  modalidades: any;
  categorias: any;
  professores: any;
}) {
  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        className="border-b border-[#e8e8e8] hover:scale-105 hover:border-b "
      >
        <div className="w-full">
          <div
            className={` ${montserrat.className} w-full text-base font-medium `}
          >
            <CriarTurma
              quicksand={quicksand}
              text="Criar Turma Manualmente"
              isMenu
            />
          </div>
        </div>
      </Menu.Item>

      <Menu.Item key="2" className=" hover:scale-105">
        <ImportFile />
      </Menu.Item>
    </Menu>
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTurmas, setFilteredTurmas] = useState(turmas);
  const handleSearch = () => {
    const filtered = turmas.filter((turma) =>
      turma.nomeTurma.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTurmas(filtered);
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Layout
      title="Listagem de Turmas"
      description="visualizações de todas as turmas criadas"
      op
    >
      <>
        <div className="flex h-full w-full flex-col items-center gap-x-4 md:flex-row">
          <div className="flex w-full flex-col justify-center">
            <label
              htmlFor="search"
              className="font-Montserrat text-lg font-medium text-[#FFF]"
            >
              Buscar Turmas{}
            </label>
            <div className="flex w-full">
              <input
                type="text"
                name="search"
                placeholder="Digite o nome da turma"
                className={`${quicksand.className} h-14 w-72 rounded-l-lg border border-green-200 bg-white-default pl-12 pr-6 text-base  italic  text-textGray placeholder:text-textGray focus:border-green-200 md:w-3/4 `}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />

              <button
                type="button"
                className={`${quicksand.className} flex h-14 w-20 items-center justify-center rounded-r-lg bg-gradient-to-br from-green-200 to-green-500  text-[17.28px] font-bold text-white-default md:w-36`}
                onClick={handleSearch}
              >
                <b>Buscar </b>
              </button>
            </div>
          </div>
          <div className="mt-3 flex w-full">
            <Dropdown overlay={menu} trigger={["click"]} className="flex">
              <button
                type="button"
                // icon={<FaDownload />}
                className={`${quicksand.className}  mt-4 flex h-14 w-60 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-700  text-[17.28px] font-bold leading-normal text-white-default `}
              >
                Criar Turma
              </button>
            </Dropdown>
          </div>
        </div>
        <div
          className={`${quicksand.className} mr-auto mt-14 grid gap-x-12 gap-y-10 rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 `}
        >
          {filteredTurmas.map((turma) => (
            <Card
              key={turma.id}
              id={turma.id}
              turmaCompleta={turma}
              turma={turma.nomeTurma}
              sexo={turma.genero}
              prof={turma.professor}
              dias={turma.dias}
              horaInicial={turma.horarioInicial}
              horaFinal={turma.horarioFinal}
              categorias={categorias}
              modalidades={modalidades}
              professores={professores}
            />
          ))}
        </div>
      </>
    </Layout>
  );
}

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
  const response2 = await api.get(`v1/vagasDeTurmas`);
  const response3 = await api.get(`v1/listarModalidades`);
  const response4 = await api.get(`v1/listarCaterogias/`);
  const response5 = await api.get(`v1/listarProfessores/`);
  const turmas = await response.data;
  const vagas = await response2.data;
  const modalidades = await response3.data;
  const categorias = await response4.data;
  const professores = await response5.data;
  return {
    props: {
      turmas,
      vagas,
      modalidades,
      categorias,
      professores,
    },
  };
};
