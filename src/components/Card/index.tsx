/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-bind */
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Quicksand } from "next/font/google";
import { Dropdown, Menu, Modal, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { api } from "@/services/api";
import EditarTurma from "@/components/Forms/editarTurma";

const quicksand = Quicksand({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export type AlunosType = {
  id: number;
  nomeAluno: string;
  matricula: string;
  contato: string;
  curso: string;
  matriculado: number;
};

export interface Modalidades {
  id: number;
  nomeModalidade: string;
  descricao: string;
}

export interface Professores {
  id: string;
  nome: string;
  matricula: string;
  email: string;
}

export interface Categorias {
  id: number;
  categoria: string;
  descricao: string;
}

export default function Card({
  turma,
  sexo,
  prof,
  horaInicial,
  horaFinal,
  turmaCompleta,
  dias,
  id,
  modalidades,
  categorias,
  professores,
}: {
  turma: string;
  turmaCompleta: any;
  sexo: string;
  prof: string;
  horaInicial: string;
  horaFinal: string;
  dias: string;
  id: number;
  modalidades: Modalidades[];
  categorias: Categorias[];
  professores: Professores[];
}) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [alunosMatriculados, setAlunosMatriculados] = useState<AlunosType[]>();
  const [alunosEspera, setAlunosEspera] = useState<AlunosType[]>();
  const handleGetAlunos = async () => {
    const response1 = await api.get(`v1/listarMatriculas/${id}`);
    const filteredAlunosMatriculados = response1.data.filter(
      (aluno: AlunosType) => aluno.matriculado === 0
    );
    const filteredAlunosEspera = response1.data.filter(
      (aluno: AlunosType) => aluno.matriculado === 1
    );
    setAlunosMatriculados(filteredAlunosMatriculados);
    setAlunosEspera(filteredAlunosEspera);
  };

  useEffect(() => {
    handleGetAlunos();
  }, []);

  function formatarDiasSemana(diasSemana: string) {
    const diasArray = diasSemana.split(",");

    if (diasArray.length === 1) {
      return diasArray[0];
    }
    if (diasArray.length === 2) {
      return diasArray.map((dia) => dia.replace("-feira", "")).join(" e ");
    }
    const ultimoDia = diasArray.pop();
    const diasFormatados = diasArray
      .map((dia) => dia.replace("-feira", ""))
      .join(", ");
    return `${diasFormatados} e ${ultimoDia?.replace("-feira", "")}`;
  }

  function handleRedirect(id: number) {
    router.push(`/visualizarTurma/${id}`);
  }

  async function handleDeleteTurma() {
    setShowModal(false);
    try {
      const resp = await api.delete(`v1/gerenciarTurmaId/${id}/`);
      if (resp.status === 204) {
        await new Promise((resolve) => {
          toast.success("Turma excluída com sucesso", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            onOpen: resolve,
          });
        });
        setTimeout(() => {
          router.reload();
        }, 3000);
      } else {
        throw new Error("Erro ao excluir turma");
      }
    } catch (error) {
      await new Promise((resolve, reject) => {
        toast.error("Ocorreu um erro ao excluir a turma", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onOpen: reject,
        });
      });
    }
  }

  const menu = (
    <Menu className="flex w-24 flex-col items-center">
      <Menu.Item key="1">
        <EditarTurma
          id={id}
          turmaCompleta={turmaCompleta}
          text="Editar"
          quicksand={quicksand}
          categorias={categorias}
          modalidades={modalidades}
          professores={professores}
        />
      </Menu.Item>
      <Menu.Item key="2" danger onClick={() => setShowModal(true)}>
        Excluir
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="shadow-bottom bg-custom w-[14.375rem] rounded-lg border-2 border-green-200">
      <div className="flex w-full">
        <h1
          className={`${quicksand.className} flex h-[51px] w-full items-center justify-center bg-green-200 font-Montserrat text-[17.28px] font-bold text-white-default hover:cursor-pointer`}
          onClick={() => handleRedirect(id)}
        >
          <b>{turma}</b>
        </h1>
        <Dropdown
          overlay={menu}
          trigger={["click"]}
          placement="bottomLeft"
          className="w-10"
        >
          <span className="relative flex items-center bg-green-200 hover:cursor-pointer">
            <MoreOutlined className="cursor-pointer text-2xl text-white-default" />
          </span>
        </Dropdown>
      </div>
      <div className="ml-5 mt-4 flex h-[calc(300px-51px-1rem)] flex-col justify-between gap-y-4 font-Montserrat text-sm font-medium">
        {" "}
        {/* Ajuste a altura aqui */}
        <div className="flex items-center">
          <Image src="/user.svg" width={24} height={24} alt="user" />
          <span className={`${quicksand.className}`}>Profª {prof}</span>
        </div>
        <div className="flex items-center">
          <Image
            src="/clock.svg"
            width={17}
            height={17}
            alt="clock"
            className="ml-1 mr-1"
          />
          <span className={`${quicksand.className}`}>
            {horaInicial} às {horaFinal}
          </span>
        </div>
        <div className="flex items-center">
          <Image
            src="/calendar.svg"
            width={24}
            height={24}
            alt="calendar"
            className="mr-1"
          />
          <span className={`${quicksand.className}`}>
            {formatarDiasSemana(dias)}
          </span>
        </div>
        <div className="flex items-center">
          <Image
            src="/peoples.svg"
            width={24}
            height={24}
            alt="peoples"
            className="mr-1"
          />
          <span className={`${quicksand.className}`}>
            {alunosMatriculados?.length} Aluno
            {alunosMatriculados?.length && alunosMatriculados?.length > 1
              ? "s matriculados"
              : " matriculado"}
          </span>
        </div>
        {(alunosEspera?.length ?? 0) > 0 && (
          <div className="flex items-center">
            <Image
              src="/peoples.svg"
              width={24}
              height={24}
              alt="peoples"
              className="mr-1"
            />
            <span className={`${quicksand.className}`}>
              {alunosEspera?.length && alunosEspera?.length} Aluno
              {alunosEspera?.length && alunosEspera?.length > 1
                ? "s na espera"
                : " na espera"}
            </span>
          </div>
        )}
        <div className="flex h-full w-full items-end">
          <span
            className={`${
              quicksand.className
            } mb-6 flex h-8 w-[90%] items-center justify-center rounded-md text-center text-base font-normal text-white-default ${
              sexo === "Misto"
                ? "bg-yellow text-orange"
                : sexo === "Feminino"
                ? "text-100 bg-pink-200"
                : sexo === "Masculino"
                ? "bg-blue-200 text-blue-100"
                : ""
            }`}
          >
            {sexo}
          </span>
        </div>
      </div>
      <Modal
        title={
          <h3 className="flex w-full justify-center font-Montserrat text-3xl text-[27px] font-bold leading-normal">
            DESEJA EXCLUIR O ALUNO?
          </h3>
        }
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <div key="" className="flex w-full justify-center gap-x-4">
            <Button
              key="cancel"
              className="h-12 w-[138.543px] rounded-md border border-green-200 font-Montserrat text-[14.87px] text-sm font-bold not-italic text-black"
              onClick={() => setShowModal(false)}
            >
              CANCELAR
            </Button>
            <Button
              key="delete"
              className="h-12 w-[138.543px] rounded-md bg-[#FF6636] font-Montserrat text-[14.87px] text-sm font-bold not-italic text-white-default"
              onClick={handleDeleteTurma}
            >
              EXCLUIR
            </Button>
          </div>,
        ]}
      >
        <p className="flex w-full justify-center text-center font-['Raleway'] text-2xl font-semibold leading-9">
          Esta ação é permanente, não será possível recuperar o aluno
          posteriormente!
        </p>
      </Modal>
    </div>
  );
}
