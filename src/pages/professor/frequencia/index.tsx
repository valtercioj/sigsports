"use client";

import { useState, useEffect } from "react";
import { Spin, notification, Select } from "antd";
import {
  Search,
  Calendar,
  Save,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  MinusCircle,
} from "lucide-react";
import { GetServerSideProps } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import Layout from "@/components/LayoutProfessor";
import { api } from "@/services/api";
import { getProfessorIdFromServerSideProps } from "@/utils/serverPropsUtils";

const { Option } = Select;
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
  presente: boolean | null; // null = não marcado, true = presente, false = ausente
}

export default function Frequencia({ professorId }: { professorId: number }) {
  const [selectedTurma, setSelectedTurma] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<AlunoFrequencia[]>([]);
  const [loadingTurmas, setLoadingTurmas] = useState(false);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTurmas();
  }, []);

  useEffect(() => {
    if (selectedTurma && selectedTurma !== "") {
      fetchAlunos(Number.parseInt(selectedTurma, 10));
    } else {
      setAlunos([]);
    }
  }, [selectedTurma]);

  // Reset frequência quando mudar a data
  useEffect(() => {
    if (alunos.length > 0) {
      setAlunos(alunos.map((aluno) => ({ ...aluno, presente: null })));
    }
  }, [selectedDate]);

  const fetchTurmas = async () => {
    try {
      setLoadingTurmas(true);
      const response = await fetch(
        `https://sigsport.pythonanywhere.com/api/v1/listarTurmasId/${professorId}/`
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar turmas");
      }

      const data = await response.json();
      setTurmas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar turmas");
    } finally {
      setLoadingTurmas(false);
    }
  };

  const fetchAlunos = async (turmaId: number) => {
    try {
      setLoadingAlunos(true);
      setError(null);
      const response = await fetch(
        `https://sigsport.pythonanywhere.com/api/v1/listarMatriculas/${turmaId}`
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar alunos");
      }

      const data: Aluno[] = await response.json();
      // Inicializar todos os alunos com estado neutro (null)
      const alunosComFrequencia: AlunoFrequencia[] = data.map((aluno) => ({
        ...aluno,
        presente: null,
      }));
      setAlunos(alunosComFrequencia);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar alunos");
      setAlunos([]);
    } finally {
      setLoadingAlunos(false);
    }
  };

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nomeAluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm) ||
      aluno.curso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePresenca = (id: number) => {
    setAlunos(
      alunos.map((aluno) => {
        if (aluno.id === id) {
          // Ciclo: null -> true -> false -> null
          let novoEstado: boolean | null;
          if (aluno.presente === null) {
            novoEstado = true; // Primeira vez clicando: marca como presente
          } else if (aluno.presente === true) {
            novoEstado = false; // Segunda vez: marca como ausente
          } else {
            novoEstado = null; // Terceira vez: volta para neutro
          }
          return { ...aluno, presente: novoEstado };
        }
        return aluno;
      })
    );
  };

  const marcarTodosPresentes = () => {
    setAlunos(alunos.map((aluno) => ({ ...aluno, presente: true })));
  };

  const marcarTodosAusentes = () => {
    setAlunos(alunos.map((aluno) => ({ ...aluno, presente: false })));
  };

  const limparFrequencia = () => {
    setAlunos(alunos.map((aluno) => ({ ...aluno, presente: null })));
  };

  const salvarFrequencia = () => {
    const alunosNaoMarcados = alunos.filter((aluno) => aluno.presente === null);

    if (alunosNaoMarcados.length > 0) {
      const confirmacao = confirm(
        `Existem ${alunosNaoMarcados.length} aluno(s) sem frequência marcada. Deseja continuar mesmo assim?`
      );
      if (!confirmacao) return;
    }

    // Aqui você implementaria a lógica para salvar a frequência na API
    const frequenciaData = {
      turmaId: selectedTurma,
      data: selectedDate,
      frequencias: alunos.map((aluno) => ({
        alunoId: aluno.id,
        presente: aluno.presente,
      })),
    };

    console.log("Dados para salvar:", frequenciaData);
    alert("Frequência salva com sucesso!");
  };

  const presentes = alunos.filter((aluno) => aluno.presente === true).length;
  const ausentes = alunos.filter((aluno) => aluno.presente === false).length;
  const naoMarcados = alunos.filter((aluno) => aluno.presente === null).length;
  const percentualPresenca =
    alunos.length > 0 ? Math.round((presentes / alunos.length) * 100) : 0;

  const turmaAtual = turmas.find((t) => t.id.toString() === selectedTurma);

  return (
    <Layout
      title="Controle de Frequência"
      description="Registre a presença dos alunos em suas turmas"
      rollback
    >
      <Spin size="large" spinning={loadingTurmas || loadingAlunos}>
        <div className="space-y-4 text-green-bg sm:space-y-6">
          {/* Filtros */}
          <Card className="mx-2 mt-4 sm:mx-0">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-base  sm:text-lg">
                <Calendar className="text-primary-green mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Selecionar Aula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Turma
                  </label>
                  <Select
                    value={selectedTurma || undefined}
                    onChange={(value) => setSelectedTurma(value)}
                    placeholder="Selecione uma turma"
                    className="w-full border-2 border-green-400  text-black placeholder:text-gray-700 md:h-12 md:min-w-[200px]"
                    variant="borderless"
                  >
                    {turmas.map((turma) => (
                      <Option
                        key={turma.id}
                        value={turma.id.toString()}
                        className=""
                      >
                        <div className="flex items-center gap-x-4 md:flex-col md:items-start md:justify-center md:gap-x-0">
                          <span className="font-medium">{turma.nomeTurma}</span>
                          <span className="text-xs text-gray-500">
                            {turma.horarioInicial} às {turma.horarioFinal}
                          </span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Data da Aula
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="focus:border-primary-green border-2 border-green-400 md:h-12"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Buscar Aluno
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Nome, matrícula ou curso"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="focus:border-primary-green border-2 border-green-400 pl-10 placeholder:text-gray-400 md:h-12"
                    />
                  </div>
                </div>
              </div>

              {turmaAtual && (
                <div className="mt-4 rounded-lg bg-gray-50 p-3 sm:p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm sm:gap-4 lg:grid-cols-4">
                    <div>
                      <span className="font-medium text-gray-700">
                        Modalidade:
                      </span>
                      <p className="truncate text-gray-900">
                        {turmaAtual.modalidade}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Gênero:</span>
                      <p className="text-gray-900">{turmaAtual.genero}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Turno:</span>
                      <p className="text-gray-900">{turmaAtual.turno}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Vagas:</span>
                      <p className="text-gray-900">{turmaAtual.vagas}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <Card className="mx-2 border-red-200 bg-red-50 sm:mx-0">
              <CardContent className="p-4">
                <div className="flex items-center text-red-800">
                  <XCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTurma && loadingAlunos ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="text-primary-green mx-auto mb-4 h-8 w-8 animate-spin" />
                <p className="text-gray-600">Carregando alunos...</p>
              </div>
            </div>
          ) : selectedTurma ? (
            <>
              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-3 px-2 sm:grid-cols-3 sm:gap-4 sm:px-0 lg:grid-cols-5">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-gray-600 sm:text-sm">
                          Total
                        </p>
                        <p className="text-lg font-bold text-gray-900 sm:text-2xl">
                          {alunos.length}
                        </p>
                      </div>
                      <Users className="text-primary-blue h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-gray-600 sm:text-sm">
                          Presentes
                        </p>
                        <p className="text-lg font-bold text-green-600 sm:text-2xl">
                          {presentes}
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600 sm:h-8 sm:w-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-gray-600 sm:text-sm">
                          Ausentes
                        </p>
                        <p className="text-lg font-bold text-red-600 sm:text-2xl">
                          {ausentes}
                        </p>
                      </div>
                      <XCircle className="h-6 w-6 flex-shrink-0 text-red-600 sm:h-8 sm:w-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-gray-600 sm:text-sm">
                          Não Marcados
                        </p>
                        <p className="text-lg font-bold text-gray-500 sm:text-2xl">
                          {naoMarcados}
                        </p>
                      </div>
                      <MinusCircle className="h-6 w-6 flex-shrink-0 text-gray-500 sm:h-8 sm:w-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-2 sm:col-span-1">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-gray-600 sm:text-sm">
                          % Presença
                        </p>
                        <p className="text-primary-green text-lg font-bold sm:text-2xl">
                          {percentualPresenca}%
                        </p>
                      </div>
                      <Clock className="text-primary-green h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Alunos */}
              <Card className="mx-2 sm:mx-0">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <Users className="text-primary-green mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Lista de Presença ({filteredAlunos.length} alunos)
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={marcarTodosPresentes}
                        className="border-green-500 bg-transparent text-xs text-green-600 hover:bg-green-50 sm:text-sm"
                      >
                        <CheckCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">
                          Todos Presentes
                        </span>
                        <span className="sm:hidden">Presentes</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={marcarTodosAusentes}
                        className="border-red-500 bg-transparent text-xs text-red-600 hover:bg-red-50 sm:text-sm"
                      >
                        <XCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Todos Ausentes</span>
                        <span className="sm:hidden">Ausentes</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={limparFrequencia}
                        className="border-gray-500 bg-transparent text-xs text-gray-600 hover:bg-gray-50 sm:text-sm"
                      >
                        <MinusCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        Limpar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredAlunos.map((aluno) => (
                      <div
                        key={aluno.id}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-3 transition-colors sm:p-4 ${
                          aluno.presente === true
                            ? "border-green-200 bg-green-50"
                            : aluno.presente === false
                            ? "border-red-200 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                        onClick={() => togglePresenca(aluno.id)}
                      >
                        <div className="flex min-w-0 flex-1 items-center space-x-3 sm:space-x-4">
                          <div
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 sm:h-6 sm:w-6 ${
                              aluno.presente === true
                                ? "border-green-600 bg-green-600"
                                : aluno.presente === false
                                ? "border-red-600 bg-red-600"
                                : "border-gray-300 bg-gray-200"
                            }`}
                          >
                            {aluno.presente === true && (
                              <CheckCircle className="text-white h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            {aluno.presente === false && (
                              <XCircle className="text-white h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            {aluno.presente === null && (
                              <MinusCircle className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 sm:text-base">
                              {aluno.nomeAluno}
                            </p>
                            <div className="mt-1 flex flex-col text-xs text-gray-600 sm:flex-row sm:items-center sm:space-x-4 sm:text-sm">
                              <span className="truncate">
                                {aluno.matricula}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate">{aluno.curso}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <Badge
                            variant={
                              aluno.presente === true
                                ? "default"
                                : aluno.presente === false
                                ? "destructive"
                                : "secondary"
                            }
                            className={`text-xs ${
                              aluno.presente === true
                                ? "bg-green-600 text-gray-100 hover:text-black"
                                : aluno.presente === false
                                ? ""
                                : "bg-gray-500 text-gray-100 hover:text-black"
                            }`}
                          >
                            {aluno.presente === true
                              ? "Presente"
                              : aluno.presente === false
                              ? "Ausente"
                              : "Não marcado"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredAlunos.length === 0 && !loadingAlunos && (
                    <div className="py-8 text-center text-gray-500">
                      <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>Nenhum aluno encontrado</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={salvarFrequencia}
                      className="bg-primary-green hover:bg-primary-green/90 px-6 text-sm text-white-default sm:px-8"
                      disabled={alunos.length === 0}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Frequência
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </Spin>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies["sig-token"];

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return getProfessorIdFromServerSideProps(context);
};
