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
} from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/Layout";
import { api } from "@/services/api";

const diasSemana: { [key: string]: number } = {
  domingo: 0,
  "segunda-feira": 1,
  "terça-feira": 2,
  "quarta-feira": 3,
  "quinta-feira": 4,
  "sexta-feira": 5,
  sábado: 6,
};

export default function Calendar() {
  const [turmas, setTurmas] = useState<any[]>([]);
  useEffect(() => {
    api.get("v1/listarTurmas/").then((response) => {
      setTurmas(response.data);
    });
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
  const turmasFiltradas = turmas.filter((turma) => turma.professor === "João");
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

  return (
    <Layout title="Calendário" op={false}>
      <div className="flex h-full w-full flex-col items-center bg-white-default p-4 md:p-6">
        <div className="mb-4 flex w-full max-w-6xl justify-between px-2 md:px-0">
          <button
            type="button"
            onClick={prevMonth}
            className="text-white rounded bg-blue-500 px-3 py-2 md:px-4"
          >
            ◀
          </button>
          <h2 className="text-lg font-bold md:text-xl">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="text-white rounded bg-blue-500 px-3 py-2 md:px-4"
          >
            ▶
          </button>
        </div>
        <div className="grid w-full max-w-6xl grid-cols-7 gap-1 rounded border border-gray-500 p-2 text-xs shadow md:p-4 md:text-sm">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
            <div
              key={dia}
              className="border-b pb-1 text-center font-bold md:pb-2"
            >
              {dia}
            </div>
          ))}
          {days.map((day, index) => {
            const diaSemana = getDay(day);
            const eventos = eventosPorDia[diaSemana] || [];

            return (
              <div
                key={index}
                className="flex h-20 w-full flex-col items-center justify-start overflow-hidden rounded-lg border-2 border-gray-200 p-2 md:h-32 md:p-4"
              >
                <span className="text-xs font-bold md:text-sm">
                  {format(day, "d")}
                </span>
                {eventos.map((evento, i) => (
                  <span
                    key={i}
                    className="mt-1 text-center text-[10px] font-semibold text-blue-600 md:text-xs"
                  >
                    {evento}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
