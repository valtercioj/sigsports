import { GetServerSideProps } from "next";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import Layout from "@/components/Layout";
import Calendar from "@/components/Calendar";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Início",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Calendário",
    children: <Calendar />,
  },
];

export default function Professores() {
  return (
    <Layout title="Calendário" op>
      <div className="h-full w-full">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </Layout>
  );
}

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
  // const { id } = context.query;
  // // const response = await api.get(`v1/gerenciarTurmaId/${id}`);
  // // const response1 = await api.get(`v1/listarMatriculas/${id}`);
  // // const response2 = await api.get(`v1/vagasDeTurmas/${id}`);
  // const turma = await response.data;
  // const alunos = await response1.data;
  // const vagas = await response2.data;
  return {
    props: {
      // turma,
      // alunos,
      // vagas,
    },
  };
};
