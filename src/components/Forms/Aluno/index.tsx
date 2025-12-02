/* eslint-disable no-param-reassign */
import { Drawer, Button, Form, Input, notification } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { AlunosType, TurmaType } from "@/utils/typeTurma";

export default function FormUser({
  quicksand,
  id,
  capacidade,
  alunosEspera,
  alunosMatriculados,
  turma,
  fnAlunosEspera,
  fnAlunosMatriculados,
}: {
  quicksand: any;
  id: number;
  turma: TurmaType;
  capacidade: number;
  alunosMatriculados: AlunosType[];
  alunosEspera: AlunosType[];
  fnAlunosMatriculados?: any;
  fnAlunosEspera?: any;
}) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const onClose = () => {
    setOpen(false);
  };
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (capacidade === 0) {
        values.matriculado = 1;
        await api.post(`v1/criarMatricula/${id}`, values);
        toast.success("Matrícula criada com sucesso");
        setOpen(false);
        form.resetFields();
        fnAlunosEspera([...alunosEspera, values]);
      } else {
        await api.post(`v1/criarMatricula/${id}`, values);
        toast.success("Matrícula criada com sucesso");
        setOpen(false);
        form.resetFields();
        fnAlunosMatriculados([...alunosMatriculados, values]);
      }
    } catch (e: any) {
      toast.error(e.response.data.erro);
    } finally {
      setLoading(false);
    }
  };
  const notificationAluno = () => {
    if (alunosMatriculados.length < turma.vagas && alunosEspera.length > 0) {
      notification.error({
        message: `Existe ${
          alunosEspera.length > 1
            ? `${alunosEspera.length} alunos`
            : `${alunosEspera.length} aluno`
        }  na lista de espera`,
      });
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        type="default"
        onClick={notificationAluno}
        className={`  mt-4 flex items-center justify-center rounded-md bg-green-200 px-4 py-6 text-base font-bold leading-normal text-transparent  text-white-default`}
      >
        {capacidade === 0
          ? "Matricular Aluno(a) na espera"
          : "Matricular Aluno(a)"}
      </Button>

      <Drawer title=" Matricular Aluno(a)" onClose={onClose} open={open}>
        <h2
          className={`${quicksand.className} px-4 text-sm font-semibold leading-9 text-green-bg dark:text-green-300 `}
        >
          Insira as informações necessárias para matricular o(a) aluno(a):{" "}
        </h2>

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          name="control-hooks"
          initialValues={{ layout: "vertical" }}
        >
          <Form.Item
            label="nome completo"
            name="nomeAluno"
            rules={[
              { required: true, message: "Por favor, insira o nome completo" },
            ]}
            className="font-Montserrat text-base font-medium italic"
          >
            <Input
              placeholder="Nome do aluno"
              className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </Form.Item>
          <Form.Item
            label="curso"
            name="curso"
            rules={[{ required: true, message: "Por favor, insira o curso" }]}
            className="font-Montserrat text-base font-medium italic"
          >
            <Input
              placeholder="Curso do Aluno"
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
          <Form.Item
            label="número para contato"
            name="contato"
            className="font-Montserrat text-base font-medium italic"
            rules={[
              {
                required: true,
                message: "Por favor, insira o número de contato",
              },
            ]}
          >
            <Input
              placeholder="(xx) xxxxx-xxxx"
              className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </Form.Item>
          <Form.Item className="">
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              className="bg-green-200 hover:bg-green-100"
            >
              {capacidade === 0 ? "Matricular na espera" : "Matricular"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
