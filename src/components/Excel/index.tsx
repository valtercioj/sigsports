/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/router";

interface TurmaData {
  nomeTurma: string;
  genero: string;
  dias: string;
  horarioInicial: string;
  horarioFinal: string;
  turno: string;
  espaco: string;
  modalidade?: number;
  categoria?: number;
  vagas?: number;
  professor?: number;
}
const montserrat = Montserrat({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});
const ImportFile: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [turmasCriadas, setTurmasCriadas] = useState<number>(0);

  const validateAndTransformData = (
    workbook: XLSX.WorkBook
  ): TurmaData[] | null => {
    try {
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const nonEmptyRows = jsonData.filter((row) =>
        row.some((value: string) => value !== "")
      );

      if (nonEmptyRows.length < 2) {
        toast.error(
          "O arquivo deve conter pelo menos duas linhas de dados para criar turmas."
        );
        return null;
      }

      const requiredColumns = [
        "nomeTurma",
        "genero",
        "dias",
        "horarioInicial",
        "horarioFinal",
        "turno",
        "espaco",
      ];

      const columnMap: { [key: string]: string } = {};
      nonEmptyRows[0].forEach((col: string, index: number) => {
        columnMap[col] = String(index);
      });

      for (const column of requiredColumns) {
        if (!columnMap[column]) {
          toast.error(`Corrija os campos no arquivo.`);
          return null;
        }
      }

      const turmasData: any = nonEmptyRows.slice(1).map((row: any) => {
        const turmaData: any = {
          nomeTurma: row[columnMap.nomeTurma] || "",
          genero: row[columnMap.genero] || "",
          dias: row[columnMap.dias] || "",
          horarioInicial: row[columnMap.horarioInicial] || "",
          horarioFinal: row[columnMap.horarioFinal] || "",
          turno: row[columnMap.turno] || "",
          espaco: row[columnMap.espaco] || "",
        };

        if (
          columnMap.modalidade &&
          row[columnMap.modalidade] !== "" &&
          !Number.isNaN(row[columnMap.modalidade])
        ) {
          turmaData.modalidade = Number(row[columnMap.modalidade]);
        }

        if (
          columnMap.categoria &&
          row[columnMap.categoria] !== "" &&
          !Number.isNaN(row[columnMap.categoria])
        ) {
          turmaData.categoria = Number(row[columnMap.categoria]);
        }

        if (
          columnMap.vagas &&
          row[columnMap.vagas] !== "" &&
          !Number.isNaN(row[columnMap.vagas])
        ) {
          turmaData.vagas = Number(row[columnMap.vagas]);
        }

        if (
          columnMap.professor &&
          row[columnMap.professor] !== "" &&
          !Number.isNaN(row[columnMap.professor])
        ) {
          turmaData.professor = Number(row[columnMap.professor]);
        }

        const validProperties = Object.fromEntries(
          Object.entries(turmaData).filter(([_, value]) => value !== "")
        );

        return validProperties;
      });

      return turmasData;
    } catch (error) {
      console.error("Erro na validação dos dados:", error);
      toast.error("Erro na validação dos dados");
      return null;
    }
  };

  const createTurmas = async (turmasData: TurmaData[]) => {
    try {
      for (const turmaData of turmasData) {
        const data = JSON.stringify(turmaData);
        const response = await fetch(
          `http://40.76.188.129:8008/api/aluno/turma`,
          {
            method: "POST",
            body: data as any,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
          }
        );

        if (response.status !== 200 && response.status !== 201) {
          const errorMessage = await response.text();
          toast.error(`Erro ao criar turma: ${errorMessage}`);
          return; // Se houver um erro, não continua criando turmas
        }

        setTurmasCriadas((prevCount) => prevCount + 1);
      }

      // Se todas as turmas foram criadas com sucesso, mostra a notificação
      if (turmasData.length === 1) {
        toast.success(`${turmasData.length} turma foi criada com sucesso!`);
      } else {
        toast.success(`${turmasData.length} turmas foram criadas com sucesso!`);
      }
      setTimeout(() => {
        router.reload();
      }, 5000);
      return;
    } catch (error) {
      console.error("Erro ao criar turmas:", error);
      toast.error("Erro ao criar turmas");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTurmasCriadas(0);

    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const turmasData = validateAndTransformData(workbook);

          if (turmasData) {
            console.log("Dados das Turmas:", turmasData);
            createTurmas(turmasData);
          } else {
            console.error("Erro na validação dos dados");
            setFile(null);
          }
        }
      };
      reader.readAsBinaryString(selectedFile);
    } else {
      setFile(null);
    }
  };

  useEffect(() => {
    // Limpar o arquivo quando as turmas são criadas
    if (turmasCriadas > 0) {
      setFile(null);
    }
  }, [turmasCriadas]);

  return (
    <>
      <label
        htmlFor="fileInput"
        className={`${montserrat.className} cursor-pointer text-base font-medium`}
      >
        {" "}
        Escolher arquivo para Importar Turma por CSV
      </label>
      <input
        type="file"
        id="fileInput"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden w-full text-transparent" // Esconda o input real
      />
    </>
  );
};

export default ImportFile;
