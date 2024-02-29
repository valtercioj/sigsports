/* eslint-disable no-plusplus */
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

export type TurmaType = {
  id: number;
  nomeTurma: "string";
  modalidade: number;
  categoria: number;
  vagas: number;
  professor: string;
  genero: "string";
  dias: "string";
  horarioInicial: "string";
  horarioFinal: "string";
  turno: "string";
};

export type AlunosType = {
  id: number;
  nomeAluno: string;
  matricula: string;
  contato: string;
  curso: string;
};

function formatarDiasSemana(diasSemana: string) {
  const diasArray = diasSemana.split(",");

  if (diasArray.length === 1) {
    return diasArray[0];
  }
  if (diasArray.length === 2) {
    return diasArray.map((dia) => dia.replace("-feira", "")).join(" e ");
  }
  const ultimoDia = diasArray.pop();
  const diasFormatados = diasArray
    .map((dia) => dia.replace("-feira", ""))
    .join(", ");
  return `${diasFormatados} e ${ultimoDia?.replace("-feira", "")}`;
}

export function heightsTable(alunos: AlunosType[]) {
  const heightsList: Array<number> = [];
  if (alunos) {
    for (let i = 0; i < alunos.length; i++) {
      heightsList.push(15);
    }
  }
  return heightsList;
}

export function tableAlunos(alunos: AlunosType[]) {
  const table = [
    [
      {
        text: "Nome",
        alignment: "center",
        fontSize: 12,
        fillColor: "#F0F3F6",
      },
      {
        text: "Curso",
        alignment: "center",
        fontSize: 12,
        fillColor: "#F0F3F6",
      },
      {
        text: "Matricula",
        alignment: "center",
        fontSize: 12,
        fillColor: "#F0F3F6",
      },
    ],
  ];
  if (alunos) {
    alunos.forEach((aluno) => {
      table.push([
        {
          text: aluno.nomeAluno,
          alignment: "center",
          fontSize: 10,
          fillColor: "",
        },
        {
          text: aluno.curso,
          alignment: "center",
          fontSize: 10,
          fillColor: "",
        },
        {
          text: aluno.matricula,
          alignment: "center",
          fontSize: 10,
          fillColor: "",
        },
      ]);
    });
  }
  return table;
}

export function pdfTurma(turma: TurmaType, alunos: AlunosType[]) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const details = [
    {
      table: {
        widths: [505],
        body: [
          [
            {
              svg: `
              <svg width="73" height="33" viewBox="0 0 321 83" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3918 82.1279C12.3761 82.1279 7.82674 80.436 4.74369 77.0522C1.66064 73.5932 0.119113 68.6678 0.119113 62.2761V57.7643H11.8497V63.1785C11.8497 68.2918 13.9928 70.8485 18.279 70.8485C20.3845 70.8485 21.9636 70.2469 23.0164 69.0438C24.1443 67.7654 24.7083 65.7351 24.7083 62.9529C24.7083 59.6442 23.9563 56.7492 22.4524 54.2677C20.9485 51.711 18.1662 48.6656 14.1056 45.1314C8.99228 40.6196 5.42045 36.559 3.39015 32.9495C1.35985 29.2649 0.344702 25.1291 0.344702 20.5422C0.344702 14.3009 1.92382 9.4883 5.08207 6.10446C8.24032 2.64543 12.8273 0.915915 18.843 0.915915C24.7835 0.915915 29.2577 2.64543 32.2655 6.10446C35.3486 9.4883 36.8901 14.3761 36.8901 20.7677V24.0388H25.1595V19.9782C25.1595 17.2711 24.6331 15.316 23.5804 14.1129C22.5276 12.8345 20.9861 12.1954 18.9558 12.1954C14.82 12.1954 12.7521 14.7144 12.7521 19.7526C12.7521 22.6101 13.5041 25.2795 15.008 27.761C16.5871 30.2425 19.407 33.2503 23.4676 36.7846C28.6561 41.2963 32.2279 45.3945 34.183 49.0792C36.1382 52.7638 37.1157 57.0876 37.1157 62.0505C37.1157 68.5174 35.499 73.4804 32.2655 76.9394C29.1073 80.3984 24.4827 82.1279 18.3918 82.1279ZM44.2297 2.04386H56.6371V81H44.2297V2.04386ZM83.5253 82.1279C77.5096 82.1279 72.9227 80.436 69.7644 77.0522C66.6062 73.5932 65.027 68.6678 65.027 62.2761V20.7677C65.027 14.3761 66.6062 9.4883 69.7644 6.10446C72.9227 2.64543 77.5096 0.915915 83.5253 0.915915C89.541 0.915915 94.128 2.64543 97.2863 6.10446C100.445 9.4883 102.024 14.3761 102.024 20.7677V27.5354H90.293V19.9782C90.293 14.7896 88.1499 12.1954 83.8637 12.1954C79.5775 12.1954 77.4344 14.7896 77.4344 19.9782V63.1785C77.4344 68.2918 79.5775 70.8485 83.8637 70.8485C88.1499 70.8485 90.293 68.2918 90.293 63.1785V47.7256H84.0893V36.4462H102.024V62.2761C102.024 68.6678 100.445 73.5932 97.2863 77.0522C94.128 80.436 89.541 82.1279 83.5253 82.1279Z" fill="#2D3A3A"/>
              <path d="M126.119 82.1279C120.104 82.1279 115.554 80.436 112.471 77.0522C109.388 73.5932 107.847 68.6678 107.847 62.2761V57.7643H119.577V63.1785C119.577 68.2918 121.72 70.8485 126.007 70.8485C128.112 70.8485 129.691 70.2469 130.744 69.0438C131.872 67.7654 132.436 65.7351 132.436 62.9529C132.436 59.6442 131.684 56.7492 130.18 54.2677C128.676 51.711 125.894 48.6656 121.833 45.1314C116.72 40.6196 113.148 36.559 111.118 32.9495C109.087 29.2649 108.072 25.1291 108.072 20.5422C108.072 14.3009 109.651 9.4883 112.81 6.10446C115.968 2.64543 120.555 0.915915 126.571 0.915915C132.511 0.915915 136.985 2.64543 139.993 6.10446C143.076 9.4883 144.618 14.3761 144.618 20.7677V24.0388H132.887V19.9782C132.887 17.2711 132.361 15.316 131.308 14.1129C130.255 12.8345 128.714 12.1954 126.683 12.1954C122.548 12.1954 120.48 14.7144 120.48 19.7526C120.48 22.6101 121.232 25.2795 122.736 27.761C124.315 30.2425 127.135 33.2503 131.195 36.7846C136.384 41.2963 139.955 45.3945 141.911 49.0792C143.866 52.7638 144.843 57.0876 144.843 62.0505C144.843 68.5174 143.227 73.4804 139.993 76.9394C136.835 80.3984 132.21 82.1279 126.119 82.1279ZM151.957 2.04386H170.23C176.396 2.04386 181.021 3.69818 184.104 7.00682C187.187 10.3155 188.728 15.1656 188.728 21.5573V29.3401C188.728 35.7318 187.187 40.582 184.104 43.8906C181.021 47.1993 176.396 48.8536 170.23 48.8536H164.365V81H151.957V2.04386ZM170.23 37.5741C172.26 37.5741 173.764 37.0102 174.742 35.8822C175.794 34.7543 176.321 32.8368 176.321 30.1297V20.7677C176.321 18.0607 175.794 16.1432 174.742 15.0152C173.764 13.8873 172.26 13.3233 170.23 13.3233H164.365V37.5741H170.23ZM213.401 82.1279C207.31 82.1279 202.648 80.3984 199.415 76.9394C196.181 73.4804 194.564 68.5926 194.564 62.2761V20.7677C194.564 14.4513 196.181 9.56349 199.415 6.10446C202.648 2.64543 207.31 0.915915 213.401 0.915915C219.492 0.915915 224.154 2.64543 227.388 6.10446C230.621 9.56349 232.238 14.4513 232.238 20.7677V62.2761C232.238 68.5926 230.621 73.4804 227.388 76.9394C224.154 80.3984 219.492 82.1279 213.401 82.1279ZM213.401 70.8485C217.687 70.8485 219.83 68.2542 219.83 63.0657V19.9782C219.83 14.7896 217.687 12.1954 213.401 12.1954C209.115 12.1954 206.972 14.7896 206.972 19.9782V63.0657C206.972 68.2542 209.115 70.8485 213.401 70.8485ZM240.629 2.04386H259.014C265.406 2.04386 270.068 3.54779 273.001 6.55564C275.933 9.4883 277.4 14.0377 277.4 20.2038V25.0539C277.4 33.2503 274.693 38.4389 269.278 40.6196V40.8452C272.286 41.7475 274.392 43.5898 275.595 46.3721C276.873 49.1544 277.512 52.8766 277.512 57.5387V71.4125C277.512 73.6684 277.588 75.5107 277.738 76.9394C277.888 78.2929 278.264 79.6465 278.866 81H266.233C265.782 79.7217 265.481 78.5185 265.331 77.3906C265.18 76.2626 265.105 74.2323 265.105 71.2997V56.862C265.105 53.2526 264.503 50.7335 263.3 49.3047C262.172 47.876 260.18 47.1617 257.322 47.1617H253.036V81H240.629V2.04386ZM257.548 35.8822C260.029 35.8822 261.872 35.243 263.075 33.9647C264.353 32.6864 264.992 30.5433 264.992 27.5354V21.4445C264.992 18.5871 264.466 16.5192 263.413 15.2408C262.436 13.9625 260.856 13.3233 258.676 13.3233H253.036V35.8822H257.548ZM295.601 13.3233H282.63V2.04386H320.98V13.3233H308.008V81H295.601V13.3233Z" fill="#16DB65"/>
              </svg>
              `,
              border: [false, false, false, true],
              borderColor: ["#000000", "#000000", "#000000", "#058C42"],
              margin: [210, 0, 0, 17],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 3,
        vLineWidth: () => 3,
      },
      margin: [24, 0, 0, 5],
    },
    {
      table: {
        headerRows: 1,
        widths: ["*"],
        body: [
          [
            {
              text: `Turma: ${turma.nomeTurma}

              Professor: ${turma.professor}
              
              Vagas Totais: ${turma.vagas}    
              
              Quantidade de alunos: ${alunos.length}
              
              Dias: ${formatarDiasSemana(turma.dias)}

              Horário: ${turma.horarioInicial} - ${turma.horarioFinal}
              `,
              fillColor: "#F7F9FB",
              margin: [0, 14],
              fontSize: 12,
              border: [false, false, false, false],
            },
          ],
        ],
      },
      bold: true,
      margin: [24, 6, 25, 3],
    },

    {
      table: {
        headerRows: 1,
        widths: ["*"],
        body: [
          [
            {
              text: "Alunos Matriculados",
              fillColor: "#16DB65",
              margin: [0, 14],
              fontSize: 12,
              color: "#FCFFFC",
              border: [false, false, false, false],
            },
          ],
        ],
      },
      margin: [24, 9, 25, 5],
    },
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*"],
        heights: heightsTable(alunos),
        fillColor: "#F0F3F6",
        body: tableAlunos(alunos),
      },
      layout: {
        hLineColor() {
          return "#B3BFCC";
        },
        vLineColor() {
          return "#B3BFCC";
        },
      },
      margin: [25, 5, 24, 13],
    },
  ];
  const docDefinitions: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [15, 20, 15, 40],
    content: [details as any],
  };
  pdfMake.createPdf(docDefinitions).download();
}
