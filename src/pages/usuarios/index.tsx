/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
import { Raleway, DM_Sans, Quicksand } from "next/font/google";
import { FaSearch } from "react-icons/fa";
import { TbPencil } from "react-icons/tb";
import { SlTrash } from "react-icons/sl";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Table,
  Spin,
  Pagination,
  Switch,
  Space,
  Drawer,
} from "antd";
import router from "next/router";
import ModalUserDelete from "@/components/ModalUserDelete";
import FormEdit from "@/components/Forms/editarUsuario";
import Layout from "@/components/Layout";
import api from "@/pages/api";
import { apiSuap, api2 } from "@/services/api";

const raleway = Raleway({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const dm = DM_Sans({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  style: "normal",
  subsets: ["latin"],
});

export interface UserType {
  id: number;
  nome: string;
  sobrenome: string;
  matricula: string;
  adm: number;
}

export interface Tipo {
  id: number;
  definicaoLocalForm: string;
}

export interface Area {
  id: number;
  definicaoArea: string;
}

export default function Index() {
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery("user", async () => {
    try {
      const response = await api.getAllUsers();
      return response.data;
    } catch (error) {
      toast.error("Tempo expirado");
      //   destroyCookie(null, "psi-token");
      //   destroyCookie(null, "psi-refreshToken");
      //   router.push("/login");
    }
  });
  const [id, setId] = useState(0);
  const [form] = Form.useForm(); // Extrai a referência do form
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [admin, setAdmin] = useState(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const usersPerPage = 6;

  const toggleUserSelection = (id: number) => {
    const userId = id;
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allUserIds = users.map((user: any) => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCancelEdit = () => {
    setIsModalEditOpen(false);
    setIsEditMode(false);
    setUserId(undefined);
    form.resetFields();
  };

  const onSubmit = async (data: UserType) => {
    const data1 = { ...data, adm: admin ? 1 : 0 };
    setLoading(true);
    try {
      if (userId) {
        try {
          await api.updateUser(userId, data1);
          toast.success("Usuário editado com sucesso!");
        } catch (error) {
          //   toast.error("Tempo expirado");
          //   destroyCookie(null, "psi-token");
          //   destroyCookie(null, "psi-refreshToken");
          //   router.push("/login");
        }
      } else {
        try {
          await api.createUser(data1);
          toast.success("Usuário criado com sucesso!");
        } catch (error: any) {
          if (error?.response?.status === 401) {
            toast.error("Tempo expirado");
            // destroyCookie(null, "psi-token");
            // destroyCookie(null, "psi-refreshToken");
            // router.push("/login");
          } else {
            toast.error("Erro ao criar o usuário");
          }
        }
      }
      setOpen(false);
      setIsModalEditOpen(false);
      setIsEditMode(false);
      setUserId(undefined);
      setLoading(false);
      refetch();
      form.resetFields();
    } catch (error) {
      toast.error(`Erro ao ${isEditMode ? "editar" : "criar"} usuário.`);
    } finally {
      setLoading(false);
    }
  };
  const mappedData = users?.map((item: UserType) => ({
    id: item.id,
    nome: item.nome, // Obtendo o primeiro nome
    sobrenome: item.sobrenome, // Obtendo o sobrenome
    matricula: item.matricula,
    administrador: item.adm,
  }));

  const filteredData = mappedData?.filter(
    (user: any) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matricula.includes(searchTerm) ||
      user.administrador.toString().includes(searchTerm.toString()) // Garantindo que searchTerm também seja string
  );

  // Calcula o índice do último usuário na página atual
  const indexOfLastUser = currentPage * usersPerPage;
  // Calcula o índice do primeiro usuário na página atual
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // Seleciona apenas os usuários da página atual
  const currentUsers = filteredData?.slice(indexOfFirstUser, indexOfLastUser);
  // Calcula o número total de páginas
  // Função para alterar a página
  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const deleteUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Escolha pelo menos 1 usuário para excluir");
    } else {
      setIsModalDeleteOpen(true);
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center">
          <Checkbox onChange={toggleSelectAll} checked={selectAll} />
          <button
            type="button"
            onClick={() => deleteUsers()}
            className={`ml-4 flex h-[28.62px] w-[98px] items-center justify-center rounded-[32px] bg-emerald-950   text-base font-normal text-white-default ${dm.className}`}
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
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Sobrenome",
      dataIndex: "sobrenome",
      key: "sobrenome",
    },
    {
      title: "Matricula",
      dataIndex: "matricula",
      key: "matricula",
    },
    {
      title: "Administrador",
      dataIndex: "administrador",
      key: "administrador",
      render: (text: any, record: any) => (
        <div className="ml-6 w-full">
          {record.administrador === 1 ? (
            <span className="text-xl font-bold text-green-300">
              <CheckCircleOutlined />
            </span>
          ) : (
            <span className="text-xl font-bold text-red-600">
              <CloseOutlined />
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any) => (
        <div className="flex gap-x-4">
          <FormEdit
            quicksand={quicksand}
            usuario={currentUsers.find(
              (aluno: UserType) => aluno.id === record.id
            )}
          />
          <SlTrash
            className="h-[22px] w-5 text-[#616161] hover:cursor-pointer"
            onClick={() => {
              setIsModalDeleteOpen(true);
              setId(record?.id);
            }}
          />
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any) => {
    setCurrentPage(pagination.current);
    // Verifica se há filtro no campo de pesquisa
    if (filters && filters.nome) {
      setSearchTerm(filters.nome[0]);
    } else {
      setSearchTerm("");
    }
  };
  return (
    <Layout
      title="Usuários"
      description="Gerenciamento de usuários cadastrados no sistema"
      op
    >
      <>
        <div className="my-9 flex w-full flex-col justify-center gap-6 pr-5 md:my-0 md:mt-4 md:flex-row md:justify-between">
          <div className="relative">
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 transform"
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Pesquisa..."
              className="bg-white h-[37px] w-[212px] rounded-lg border border-neutral-200 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            className={`h-10   w-[197px] bg-green-200 text-base font-bold text-white-default     shadow ${dm.className}`}
            onClick={showDrawer}
          >
            ADICIONAR USUÁRIO
          </button>
        </div>

        <Table
          loading={isLoading}
          columns={columns}
          dataSource={currentUsers}
          locale={{ emptyText: "Nenhum Usuário Cadastrado" }}
          pagination={{ position: ["bottomRight"] }} // Desabilitar a paginação dentro do componente Table
          onChange={handleTableChange}
          rowKey="id"
          className="even:bg-d9d9d9 odd:bg-aeaeae mt-2 w-full table-auto divide-y divide-gray-200"
          scroll={{ x: true }}
        />
      </>
      <Drawer title="Criar Usuário" onClose={onClose} open={open}>
        <h2
          className={`${quicksand.className} px-4 text-sm font-semibold leading-9 text-green-bg dark:text-green-300 `}
        >
          Insira as informações necessárias para cadastrar o(a) usuário(a):{" "}
        </h2>

        <Form
          layout="vertical"
          onFinish={onSubmit}
          form={form}
          name="control-hooks"
          initialValues={{ layout: "vertical" }}
        >
          <Form.Item
            label="Nome"
            name="nome"
            rules={[
              { required: true, message: "Por favor, insira o nome completo" },
            ]}
            className="font-Montserrat text-base font-medium italic"
          >
            <Input
              placeholder="Nome do usuário(a)"
              className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </Form.Item>
          <Form.Item
            label="Sobrenome"
            name="sobrenome"
            rules={[
              { required: true, message: "Por favor, insira o nome completo" },
            ]}
            className="font-Montserrat text-base font-medium italic"
          >
            <Input
              placeholder="Sobrenome do usuário(a)"
              className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </Form.Item>
          <Form.Item
            label="matricula"
            name="matricula"
            className="font-Montserrat text-base font-medium italic"
            rules={[
              { required: true, message: "Por favor, insira a matricula" },
              { len: 14, message: "Digite uma matricula valida" },
            ]}
          >
            <Input
              placeholder="20241014646040"
              className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </Form.Item>
          <Space direction="horizontal" className="mb-4 flex">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              className="bg-[#9EACAE] hover:bg-green-300 "
              checked={admin} // Definindo o estado atual do Switch
              onChange={() => setAdmin(!admin)}
            />
            <span className={` text-base font-normal text-black`}>
              Usuário Administrador
            </span>
          </Space>
          <Form.Item className="">
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              className="bg-green-200 hover:bg-green-100"
            >
              CADASTRAR
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      {/* Modal de edição */}
      <Modal
        title="Editar Usuário"
        visible={isModalEditOpen}
        onCancel={handleCancelEdit}
        footer={null}
      >
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Por favor, insira o nome" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sobrenome"
            name="sobrenome"
            rules={[
              { required: true, message: "Por favor, insira o sobrenome" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor, insira o email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="text-white bg-emerald-950 shadow"
              loading={loading}
            >
              Editar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ModalUserDelete
        isModalDeleteOpen={isModalDeleteOpen}
        setIsModalDeleteOpen={setIsModalDeleteOpen}
        userId={id}
        selectedUsers={selectedUsers}
        refetch={refetch}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies["sig-token"];
  const refreshToken = req.cookies["sig-refreshToken"];

  // Variável para armazenar matrícula

  // Verificando se o token está presente
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Tentando acessar a API com o token
  let response = await apiSuap.get("minhas-informacoes/meus-dados", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Se a resposta for diferente de 200, tentamos o refresh token
  if (response.status !== 200) {
    if (!refreshToken) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Tentamos obter um novo token com o refresh token
    response = await apiSuap.get("autenticacao/token/refresh/", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    // Se o refresh token também não for válido, redirecionamos para login
    if (response.status !== 200) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // Usamos o novo token para acessar os dados do usuário
    const newToken = response.data.access;
    response = await apiSuap.get("minhas-informacoes/meus-dados/", {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  // Acessamos a matrícula dos dados do usuário
  const { matricula } = response.data;
  // Buscando informações sobre o usuário
  const response1 = await api2.get(`v1/usuarios/`);
  const users = response1.data;

  // Encontrando o usuário correspondente
  const user = users.find((user: any) => user.matricula === matricula);
  const admin = `${user?.adm}`;
  // Se o usuário não for admin ou não estiver autenticado, redirecionamos para login
  if (!token || admin === "0") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Agora, retornamos os dados para as props da página
  return {
    props: {
      tipos: response.data, // Dados do usuário
      areas: response1.data, // Usuários da segunda API
    },
  };
};
