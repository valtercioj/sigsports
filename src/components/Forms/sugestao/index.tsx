/* eslint-disable no-param-reassign */
import { Drawer, Button, Form, Input, notification } from "antd";
import { useState } from "react";
import { api2 } from "@/services/api";

type Sugestao = {
  nome: string;
  descricao: string;
};
export default function FormUser({
  quicksand,
  montserrat,
}: {
  quicksand: any;
  montserrat: any;
}) {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Sugestao) => {
    setLoading(true);
    try {
      await api2.post("v1/esportes/", values);
      setOpen(false);
      notification.success({
        message: "Sugestão enviada com sucesso",
        description: `A sugestão de ${values.nome} foi enviada com sucesso!`,
      });
      form.resetFields();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const notificationAluno = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        type="default"
        onClick={notificationAluno}
        className={`${montserrat.className} mt-7 h-14 w-36 bg-green-200 text-lg font-bold text-white-default`}
      >
        SUGERIR
      </Button>

      <Drawer
        title="Sugerir Esporte"
        onClose={onClose}
        open={open}
        className="text-white-default"
        style={{ backgroundColor: "#2D3A3A" }}
      >
        <h2
          className={`${quicksand.className} px-4 text-sm font-semibold leading-9 text-green-bg dark:text-green-300 `}
        >
          Insira as informações necessárias para a sugestão de um esporte
        </h2>

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          name="control-hooks"
          initialValues={{ layout: "vertical" }}
        >
          <div className="flex flex-col">
            <span className="flex items-center gap-x-2 text-white-default">
              <span className="text-red-500">*</span>
              Modalidade
            </span>
            <Form.Item
              name="nome"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira o nome completo do esporte",
                },
              ]}
              className={`${montserrat.className} text-base font-medium italic `}
            >
              <Input
                placeholder="Nome da Modalidade"
                className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <span className="flex items-center gap-x-2 text-white-default">
              <span className="text-red-500">*</span>
              Descrição
            </span>
            <Form.Item
              name="descricao"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira a descrição",
                },
                {
                  max: 150,
                  message: "A descrição deve ter no máximo 150 caracteres",
                },
              ]}
              className={`${montserrat.className} text-base font-medium italic`}
            >
              <TextArea
                rows={2}
                maxLength={150}
                placeholder="Descrição da Modalidade"
                className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </Form.Item>
          </div>
          <Form.Item className="">
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              className="bg-green-200 hover:bg-green-100"
            >
              CRIAR
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
