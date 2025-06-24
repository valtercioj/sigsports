/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
import { Drawer, Button, Form, Input, Space, Switch } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { TbPencil } from "react-icons/tb";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { parseCookies, setCookie } from "nookies";
import api from "@/pages/api";

type Aluno = {
  id: number;
  nome: string;
  sobrenome: string;
  matricula: string;
  administrador: number;
  tour: number;
};

export default function FormUser({
  quicksand,
  usuario,
}: {
  quicksand: any;
  usuario: Aluno;
}) {
  const [admin, setAdmin] = useState(usuario?.administrador === 1);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const showDrawer = () => {
    form.setFieldsValue({
      nome: usuario?.nome,
      sobrenome: usuario?.sobrenome,
      matricula: usuario?.matricula,
    });
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };
  const [loading, setLoading] = useState(false);
  const cookies = parseCookies();
  const onFinish = async (values: Aluno) => {
    setLoading(true);
    const { matricula } = cookies;
    try {
      const user = { ...values, adm: admin ? 1 : 0, tour: 0 };
      await api.updateUser(usuario.id, user);
      toast.success("Usuário editado com sucesso");
      setOpen(false);
      if (matricula === user.matricula) {
        setCookie(undefined, "adm", `${user.adm}`);

        router.reload();
      }
      router.reload();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TbPencil
        className="h-[22px] w-5 text-[#616161] hover:cursor-pointer"
        onClick={showDrawer}
      />

      <Drawer title=" Editar Aluno(a)" onClose={onClose} open={open}>
        <h2
          className={`${quicksand.className} px-4 text-sm font-semibold leading-9 text-green-bg dark:text-green-300 `}
        >
          Insira as informações necessárias para editar o(a) aluno(a):{" "}
        </h2>

        <Form
          layout="vertical"
          onFinish={onFinish}
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
          <Form.Item className="" name="adm">
            <Space direction="horizontal" className="mb-4 flex">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                className="bg-[#9EACAE] hover:bg-green-300 "
                checked={admin}
                onChange={() => setAdmin(!admin)}
              />
              <span className={` text-base font-normal text-black`}>
                Usuário Administrador
              </span>
            </Space>
          </Form.Item>
          <Form.Item className="">
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              className="bg-green-200 hover:bg-green-100"
            >
              ATUALIZAR
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
