import { Quicksand } from "next/font/google";
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
      op
      SidebarComponent={() => null}
    >
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
          className="even:bg-d9d9d9 odd:bg-aeaeae mt-2 w-full divide-y divide-gray-200"
          scroll={{ x: true }}
          onChange={handleTableChange}
        />
      </div>
    </Layout>
  );
}
