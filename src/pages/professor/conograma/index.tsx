"use client";

import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Spin, notification, Select } from "antd";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/LayoutProfessor";

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

interface AulaProcessada {
  id: number;
  turma: string;
  modalidade: string;
  horario: string;
  local: string;
  vagas: number;
  cor: string;
  turmaId: string;
  genero: string;
  turno: string;
}

export default function Cronograma({ professorId }: { professorId: number }) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedTurma, setSelectedTurma] = useState("all");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      setLoading(true);
      const response = await api.get<Turma[]>(
        `v1/listarTurmasId/${professorId}/`
      );

      if (!response.statusText || response.status !== 200) {
        notification.error({
          message: "Erro ao carregar turmas",
          description: "Não foi possível carregar as turmas. Tente novamente.",
        });
        throw new Error("Erro ao carregar turmas");
      }

      const data = await response.data;
      setTurmas(data);
    } catch (err) {
      notification.error({
        message: "Erro ao carregar turmas",
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const mapearDias = {
    "segunda-feira": "Segunda",
    "terça-feira": "Terça",
    "quarta-feira": "Quarta",
    "quinta-feira": "Quinta",
    "sexta-feira": "Sexta",
    sábado: "Sábado",
  };

  const getCorPorGenero = (genero: string, modalidade: string) => {
    if (genero === "Feminino") return "bg-purple";
    if (genero === "Masculino") return "bg-dark-green";

    // Cores por modalidade como fallback
    switch (modalidade.toLowerCase()) {
      case "vôlei":
      case "volei":
        return "bg-primary-green";
      case "futebol":
        return "bg-primary-blue";
      case "basquete":
        return "bg-secondary-green";
      default:
        return "bg-gray-600";
    }
  };
  const processarCronograma = () => {
    const cronograma: { [key: string]: AulaProcessada[] } = {
      Segunda: [],
      Terça: [],
      Quarta: [],
      Quinta: [],
      Sexta: [],
      Sábado: [],
    };

    turmas.forEach((turma) => {
      const diasArray = turma.dias.split(",").map((dia) => dia.trim());

      diasArray.forEach((dia) => {
        const diaMapeado = mapearDias[dia as keyof typeof mapearDias];
        if (diaMapeado && cronograma[diaMapeado]) {
          const aula: AulaProcessada = {
            id: turma.id,
            turma: turma.nomeTurma,
            modalidade: turma.modalidade,
            horario: `${turma.horarioInicial} - ${turma.horarioFinal}`,
            local: turma.espaco || `${turma.modalidade} - ${turma.turno}`,
            vagas: turma.vagas,
            cor: getCorPorGenero(turma.genero, turma.modalidade),
            turmaId: turma.id.toString(),
            genero: turma.genero,
            turno: turma.turno,
          };
          cronograma[diaMapeado].push(aula);
        }
      });
    });

    // Ordenar aulas por horário
    Object.keys(cronograma).forEach((dia) => {
      cronograma[dia].sort((a, b) => {
        const horaA = a.horario.split(" - ")[0];
        const horaB = b.horario.split(" - ")[0];
        return horaA.localeCompare(horaB);
      });
    });

    return cronograma;
  };

  const cronograma = processarCronograma();

  const turmasOptions = [
    { id: "all", nome: "Todas as Turmas", cor: "bg-gray-500" },
    ...turmas.map((turma) => ({
      id: turma.id.toString(),
      nome: turma.nomeTurma,
      cor: getCorPorGenero(turma.genero, turma.modalidade),
    })),
  ];
  const getFilteredAulas = (dia: string) => {
    const aulas = cronograma[dia] || [];
    if (selectedTurma === "all") return aulas;
    return aulas.filter((aula) => aula.turmaId === selectedTurma);
  };
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentWeek = new Date(today);
    currentWeek.setDate(
      today.getDate() - today.getDay() + 1 + selectedWeek * 7
    );

    return diasSemana.map((_, index) => {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + index);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    });
  };
  const weekDates = getCurrentWeekDates();

  return (
    <Layout
      title="Cronograma"
      description="Visualize o cronograma de aulas"
      rollback
    >
      <Spin size="large" spinning={loading}>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col justify-end gap-4 px-2 sm:flex-row sm:items-center sm:px-0">
            <Button
              onClick={fetchTurmas}
              variant="outline"
              className="text-primary-green hover:bg-primary-green border-green-300 bg-transparent text-sm hover:text-white-default"
            >
              Atualizar
            </Button>
          </div>

          {/* Controles */}
          <Card className="mx-2 border border-gray-200 shadow-sm sm:mx-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedWeek(selectedWeek - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 sm:text-base">
                      {selectedWeek === 0
                        ? "Esta Semana"
                        : selectedWeek > 0
                        ? `${selectedWeek} semana${
                            selectedWeek > 1 ? "s" : ""
                          } à frente`
                        : `${Math.abs(selectedWeek)} semana${
                            Math.abs(selectedWeek) > 1 ? "s" : ""
                          } atrás`}
                    </p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {weekDates[0]} - {weekDates[5]}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedWeek(selectedWeek + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                  <div className="flex w-full items-center space-x-2 sm:w-auto">
                    <Filter className="h-4 w-4 flex-shrink-0 text-gray-600" />
                    <Select
                      value={selectedTurma}
                      onChange={setSelectedTurma}
                      placeholder="Selecione uma turma"
                      className="border-2 border-green-400"
                      variant="borderless"
                      style={{ width: "100%", maxWidth: "12rem" }} // w-full sm:w-48 (12rem = 192px)
                    >
                      {turmasOptions.map((turma) => (
                        <Option key={turma.id} value={turma.id}>
                          {turma.nome}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedWeek(0)}
                    className="text-primary-green hover:bg-primary-green w-full border-2 border-green-400 text-sm hover:text-white-default sm:w-auto"
                  >
                    Hoje
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grade do Cronograma */}
          <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-3 xl:grid-cols-6">
            {diasSemana.map((dia, index) => {
              const aulas = getFilteredAulas(dia);
              const isToday =
                selectedWeek === 0 && new Date().getDay() === index + 1;

              return (
                <Card
                  key={dia}
                  className={`${isToday ? "ring-primary-green ring-2" : ""}`}
                >
                  <CardHeader className="bg-green-200 pb-2 text-white-default sm:pb-3">
                    <CardTitle className="text-center">
                      <div
                        className={`text-base font-bold sm:text-lg ${
                          isToday ? "text-gray-300" : "text-white-default"
                        }`}
                      >
                        {dia}
                      </div>
                      <div className="text-xs font-normal text-white-default sm:text-sm">
                        {weekDates[index]}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {aulas.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 sm:py-8">
                          <Calendar className="mx-auto mb-2 h-6 w-6 opacity-50 sm:h-8 sm:w-8" />
                          <p className="text-xs sm:text-sm">Nenhuma aula</p>
                        </div>
                      ) : (
                        aulas.map((aula) => (
                          <div
                            key={`${aula.id}-${dia}`}
                            className="cursor-pointer rounded-lg border-l-4 bg-gray-50 p-2 transition-colors hover:bg-gray-100 sm:p-3"
                            style={{
                              borderLeftColor:
                                aula.cor === "bg-purple"
                                  ? "#7b1fa2"
                                  : aula.cor === "bg-dark-green"
                                  ? "#1b5e20"
                                  : aula.cor === "bg-primary-green"
                                  ? "#2d7d32"
                                  : aula.cor === "bg-primary-blue"
                                  ? "#26c6da"
                                  : "#424242",
                            }}
                          >
                            <div className="space-y-1 sm:space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="truncate pr-1 text-xs font-medium text-gray-900 sm:text-sm">
                                  {aula.turma}
                                </h4>
                                <Badge
                                  className="flex-shrink-0 text-xs"
                                  style={{
                                    backgroundColor:
                                      aula.cor === "bg-purple"
                                        ? "#7b1fa2"
                                        : aula.cor === "bg-dark-green"
                                        ? "#1b5e20"
                                        : aula.cor === "bg-primary-green"
                                        ? "#2d7d32"
                                        : aula.cor === "bg-primary-blue"
                                        ? "#26c6da"
                                        : "#424242",
                                    color: "white",
                                  }}
                                >
                                  {aula.vagas}
                                </Badge>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center text-xs text-gray-600">
                                  <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {aula.horario}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                  <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{aula.local}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                  <Users className="mr-1 h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {aula.vagas} vagas • {aula.genero}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor:
                                      aula.cor === "bg-purple"
                                        ? "#7b1fa2"
                                        : aula.cor === "bg-dark-green"
                                        ? "#1b5e20"
                                        : aula.cor === "bg-primary-green"
                                        ? "#2d7d32"
                                        : aula.cor === "bg-primary-blue"
                                        ? "#26c6da"
                                        : "#424242",
                                    color:
                                      aula.cor === "bg-purple"
                                        ? "#7b1fa2"
                                        : aula.cor === "bg-dark-green"
                                        ? "#1b5e20"
                                        : aula.cor === "bg-primary-green"
                                        ? "#2d7d32"
                                        : aula.cor === "bg-primary-blue"
                                        ? "#26c6da"
                                        : "#424242",
                                  }}
                                >
                                  {aula.modalidade}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Resumo da Semana */}
          <Card className="mx-2 sm:mx-0">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Calendar className="text-primary-green mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Resumo da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-3 text-center sm:p-4">
                  <p className="text-primary-green text-lg font-bold sm:text-2xl">
                    {
                      Object.values(cronograma)
                        .flat()
                        .filter(
                          (aula) =>
                            selectedTurma === "all" ||
                            aula.turmaId === selectedTurma
                        ).length
                    }
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Total de Aulas
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center sm:p-4">
                  <p className="text-primary-blue text-lg font-bold sm:text-2xl">
                    {Object.values(cronograma)
                      .flat()
                      .filter(
                        (aula) =>
                          selectedTurma === "all" ||
                          aula.turmaId === selectedTurma
                      )
                      .reduce((total, aula) => total + aula.vagas, 0)}
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Total de Vagas
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center sm:p-4">
                  <p className="text-purple text-lg font-bold sm:text-2xl">
                    {selectedTurma === "all" ? turmas.length : 1}
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Turmas Ativas
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center sm:p-4">
                  <p className="text-secondary-green text-lg font-bold sm:text-2xl">
                    {Object.values(cronograma)
                      .flat()
                      .filter(
                        (aula) =>
                          selectedTurma === "all" ||
                          aula.turmaId === selectedTurma
                      )
                      .reduce((total, aula) => {
                        const [inicio, fim] = aula.horario.split(" - ");
                        const [horaInicio, minInicio] = inicio
                          .split(":")
                          .map(Number);
                        const [horaFim, minFim] = fim.split(":").map(Number);
                        const duracao =
                          horaFim * 60 + minFim - (horaInicio * 60 + minInicio);
                        return total + duracao;
                      }, 0) / 60}
                    h
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Horas Semanais
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Spin>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Forçando erro 500
  // throw new Error("Erro forçado para teste da página 500");

  // Código original (não será executado)

  const token = req.cookies["sig-token"];
  const { matricula } = req.cookies;
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const response = await api.get("v1/listarProfessores/");
  const professor = response.data.find((p: any) => p.matricula === matricula);
  const professorId = professor ? professor.id : null;
  return {
    props: {
      professorId,
    },
  };
};
