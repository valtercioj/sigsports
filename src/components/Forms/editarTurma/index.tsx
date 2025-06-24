/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import {
  Drawer,
  Button,
  Form,
  Input,
  Radio,
  Checkbox,
  Space,
  Select,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { api } from "@/services/api";

interface FormValues {
  horarioInicial: string;
  horarioFinal: string;
}

export interface Turma {
  id: number;
  dias: string;
}

export type TurmaType = {
  id: number;
  nomeTurma: "string";
  modalidade: number;
  categoria: number;
  vagas: number;
  professor: string;
  genero: "string";
  dias: any;
  horarioInicial: "string";
  horarioFinal: "string";
  turno: "string";
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

export default function FormTurma({
  quicksand,
  text,
  id,
  turmaCompleta,
  modalidades,
  categorias,
  professores,
}: {
  quicksand: any;
  text: string;
  id: number;
  turmaCompleta: TurmaType;
  modalidades: Modalidades[];
  categorias: Categorias[];
  professores: Professores[];
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingR, setLoadingR] = useState(true);
  async function getInfo() {
    setLoadingR(true);
    const modalidade = modalidades.find(
      (modalidadeV) =>
        modalidadeV.nomeModalidade === String(turmaCompleta.modalidade)
    );
    const categoria = categorias.find(
      (categoriaV) => categoriaV.categoria === String(turmaCompleta.categoria)
    );
    const professor = professores.find(
      (professorV) => professorV.nome === turmaCompleta.professor
    );
    try {
      form.setFieldsValue({
        nomeTurma: turmaCompleta.nomeTurma,
        modalidade: modalidade?.id,
        categoria: categoria?.id,
        professor: professor?.id,
        genero: turmaCompleta.genero,
        vagas: turmaCompleta.vagas,
        turno: turmaCompleta.turno,
        horarioInicial: turmaCompleta.horarioInicial,
        horarioFinal: turmaCompleta.horarioFinal,
        dias: turmaCompleta.dias
          .split(",") // transforma em array
          .map((s: string) => s.trim()) // remove espaços
          .map((s: string) => s.replace("-feira", "")), // remove "-feira",
      });
    } catch (error) {
      //
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

  // Função para lidar com a mudança nos inputs de hora
  const handleHourChange =
    (fieldName: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const formattedValue = formatHour(value);
      // Define o valor formatado de volta no estado do formulário
      form.setFieldsValue({
        [fieldName]: formattedValue,
      });
    };

  useEffect(() => {
    getInfo();
  }, []);

  const onFinish = async (values: TurmaType) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        dias: values.dias
          .map((s: string) => s.trim()) // remove espaços extras
          .map((s: any) => `${s}-feira`)
          .join(", "),
      };
      await api.put(`v1/gerenciarTurmaId/${id}/`, payload);
      toast.success("Turma editada com sucesso");
      setTimeout(() => {
        if (router.asPath === "/listarTurmas") router.reload();
        setOpen(false);
      }, 2000);
    } catch (e: any) {
      toast.error(e.response?.data.erro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={showDrawer}>
        {text}
      </button>
      <Drawer title="Editar Turma" onClose={onClose} open={open}>
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
                className="bg-white h-10 w-80 rounded-[10px] border-2 border-green-200 bg-white-default align-bottom font-medium text-textGray hover:ring-green-100 focus:ring-2"
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
                className="bg-white h-10 w-80 rounded-[10px] border-2 border-green-200 bg-white-default align-bottom font-medium text-textGray hover:ring-green-100 focus:ring-2"
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
                className="bg-white h-10 w-80 rounded-[10px] border-2 border-green-200 bg-white-default align-bottom font-medium text-textGray hover:ring-green-100 focus:ring-2"
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
                { required: true, message: "Por favor, insira a matricula" },
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
                  message: "Por favor, insira a hora inicial!",
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
            <Form.Item label="Informe os dias da semana:" name="dias">
              <Checkbox.Group defaultValue={turmaCompleta.dias}>
                <Space direction="vertical">
                  <Checkbox value="segunda">Segunda-feira</Checkbox>
                  <Checkbox value="terça">Terça-feira</Checkbox>
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
                EDITAR TURMA
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </>
  );
}
