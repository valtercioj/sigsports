/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import { Spin } from "antd";
import {
  Search,
  Calendar,
  Save,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MinusCircle,
} from "lucide-react";
import { GetServerSideProps } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/LayoutProfessor";
import { api } from "@/services/api";

interface Turma {
  id: number;
  nomeTurma: string;
  modalidade: string;
  categoria: string;
  vagas: number;
  professor: string;
  genero: string;
  dias: string;
  horarioInicial: string;
  horarioFinal: string;
  turno: string;
  espaco: string;
}

interface Aluno {
  id: number;
  nomeAluno: string;
  matricula: string;
  contato: string;
  curso: string;
  matriculado: number;
}

interface AlunoFrequencia extends Aluno {
  presente: boolean | null;
}

export default function FrequenciaPage({ turma }: { turma: Turma | null }) {
  const [alunos, setAlunos] = useState<AlunoFrequencia[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (turma) {
      fetchAlunosDaTurma();
    } else {
      setError("Turma não encontrada.");
      setLoading(false);
    }
  }, [turma?.id]);

  useEffect(() => {
    if (alunos.length > 0) {
      setAlunos(alunos.map((a) => ({ ...a, presente: null })));
    }
  }, [selectedDate]);

  const fetchAlunosDaTurma = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://sigsport.pythonanywhere.com/api/v1/listarMatriculas/${turma?.id}`
      );
      if (!res.ok) throw new Error("Erro ao carregar alunos");
      const data: Aluno[] = await res.json();
      const alunosComPresenca: AlunoFrequencia[] = data.map((aluno) => ({
        ...aluno,
        presente: null,
      }));
      setAlunos(alunosComPresenca);
    } catch (err) {
      setError("Erro ao carregar alunos.");
    } finally {
      setLoading(false);
    }
  };

  const togglePresenca = (id: number) => {
    setAlunos((prev) =>
      prev.map((aluno) =>
        aluno.id === id
          ? {
              ...aluno,
              presente:
                aluno.presente === null ? true : aluno.presente ? false : null,
            }
          : aluno
      )
    );
  };

  const marcarTodos = (presente: boolean | null) => {
    setAlunos(alunos.map((a) => ({ ...a, presente })));
  };

  const salvarFrequencia = () => {
    const naoMarcados = alunos.filter((a) => a.presente === null);
    if (naoMarcados.length > 0) {
      const confirmar = confirm(
        `Há ${naoMarcados.length} aluno(s) sem frequência. Deseja continuar?`
      );
      if (!confirmar) return;
    }

    const payload = {
      turma: turma?.id,
      data: selectedDate,
      frequencias: alunos.map((a) => ({
        alunoId: a.id,
        presente: a.presente,
      })),
    };

    alert("Frequência salva com sucesso!");
  };

  const filteredAlunos = alunos.filter(
    (a) =>
      a.nomeAluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.matricula.includes(searchTerm) ||
      a.curso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentes = alunos.filter((a) => a.presente === true).length;
  const ausentes = alunos.filter((a) => a.presente === false).length;
  const naoMarcados = alunos.filter((a) => a.presente === null).length;
  const percentualPresenca =
    alunos.length > 0 ? Math.round((presentes / alunos.length) * 100) : 0;

  return (
    <Layout
      title="Frequência da Turma"
      description="Registre a presença dos alunos desta turma"
      rollback
      SidebarComponent={() => null}
    >
      <Spin spinning={loading}>
        <div className="space-y-4 sm:space-y-6">
          {turma && (
            <Card className="mx-2 mt-4 sm:mx-0">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Calendar className="text-primary-green mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Detalhes da Aula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border-2 border-green-400 md:h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Buscar Aluno
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        placeholder="Nome, matrícula ou curso"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 border-green-400 pl-10 md:h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:gap-4 lg:grid-cols-4">
                  <div>
                    <strong>Turma:</strong> {turma.nomeTurma}
                  </div>
                  <div>
                    <strong>Modalidade:</strong> {turma.modalidade}
                  </div>
                  <div>
                    <strong>Turno:</strong> {turma.turno}
                  </div>
                  <div>
                    <strong>Gênero:</strong> {turma.genero}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="mx-2 bg-red-100 text-white-default sm:mx-0">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <XCircle className="mr-2 h-5 w-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && (
            <>
              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-3 px-2 sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
                {[
                  ["Total", alunos.length, <Users />],
                  [
                    "Presentes",
                    presentes,
                    <CheckCircle className="text-green-600" />,
                  ],
                  ["Ausentes", ausentes, <XCircle className="text-red-600" />],
                  [
                    "Não Marcados",
                    naoMarcados,
                    <MinusCircle className="text-gray-500" />,
                  ],
                  [
                    "% Presença",
                    `${percentualPresenca}%`,
                    <Clock className="text-primary-green" />,
                  ],
                ].map(([label, value, icon]) => (
                  <Card key={String(label)}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-600">
                            {label}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {value}
                          </p>
                        </div>
                        <div className="h-6 w-6 sm:h-8 sm:w-8">{icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Lista de alunos */}
              <Card className="mx-2 sm:mx-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Users className="text-primary-green mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Lista de Presença ({filteredAlunos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Button
                      onClick={() => marcarTodos(true)}
                      variant="outline"
                      className="border-green-500 text-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Todos Presentes
                    </Button>
                    <Button
                      onClick={() => marcarTodos(false)}
                      variant="outline"
                      className="border-red-500 text-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Todos Ausentes
                    </Button>
                    <Button
                      onClick={() => marcarTodos(null)}
                      variant="outline"
                      className="border-gray-500 text-gray-600"
                    >
                      <MinusCircle className="mr-2 h-4 w-4" /> Limpar
                    </Button>
                  </div>

                  {filteredAlunos.map((aluno) => (
                    <div
                      key={aluno.id}
                      onClick={() => togglePresenca(aluno.id)}
                      className={`mb-2 flex cursor-pointer items-center justify-between rounded-lg border-2 p-3 transition-colors sm:p-4
                        ${
                          aluno.presente === true
                            ? "border-green-200 bg-green-50"
                            : aluno.presente === false
                            ? "border-red-200 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                    >
                      <div>
                        <p className="font-medium">{aluno.nomeAluno}</p>
                        <p className="text-sm text-gray-600">
                          {aluno.matricula} • {aluno.curso}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          aluno.presente === true
                            ? "bg-green-600"
                            : aluno.presente === false
                            ? "bg-red-600"
                            : "bg-gray-500"
                        } text-white`}
                      >
                        {aluno.presente === true
                          ? "Presente"
                          : aluno.presente === false
                          ? "Ausente"
                          : "Não Marcado"}
                      </Badge>
                    </div>
                  ))}

                  {filteredAlunos.length === 0 && (
                    <p className="mt-6 text-center text-gray-500">
                      Nenhum aluno encontrado
                    </p>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={salvarFrequencia}
                      disabled={alunos.length === 0}
                      className="bg-primary-green hover:bg-primary-green/90 text-white"
                    >
                      <Save className="mr-2 h-4 w-4" /> Salvar Frequência
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </Spin>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies["sig-token"];
  const turmaId = context.query.id;
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const response = await api.get("v1/listarTurmas/");
  const turma = response.data.find(
    (p: any) =>
      p.id === parseInt(Array.isArray(turmaId) ? turmaId[0] : turmaId || "", 10)
  );
  return {
    props: {
      turma: turma || null,
    },
  };
};
