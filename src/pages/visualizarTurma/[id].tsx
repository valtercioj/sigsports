/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable object-shorthand */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unsafe-optional-chaining */
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { FilePdfTwoTone } from "@ant-design/icons";
import { Tabs, Table, Input, Form, notification, Checkbox, Modal } from "antd";
import { useEffect, useState } from "react";
import { DM_Sans, Quicksand } from "next/font/google";
import { useRouter } from "next/router";
import { SlTrash } from "react-icons/sl";
import FormEdit from "@/components/Forms/editarAluno";
import Layout from "@/components/Layout";
import ModalAluno from "@/components/Forms/Aluno";
import { pdfTurma } from "@/utils/pdfTurma";
import { declaracao } from "@/utils/declaracaoAluno";
import { api } from "@/services/api";

const { TabPane } = Tabs;

const quicksand = Quicksand({
  weight: "500",
  style: "normal",
  subsets: ["latin"],
});
const dm = DM_Sans({
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
  professor: "string";
  genero: "string";
  dias: "string";
  horarioInicial: "string";
  horarioFinal: "string";
  turno: "string";
  espaco: "string";
};

type AlunosVagasType = {
  turma_id: number;

  vagas_restantes: number;
};

export type AlunosType = {
  id: number;
  nomeAluno: string;
  matricula: string;
  contato: string;
  curso: string;
  matriculado: number;
};
const VisualizarTurma: NextPage<{
  turma: TurmaType;
  alunos: AlunosType[];
  vagas: AlunosVagasType;
}> = ({ turma, alunos, vagas }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filteredAlunosMatriculados, setFilteredAlunosMatriculados] = useState(
    alunos.filter((aluno) => aluno.matriculado === 0)
  );
  const [filteredAlunosEspera, setFilteredAlunosEspera] = useState(
    alunos.filter((aluno) => aluno.matriculado === 1)
  );
  const [selectAllMatriculados, setSelectAllMatriculados] =
    useState<boolean>(false);
  const [selectAllEspera, setSelectAllEspera] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [alunoId, setId] = useState<number>();
  const [pageSize, setPageSize] = useState(3);
  const handleSearch = () => {
    const alunosMatriculados = alunos.filter(
      (aluno) =>
        aluno.matriculado === 0 &&
        aluno.nomeAluno.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const alunosEspera = alunos.filter(
      (aluno) =>
        aluno.matriculado === 1 &&
        aluno.nomeAluno.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredAlunosMatriculados(alunosMatriculados);
    setFilteredAlunosEspera(alunosEspera);
  };

  const toggleSelectAllMatriculados = () => {
    setSelectAllMatriculados(!selectAllMatriculados);
    if (!selectAllMatriculados) {
      const allUserIds = filteredAlunosMatriculados.map((user) => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const toggleSelectAllEspera = () => {
    setSelectAllEspera(!selectAllEspera);
    if (!selectAllEspera) {
      const allUserIds = filteredAlunosEspera.map((user) => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };
  const deleteUser = async (id: number) => {
    try {
      await api.delete(`v1/matriculas/${id}`);
      notification.success({
        message: `Aluno deletado com sucesso ${id}`,
      });
      setFilteredAlunosMatriculados(
        filteredAlunosMatriculados.filter((aluno) => aluno.id !== id)
      );
      setFilteredAlunosEspera(
        filteredAlunosEspera.filter((aluno) => aluno.id !== id)
      );
      setIsModalDeleteOpen(false);
    } catch (error) {
      notification.error({
        message: "Erro ao deletar aluno",
      });
    }
  };

  const deleteUsers = async () => {
    if (selectedUsers.length === 0) {
      notification.error({
        message: "Escolha pelo menos 1 aluno para excluir",
      });
    } else {
      setLoading(true);
      try {
        await Promise.all(
          selectedUsers.map((id) => api.delete(`v1/matriculas/${id}`))
        );

        notification.success({
          message: "Alunos deletados com sucesso",
        });

        setFilteredAlunosMatriculados(
          filteredAlunosMatriculados.filter(
            (aluno) => !selectedUsers.includes(aluno.id)
          )
        );
        setFilteredAlunosEspera(
          filteredAlunosEspera.filter(
            (aluno) => !selectedUsers.includes(aluno.id)
          )
        );
        setIsModalDeleteOpen(false);
        setSelectedUsers([]);
      } catch (error) {
        notification.error({
          message: "Erro ao deletar alunos",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para alternar a seleção de um aluno
  const toggleUserSelection = (userId: number) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center">
          <Checkbox
            onChange={toggleSelectAllMatriculados}
            checked={selectAllMatriculados}
          />
          <button
            type="button"
            onClick={() => {
              if (selectedUsers.length === 0) {
                notification.error({
                  message: "Escolha pelo menos 1 aluno para excluir",
                });
              } else {
                setIsModalDeleteOpen(true);
              }
            }}
            className={`ml-4 flex h-[28.62px] w-[98px] items-center justify-center rounded-[32px] bg-emerald-950 text-base font-normal text-white-default ${dm.className}`}
          >
            DELETAR
          </button>
        </div>
      ),
      key: "checkbox",
      render: (text: any, record: any) => (
        <Checkbox
          onChange={() => toggleUserSelection(record.id)}
          checked={selectedUsers.includes(record.id)}
        />
      ),
    },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "nome",
      dataIndex: "nomeAluno",
      key: "name",
    },
    {
      title: "curso",
      dataIndex: "curso",
      key: "age",
    },
    {
      title: "matricula",
      dataIndex: "matricula",
      key: "address",
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any) => (
        <div className="flex gap-x-4">
          <FormEdit
            quicksand={quicksand}
            aluno={filteredAlunosMatriculados.filter(
              (aluno) => aluno.id === record.id
            )}
          />
          <SlTrash
            className="h-[22px] w-5 text-[#616161] hover:cursor-pointer"
            onClick={() => {
              setIsModalDeleteOpen(true);
              setId(record.id);
            }}
          />
          <FilePdfTwoTone
            className="h-[22px] w-5 text-[#616161] hover:cursor-pointer"
            onClick={() => {
              const alunoF: any = filteredAlunosMatriculados.find(
                (aluno) => aluno.id === record.id
              );

              declaracao(
                alunoF.nomeAluno,
                alunoF.matricula,
                turma.nomeTurma,
                turma.turno
              );
            }}
          />
        </div>
      ),
    },
  ];
  const columns1 = [
    {
      title: (
        <div className="flex items-center">
          <Checkbox
            onChange={toggleSelectAllEspera}
            checked={selectAllEspera}
          />
          <button
            type="button"
            onClick={() => {
              if (selectedUsers.length === 0) {
                notification.error({
                  message: "Escolha pelo menos 1 aluno para excluir",
                });
              } else {
                setIsModalDeleteOpen(true);
              }
            }}
            className={`ml-4 flex h-[28.62px] w-[98px] items-center justify-center rounded-[32px] bg-emerald-950 text-base font-normal text-white-default ${dm.className}`}
          >
            DELETAR
          </button>
        </div>
      ),
      key: "checkbox",
      render: (text: any, record: any) => (
        <Checkbox
          onChange={() => toggleUserSelection(record.id)}
          checked={selectedUsers.includes(record.id)}
        />
      ),
    },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "nome",
      dataIndex: "nomeAluno",
      key: "name",
    },
    {
      title: "curso",
      dataIndex: "curso",
      key: "age",
    },
    {
      title: "matricula",
      dataIndex: "matricula",
      key: "address",
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any) => (
        <div className="flex gap-x-4">
          <FormEdit
            quicksand={quicksand}
            aluno={filteredAlunosEspera.filter(
              (aluno) => aluno.id === record.id
            )}
          />
          <SlTrash
            className="h-[22px] w-5 text-[#616161] hover:cursor-pointer"
            onClick={() => {
              setIsModalDeleteOpen(true);
              setId(record.id);
            }}
          />
        </div>
      ),
    },
  ];
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

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const router = useRouter();
  const id: any = router.query?.id;
  const vagasAlunos = turma.vagas - vagas.vagas_restantes;
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  useEffect(() => {
    if (vagas?.vagas_restantes === 0) {
      notification.warning({
        message: "Turma completa",
        description: "A turma já atingiu sua capacidade máxima.",
      });
    }
  }, []);
  return (
    <>
      <Layout>
        <div className="flex h-full  flex-col items-center justify-center pl-4 md:w-4/5 md:pl-16 ">
          <div className="mt-4 flex h-full w-full items-center md:mt-16">
            <Link href="/listarTurmas" className="mr-6 hover:cursor-pointer">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="30" rx="5" fill="#16DB65" />
                <g clipPath="url(#clip0_1450_3668)">
                  <path
                    d="M13.9023 15.0004L18.543 10.3598L17.2173 9.03418L11.2511 15.0004L17.2173 20.9667L18.543 19.6411L13.9023 15.0004Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1450_3668">
                    <rect
                      width="22.5"
                      height="22.5"
                      fill="white"
                      transform="matrix(-1 0 0 1 26.25 3.75)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <h1
              className={`${quicksand.className} leading-[ 37.57px] text-3xl font-semibold text-green-bg`}
            >
              {turma.nomeTurma} {turma.genero}
            </h1>
          </div>

          <div className="mt-10 flex  w-full items-center  rounded-md border-[3px] border-green-200 py-2 pl-14 pr-10">
            <div className="flex w-full flex-col items-center font-Montserrat  tablet:flex-row">
              <div className="flex h-full w-full flex-col items-center justify-center py-1 font-medium text-green-bg md:w-1/4 md:py-0  ">
                <h1
                  className={`${quicksand.className} text-6xl md:text-[4.695rem]`}
                >
                  {turma.vagas}
                </h1>
                <p className="flex text-center tablet:w-[50px]">
                  Capacidade Total
                </p>
              </div>
              <div className="h-full md:w-1/4">
                <div className="flex w-full items-center">
                  <Image
                    src="/people.svg"
                    alt="people"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  <span
                    className={`${quicksand.className} ml-4 font-medium text-green-bg `}
                  >
                    Profª {turma.professor}
                  </span>
                </div>
                <div className="mt-4 flex w-full items-center">
                  <Image
                    src="/peoples.svg"
                    alt="people"
                    width={24}
                    height={24}
                  />
                  <span
                    className={`${quicksand.className} ml-2  font-medium text-green-bg`}
                  >
                    {vagasAlunos > 1
                      ? `${vagasAlunos} Alunos matriculados`
                      : `${vagasAlunos} Aluno matriculado`}
                  </span>
                </div>
                <div className="mt-[17px] flex w-full items-center">
                  <Image
                    src="/person-available.svg"
                    alt="people"
                    width={24}
                    height={24}
                  />
                  {vagas?.vagas_restantes ? (
                    <span
                      className={`${quicksand.className} ml-2  font-medium text-green-bg`}
                    >
                      {vagas?.vagas_restantes} Vagas disponíveis
                    </span>
                  ) : (
                    <span className="ml-2 font-Montserrat font-medium text-green-bg">
                      0 Vagas disponíveis
                    </span>
                  )}
                </div>
                <div />
                <div />
              </div>
              <div className="h-full py-2 md:w-1/4">
                <div className="flex w-full items-center">
                  <Image
                    src="/location.svg"
                    alt="location"
                    width={24}
                    height={24}
                  />
                  <span
                    className={`${quicksand.className} ml-2 font-medium text-green-bg`}
                  >
                    {turma.espaco || "Ginásio de esportes"}
                  </span>
                </div>
                <div className="mt-4 flex w-full items-center">
                  <Image
                    src="/clock.svg"
                    alt="clock"
                    width={17}
                    height={17}
                    className="ml-1"
                  />
                  <span
                    className={`${quicksand.className} ml-3  font-medium text-green-bg`}
                  >
                    {turma.horarioInicial} às {turma.horarioFinal}
                  </span>
                </div>
                <div className="mt-[17px] flex w-full items-center">
                  <Image
                    src="/calendar.svg"
                    alt="calendar"
                    width={24}
                    height={24}
                  />
                  <span
                    className={`${quicksand.className} ml-2  font-medium text-green-bg`}
                  >
                    {formatarDiasSemana(turma.dias)}
                  </span>
                </div>
                <div />
                <div />
              </div>
              <button
                type="button"
                className="flex h-[50px] w-[10.563rem] items-center justify-center space-x-2 rounded bg-green-200 text-white-default"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.00065 26.6668C7.26732 26.6668 6.63932 26.4055 6.11665 25.8828C5.59399 25.3602 5.3331 24.7326 5.33399 24.0002V20.0002H8.00065V24.0002H24.0007V20.0002H26.6673V24.0002C26.6673 24.7335 26.406 25.3615 25.8833 25.8842C25.3607 26.4068 24.7331 26.6677 24.0007 26.6668H8.00065ZM16.0007 21.3335L9.33399 14.6668L11.2007 12.7335L14.6673 16.2002V5.3335H17.334V16.2002L20.8007 12.7335L22.6673 14.6668L16.0007 21.3335Z"
                    fill="white"
                  />
                </svg>

                <span
                  className={`${quicksand.className}`}
                  onClick={() => pdfTurma(turma, alunos)}
                >
                  EXPORTAR
                </span>
              </button>
            </div>
          </div>

          <div className="mt-10 flex w-full flex-col">
            <Form
              onFinish={handleSearch}
              layout="vertical"
              className="flex w-full flex-col items-center"
              form={form}
              name="control-hooks"
            >
              <div className="flex w-full flex-col justify-center">
                <div className="flex w-full flex-col">
                  <Form.Item
                    label="Procure por o Nome do aluno"
                    layout="vertical"
                    name="nome"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, insira o nome completo",
                      },
                    ]}
                    className={`${quicksand.className}  text-2xl font-bold text-green-bg`}
                  >
                    <Input
                      name="search"
                      placeholder="Busque o nome do aluno"
                      className={`${quicksand.className} h-14 w-[80%] rounded-l-md border-y-2 border-l-2 border-green-200 bg-white-default pl-6 pr-6  text-base font-medium text-textGray placeholder:text-textGray focus:border-green-200 xl:w-[500px] tablet:w-[800px] 3xl:w-[55rem]`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </Form.Item>
                  <Form.Item className="flex w-full">
                    <button
                      type="submit"
                      className={`${quicksand.className} flex h-14 w-24 items-center justify-center rounded-md  bg-green-200 text-[17.28px] font-bold text-white-default md:w-36`}
                    >
                      Buscar Aluno
                    </button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <Tabs defaultActiveKey="1" className="w-full">
            <TabPane tab="Alunos Matriculados" key="1">
              <div className="mt-3 flex w-full">
                {id && (
                  <ModalAluno
                    quicksand={quicksand}
                    id={id}
                    capacidade={`${turma.vagas} - ${alunos.length}`}
                  />
                )}
              </div>
              <div className={`${quicksand.className} mt-4 w-full`}>
                <Table
                  dataSource={filteredAlunosMatriculados}
                  locale={{ emptyText: "Nenhum Aluno Matriculado" }}
                  columns={columns}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["3", "5", "10", "20", "50"],
                  }}
                  className="even:bg-d9d9d9 odd:bg-aeaeae mt-2 w-full table-auto divide-y divide-gray-200"
                  scroll={{ x: true }}
                  onChange={handleTableChange}
                />
              </div>
            </TabPane>
            <TabPane tab="Alunos em Espera" key="2">
              <div className={`${quicksand.className} mt-4 w-full`}>
                <Table
                  dataSource={filteredAlunosEspera}
                  locale={{ emptyText: "Nenhum Aluno Matriculado" }}
                  columns={columns1}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["3", "5", "10", "20", "50"],
                  }}
                  className="even:bg-d9d9d9 odd:bg-aeaeae mt-2 w-full table-auto divide-y divide-gray-200"
                  scroll={{ x: true }}
                  onChange={handleTableChange}
                />
              </div>
            </TabPane>
            {/* Adicione mais TabPane aqui conforme necessário */}
          </Tabs>
        </div>
      </Layout>
      <Modal
        title="Deletar Usuário"
        open={isModalDeleteOpen}
        okButtonProps={{
          loading: loading,
          className: "bg-emerald-950 text-white-default",
        }} // Estilo para o botão "OK"
        cancelButtonProps={{ className: "bg-red-500 text-white-default" }}
        okText="Confirmar" // Texto para o botão "OK"
        cancelText="Cancelar" // Texto para o botão "Cancelar"
        onOk={
          selectedUsers.length === 0 || selectedUsers.length === 1
            ? () => alunoId && deleteUser(alunoId)
            : () => deleteUsers()
        }
        onCancel={() => setIsModalDeleteOpen(false)}
      >
        <div>
          {selectedUsers.length > 1 &&
            `Tem certeza que deseja excluir esses usuários?`}
          {selectedUsers.length === 1 ||
            (selectedUsers.length === 0 &&
              `Tem certeza que deseja excluir esse usuário?`)}
        </div>
      </Modal>
    </>
  );
};

export default VisualizarTurma;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies["sig-token"];
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { id } = context.query;
  const response = await api.get(`v1/gerenciarTurmaId/${id}`);
  const response1 = await api.get(`v1/listarMatriculas/${id}`);
  const response2 = await api.get(`v1/vagasDeTurmas/${id}`);
  const turma = await response.data;
  const alunos = await response1.data;
  const vagas = await response2.data;
  return {
    props: {
      turma,
      alunos,
      vagas,
    },
  };
};
