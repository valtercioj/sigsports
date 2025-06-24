"use client";

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getDay,
  isSameMonth,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { parseCookies } from "nookies";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const diasSemana: { [key: string]: number } = {
  domingo: 0,
  "segunda-feira": 1,
  "terça-feira": 2,
  "quarta-feira": 3,
  "quinta-feira": 4,
  "sexta-feira": 5,
  sábado: 6,
};

// Paleta de cores disponíveis para as modalidades
const coresPaleta = [
  {
    bg: "bg-green-50",
    border: "border-l-green-500",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  {
    bg: "bg-blue-50",
    border: "border-l-blue-500",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  {
    bg: "bg-cyan-50",
    border: "border-l-cyan-500",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
  },
  {
    bg: "bg-orange-50",
    border: "border-l-orange-500",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  {
    bg: "bg-yellow-50",
    border: "border-l-yellow-500",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  {
    bg: "bg-red-50",
    border: "border-l-red-500",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  {
    bg: "bg-purple-50",
    border: "border-l-purple-500",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  {
    bg: "bg-pink-50",
    border: "border-l-pink-500",
    text: "text-pink-700",
    dot: "bg-pink-500",
  },
  {
    bg: "bg-indigo-50",
    border: "border-l-indigo-500",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  {
    bg: "bg-teal-50",
    border: "border-l-teal-500",
    text: "text-teal-700",
    dot: "bg-teal-500",
  },
];

const corDefault = {
  bg: "bg-slate-50",
  border: "border-l-slate-500",
  text: "text-slate-700",
  dot: "bg-slate-500",
};

export interface ProfessorProps {
  nome: string;
  matricula: string;
}
export default function Calendar() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const parsedCookies = parseCookies();
  const { matricula } = parsedCookies;
  const [professor, setProfessor] = useState<ProfessorProps>();
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [modalidadeCores, setModalidadeCores] = useState<{
    [key: string]: { bg: string; border: string; text: string; dot: string };
  }>({});

  const getTeacher = async () => {
    try {
      const response = await api.get("v1/listarProfessores/");
      const professores = response.data;
      const professorEncontrado = professores.find(
        (prof: ProfessorProps) => prof.matricula === matricula
      );
      setProfessor(professorEncontrado);
      if (!professorEncontrado) {
        console.error("Professor não encontrado");
      }
    } catch (error) {
      console.error("Erro ao obter professor:", error);
    }
  };
  useEffect(() => {
    // Run only in the browser
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api.get("v1/listarTurmas/").then((response) => {
      setTurmas(response.data);

      // Gerar cores dinamicamente baseado nos dados da API
      const modalidadesUnicas = new Set<string>();

      response.data.forEach((turma: any) => {
        // Extrair modalidade do nome da turma
        const nomeTurma = turma.nomeTurma.toLowerCase();

        // Tentar identificar a modalidade por palavras-chave
        if (nomeTurma.includes("futebol")) modalidadesUnicas.add("futebol");
        else if (nomeTurma.includes("vôlei") || nomeTurma.includes("volei"))
          modalidadesUnicas.add("vôlei");
        else if (nomeTurma.includes("natação") || nomeTurma.includes("natacao"))
          modalidadesUnicas.add("natação");
        else if (nomeTurma.includes("basquete"))
          modalidadesUnicas.add("basquete");
        else if (nomeTurma.includes("tênis") || nomeTurma.includes("tenis"))
          modalidadesUnicas.add("tênis");
        else if (nomeTurma.includes("atletismo"))
          modalidadesUnicas.add("atletismo");
        else if (
          nomeTurma.includes("ginástica") ||
          nomeTurma.includes("ginastica")
        )
          modalidadesUnicas.add("ginástica");
        else if (nomeTurma.includes("judô") || nomeTurma.includes("judo"))
          modalidadesUnicas.add("judô");
        else if (nomeTurma.includes("karatê") || nomeTurma.includes("karate"))
          modalidadesUnicas.add("karatê");
        else if (nomeTurma.includes("dança") || nomeTurma.includes("danca"))
          modalidadesUnicas.add("dança");
        else {
          // Se não identificar, usar o nome da turma como modalidade
          modalidadesUnicas.add(turma.nomeTurma.toLowerCase());
        }
      });

      // Atribuir cores às modalidades
      const novasCores: { [key: string]: any } = {};
      const modalidadesArray = Array.from(modalidadesUnicas);

      modalidadesArray.forEach((modalidade, index) => {
        novasCores[modalidade] = coresPaleta[index % coresPaleta.length];
      });

      setModalidadeCores(novasCores);
    });
    getTeacher();
  }, []);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }
  const eventosPorDia: { [key: number]: string[] } = {};
  const turmasFiltradas = turmas.filter(
    (turma) => turma.professor === professor?.nome
  );
  turmasFiltradas.forEach((turma) => {
    const diasTurma = turma.dias
      .split(",")
      .map((d: string) => d.trim().toLowerCase());
    diasTurma.forEach((dia: string | number) => {
      const indice = diasSemana[dia];
      if (indice !== undefined) {
        if (!eventosPorDia[indice]) {
          eventosPorDia[indice] = [];
        }
        eventosPorDia[indice].push(`${turma.nomeTurma}`);
      }
    });
  });

  const getModalidadeStyle = (evento: string) => {
    const eventoLower = evento.toLowerCase();

    // Procurar pela modalidade correspondente
    for (const [modalidade, cores] of Object.entries(modalidadeCores)) {
      if (eventoLower.includes(modalidade) || modalidade === eventoLower) {
        return cores;
      }
    }

    return corDefault;
  };

  // Obter modalidades únicas para a legenda baseado nos dados atuais
  const modalidadesUnicas = Object.keys(modalidadeCores);

  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col items-center bg-background p-2 sm:p-4 lg:p-6">
        <div className="w-full max-w-7xl space-y-4 lg:space-y-6">
          {/* Header do Calendário */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                    <CalendarIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                      {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      Calendário de turmas - Professor Ana Maria
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Legenda */}
          {modalidadesUnicas.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Legenda das Modalidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
                  {modalidadesUnicas.map((modalidade) => {
                    const style = modalidadeCores[modalidade] || corDefault;
                    const displayName =
                      modalidade.charAt(0).toUpperCase() + modalidade.slice(1);

                    return (
                      <div key={modalidade} className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${style.dot}`}
                        />
                        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                          {displayName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calendário */}
          <Card>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {/* Cabeçalho dos dias da semana */}
              <div className="mb-3 grid grid-cols-7 gap-1 sm:mb-4 sm:gap-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (dia, index) => (
                    <div
                      key={dia}
                      className={`rounded-md p-2 text-center text-xs font-semibold sm:p-3 sm:text-sm ${
                        index === 0 || index === 6
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="hidden sm:inline">{dia}</span>
                      <span className="sm:hidden">{dia.charAt(0)}</span>
                    </div>
                  )
                )}
              </div>

              {/* Grid dos dias */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((day, index) => {
                  const diaSemana = getDay(day);
                  const eventos = eventosPorDia[diaSemana] || [];
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isCurrentDay = isToday(day);
                  const isWeekend = diaSemana === 0 || diaSemana === 6;

                  return (
                    <Card
                      key={index}
                      className={`min-h-[80px] transition-all duration-200 hover:shadow-md sm:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] ${
                        isCurrentDay
                          ? "border-primary bg-primary/5 shadow-md"
                          : !isCurrentMonth
                          ? "bg-muted/30 opacity-60"
                          : "hover:bg-muted/20"
                      }`}
                    >
                      <CardContent className="flex h-full flex-col p-2 sm:p-3">
                        {/* Número do dia */}
                        <div className="mb-1 flex items-start justify-between sm:mb-2">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 sm:text-sm lg:h-8 lg:w-8 ${
                              isCurrentDay
                                ? "bg-primary text-primary-foreground"
                                : isCurrentMonth
                                ? isWeekend
                                  ? "text-destructive"
                                  : "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {format(day, "d")}
                          </div>
                          {eventos.length > 0 && (
                            <div className="flex gap-1">
                              {eventos.slice(0, 3).map((evento, i) => {
                                const style = getModalidadeStyle(evento);
                                return (
                                  <div
                                    key={i}
                                    className={`h-2 w-2 rounded-full ${style.dot} animate-pulse`}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Eventos com Scroll */}
                        <div className="flex-1 overflow-hidden">
                          <div
                            className="scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 max-h-full space-y-1 overflow-y-auto pr-1"
                            style={{
                              maxHeight:
                                (windowWidth ?? 1024) < 640
                                  ? "48px"
                                  : (windowWidth ?? 1024) < 1024
                                  ? "60px"
                                  : "80px",
                            }}
                          >
                            {eventos.map((evento, i) => {
                              const style = getModalidadeStyle(evento);
                              return (
                                <div
                                  key={i}
                                  className={`${style.bg} ${style.border} flex-shrink-0 rounded-r-md border-l-4 px-2 py-1 transition-all duration-200 hover:shadow-sm`}
                                >
                                  <span
                                    className={`text-xs font-medium ${style.text} line-clamp-1`}
                                  >
                                    {evento}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
