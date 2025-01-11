import { Quicksand } from "next/font/google";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useState } from "react";
import { Table, Tooltip } from "antd";
import { api2 } from "@/services/api";
import Layout from "@/components/Layout";

const quicksand = Quicksand({
  weight: "500",
  style: "normal",
  subsets: ["latin"],
});
// const dm = DM_Sans({
//   weight: "400",
//   style: "normal",
//   subsets: ["latin"],
// });
export default function Sugestoes() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const columns = [
    // {
    //   title: (
    //     <div className="flex items-center">
    //       <Checkbox
    //         onChange={toggleSelectAllMatriculados}
    //         checked={selectAllMatriculados}
    //       />
    //       <button
    //         type="button"
    //         onClick={() => {
    //           if (selectedUsers.length === 0) {
    //             notification.error({
    //               message: "Escolha pelo menos 1 aluno para excluir",
    //             });
    //           } else {
    //             setIsModalDeleteOpen(true);
    //           }
    //         }}
    //         className={`ml-4 flex h-[28.62px] w-[98px] items-center justify-center rounded-[32px] bg-emerald-950 text-base font-normal text-white-default ${dm.className}`}
    //       >
    //         DELETAR
    //       </button>
    //     </div>
    //   ),
    //   key: "checkbox",
    //   render: (text: any, record: any) => (
    //     <Checkbox
    //       onChange={() => toggleUserSelection(record.id)}
    //       checked={selectedUsers.includes(record.id)}
    //     />
    //   ),
    // },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "nome do Esporte",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (text: string) => (
        <Tooltip title={text}>
          <div
            style={{
              maxHeight: "50px", // Defina a altura máxima
              overflow: "hidden",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
  ];

  const { data, isLoading } = useQuery(
    "alunosMatriculadosSugestoes2",
    async () => {
      const response = await api2.get("v1/esportes/");
      return response.data;
    }
  );
  return (
    <Layout
      title="Sugestões"
      description="Gerenciamento de sugestões cadastrados no sistema"
    >
      <div className="flex h-full  flex-col items-center justify-center pl-4 md:w-4/5 md:pl-16 ">
        <div className="mt-4 flex h-full w-full items-center md:mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-6 hover:cursor-pointer"
          >
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
          </button>
        </div>
        <div className={`${quicksand.className} mt-4 w-full`}>
          <Table
            dataSource={data}
            locale={{ emptyText: "Nenhum Aluno Matriculado" }}
            columns={columns}
            pagination={{
              current: currentPage,
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["3", "5", "10", "20", "50"],
            }}
            loading={isLoading}
            className="even:bg-d9d9d9 odd:bg-aeaeae mt-2 w-full table-auto divide-y divide-gray-200"
            scroll={{ x: true }}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Layout>
  );
}
