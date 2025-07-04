/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Raleway, Quicksand } from "next/font/google";
import { useState } from "react";
import { Modal } from "antd";

const raleway = Raleway({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});
export default function CardModalidade({
  title,
  number,
  id,
  turmas,
  description,
}: {
  title: string;
  number: number;
  id: number;
  turmas: any[];
  description: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const handleOk = () => {
    setModalVisible(!modalVisible);
  };

  const turma = turmas.find((turmaM) => turmaM.id === id);

  const customTitle = (
    <div
      className={`${quicksand.className} mr-auto text-3xl font-semibold leading-[37.57px] text-green-200`}
    >
      {turma?.nomeTurma} - {turma.genero}
    </div>
  );
  return (
    <div
      className="relative mx-auto inline-block h-40 w-80 cursor-pointer"
      onClick={() => setModalVisible(!modalVisible)}
    >
      <span className="absolute left-4 top-2">
        <svg
          width="290"
          height="121"
          viewBox="0 0 290 121"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M256.733 120.992H0.000518799V19.7682L29.7473 0.0857849H289.969V98.6508L256.733 120.992Z"
            fill="#16DB65"
          />
          {/* Adicione o número e a palavra aqui */}
          <text x="20" y="60" fill="white" fontSize="24" fontWeight="bold">
            {number}
          </text>
          <text x="70" y="60" fill="white" fontSize="24" fontWeight="bold">
            {`${title}`}
          </text>
        </svg>
      </span>
      <span className="absolute">
        <svg
          width="290"
          height="121"
          viewBox="0 0 290 121"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M256.733 120.906H0.000518799V19.6823L29.7473 -0.000152588H289.969V98.5648L256.733 120.906Z"
            fill="#2D3A3A"
          />
          {/* Adicione o número e a palavra aqui */}
          <text
            x="10"
            y="80"
            stroke="#16DB65"
            fontSize="76"
            fontWeight="bold"
            fontFamily="Raleway"
            className={`${raleway.className}`}
          >
            {number}
          </text>
          <text x="90" y="70" fill="#E1E1E1" fontSize="24" fontWeight="bold">
            {title}
          </text>
        </svg>
      </span>

      <Modal
        title={customTitle}
        open={modalVisible}
        onOk={handleOk}
        footer={null}
      >
        <p
          className={`${quicksand.className} mb-6 w-full text-base font-medium text-green-bg`}
        >
          Horário: {turma?.horarioInicial} - {turma?.horarioFinal}
        </p>
        <p
          className={`${quicksand.className} mb-6 w-full text-base font-medium text-green-bg`}
        >
          Dias: {turma?.dias.replace(" ,", ", ")}
        </p>
        <p
          className={`${quicksand.className} mb-6 w-full text-base font-medium text-green-bg`}
        >
          Vagas Disponíveis:{" "}
          {turma.vagasRestantes <= 0 ? "Não há vagas" : turma.vagasRestantes}
        </p>
        <p
          className={`${quicksand.className} mb-6 w-full text-base font-medium text-green-bg`}
        >
          Descrição: {description}
        </p>
        {/* Adicione mais informações conforme necessário */}
      </Modal>
    </div>
  );
}
