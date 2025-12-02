import {
  Drawer,
  Button,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Space,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { api } from "@/services/api";
import { formatHour } from "@/utils/formUtils";
import { handleHourChange, formatHour } from "@/utils/formUtils";

interface FormValues {
  horarioInicial: string;
  horarioFinal: string;
}

export interface Prof {
  id: number;
  nome: string;
}

export interface Mod {
  id: number;
  nomeModalidade: string;
}

export interface Cat {
  id: number;
  categoria: string;
}

export default function FormTurma({
  quicksand,
  text,
  isMenu,
}: {
  quicksand: any;
  text: string;
  isMenu: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingR, setLoadingR] = useState(true);
  const [professores, setProfessores] = useState<Prof[]>();
  const [modalidades, setModalidades] = useState<Mod[]>();
  const [categorias, setCategorias] = useState<Cat[]>();
  async function getInfo() {
    setLoadingR(true);
    try {
      const resp1 = await api.get("v1/listarCaterogias/");
      const resp2 = await api.get("v1/listarModalidades");
      const resp3 = await api.get("v1/listarProfessores/");
      setCategorias(resp1.data);
      setModalidades(resp2.data);
      setProfessores(resp3.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingR(false);
    }
  }
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const formatHour = (value: string) => {
    // Remove tudo que não for dígito
    const cleaned = value.replace(/\D/g, "");

    // Aplica a máscara
    let formattedValue = "";
    if (cleaned.length <= 2) {
      formattedValue = cleaned;
    } else {
      formattedValue = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }

    return formattedValue;
  };

  useEffect(() => {
    if (open) {
      getInfo();
    }
  }, [open]);

  const handleHourChangeField = handleHourChange("horarioInicial", form);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const diasString = values.dias.join(", ");
      const values1 = { ...values, dias: diasString };

      await api.post(`v1/CriarTurma/`, values1);
      toast.success("Matrícula criada com sucesso");
      setTimeout(() => {
        // Executar ação após 20 segundos
        // Por exemplo, redirecionar para uma página específica
        if (router.asPath === "/listarTurmas") router.reload();
        setOpen(false);
      }, 2000); // 20 segundos
    } catch (e: any) {
      toast.error(e.response.data.erro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={showDrawer}
        className={
          !isMenu
            ? "flex h-[69px] w-full items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-700 text-lg font-bold text-white-default shadow-md transition-colors duration-300 hover:scale-105 hover:cursor-pointer"
            : ""
        }
      >
        {text}
      </button>
      <Drawer title="Criar Turma" onClose={onClose} open={open}>
        <h2
          className={`${quicksand.className} px-4 text-sm font-semibold leading-9 text-green-bg dark:text-green-300 `}
        >
          Insira as informações necessárias para a formação de uma turma:
        </h2>

        {loadingR ? (
          <div className="mt-8 flex h-full w-full justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            name="control-hooks"
            initialValues={{ layout: "vertical" }}
          >
            <Form.Item
              label="Nome da turma"
              name="nomeTurma"
              rules={[
                { required: true, message: "Insira o nome completo da turma" },
              ]}
              className="font-Montserrat text-base font-medium italic"
            >
              <Input
                placeholder="Insira o nome da turma"
                className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </Form.Item>
            <Form.Item
              label="Modalidade"
              className="h-full w-72 md:w-full"
              name="modalidade"
              rules={[
                { required: true, message: "Por favor, escolha a modalidade" },
              ]}
            >
              <Select
                placeholder="Selecione"
                className="bg-white h-10 w-80 rounded-[10px] border-2
              border-green-200 bg-white-default align-bottom font-medium text-textGray hover:ring-green-100 focus:ring-2"
              >
                {modalidades?.map((modalidade) => (
                  <Select.Option value={modalidade.id} key={modalidade.id}>
                    {modalidade.nomeModalidade}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Categoria"
              className="h-full w-72 md:w-full"
              name="categoria"
              rules={[
                { required: true, message: "Por favor, escolha a categoria" },
              ]}
            >
              <Select
                placeholder="Selecione"
                className="bg-white h-10 w-80 rounded-[10px] border-2
              border-green-200 bg-white-default align-bottom font-medium text-textGray hover:ring-green-100 focus:ring-2"
              >
                {categorias?.map((categoria) => (
                  <Select.Option value={categoria.id} key={categoria.id}>
                    {categoria.categoria}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Professor"
              className="h-full w-72 md:w-full"
              name="professor"
              rules={[
                { required: true, message: "Por favor, escolha o professor" },
              ]}
            >
              <Select
                placeholder="Selecione"
                className="bg-white h-10 w-80 rounded-[10px] border-2
              border-green-200 bg-white-default align-bottom font-medium text-textGray hover:ring-green-100 focus:ring-2"
              >
                {professores?.map((professor) => (
                  <Select.Option value={professor.id} key={professor.id}>
                    {professor.nome}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Informe o tipo da turma:"
              name="genero"
              rules={[{ required: true, message: "Por favor, escolha o tipo" }]}
            >
              <Radio.Group>
                <Radio value="Masculino" className="hover:border-green-200">
                  Masculino
                </Radio>
                <Radio value="Feminino">Feminino</Radio>
                <Radio value="Misto">Misto</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Vagas"
              name="vagas"
              className="font-Montserrat text-base font-medium italic"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira a quantidade de vagas",
                },
                { max: 3, message: "Digite quantidade correta" },
              ]}
            >
              <Input
                placeholder="Ex: 20"
                type="number"
                className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </Form.Item>
            <Form.Item
              label="Informe um turno para a turma:"
              name="turno"
              rules={[
                { required: true, message: "Por favor, escolha o turno" },
              ]}
            >
              <Radio.Group>
                <Radio value="Matutino" className="hover:border-green-200">
                  Matutino
                </Radio>
                <Radio value="Vespertino">Vespertino</Radio>
                <Radio value="Noturno">Noturno</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Que horário deseja iniciar?"
              name="horarioInicial"
              className="font-Montserrat text-base font-medium italic"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira a hora inicial!",
                },
                { min: 5, message: "Digite a hora corretamente" },
              ]}
            >
              <Input
                placeholder="06:30"
                className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
                maxLength={5}
                onChange={handleHourChange("horarioInicial")}
              />
            </Form.Item>
            <Form.Item
              label="Que horário deseja encerrar?"
              name="horarioFinal"
              className="font-Montserrat text-base font-medium italic"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira a hora final!",
                },
                { min: 5, message: "Digite a hora corretamente" },
              ]}
            >
              <Input
                placeholder="17:30"
                className="text-white h-10 w-full rounded-lg border-2 border-green-200 pl-4 font-Montserrat text-base font-medium italic placeholder:text-textGray focus:outline-none focus:ring-2 focus:ring-green-100"
                maxLength={5}
                onChange={handleHourChange("horarioFinal")}
              />
            </Form.Item>
            <Form.Item
              label="Informe os dias da semana:"
              name="dias"
              rules={[
                { required: true, message: "Escolha um dos dias da semana" },
              ]}
            >
              <Checkbox.Group>
                <Space direction="vertical">
                  <Checkbox value="segunda">Segunda-feira</Checkbox>
                  <Checkbox value="terca">Terça-feira</Checkbox>
                  <Checkbox value="quarta">Quarta-feira</Checkbox>
                  <Checkbox value="quinta">Quinta-feira</Checkbox>
                  <Checkbox value="sexta">Sexta-feira</Checkbox>
                </Space>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item className="">
              <Button
                type="primary"
                loading={loading}
                htmlType="submit"
                className="bg-green-200 hover:bg-green-100"
              >
                CRIAR TURMA
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </>
  );
}
