/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Quicksand } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
// eslint-disable-next-line import/newline-after-import
import { useRouter } from "next/router";
import { declaracao } from "@/utils/declaracaoAluno";

const quicksand = Quicksand({
  weight: "500",
  style: "normal",
  subsets: ["latin"],
});

export default function Index({
  id,
  nomeAluno,
  curso,
  matricula,
  nomeTurma,
  turno,
}: {
  id: number;
  nomeAluno: string;
  matricula: string;
  curso: string;
  nomeTurma: string;
  turno: string;
}) {
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleDelete = async () => {
    setShowModal(false);
    const response = await fetch(
      `http://40.76.188.129:8008/api/aluno/matriculas/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 204) {
      await new Promise((resolve) => {
        toast.success("Aluno excluído com sucesso", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onOpen: resolve,
        });
      });
      setTimeout(() => {
        // Executar ação após 20 segundos
        // Por exemplo, redirecionar para uma página específica
        router.reload();
      }, 3000); // 3 segundos
    } else {
      await new Promise((resolve, reject) => {
        toast.error("Ocorreu um erro ao excluir o aluno", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onOpen: reject,
        });
      });
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="mb-8 flex h-full w-full items-center justify-between gap-x-4  rounded-md text-green-bg shadow-md hover:cursor-pointer hover:border-2 hover:border-green-200 md:h-16 xl:w-[80%] 2xl:w-9/12">
      <div className="flex h-full w-[33.3%] flex-wrap items-center gap-x-4 p-3">
        <Image src="/people.svg" alt="people" width={16} height={16} />
        <span
          className={`${quicksand.className} font-Montserrat text-lg font-medium`}
        >
          {nomeAluno}
        </span>
      </div>
      <div className="flex h-full w-[33.3%] flex-col gap-x-4 md:flex-row md:items-center">
        <Image src="/school.svg" alt="course" width={24} height={24} />
        <span className={`${quicksand.className}  text-lg font-medium`}>
          {curso}
        </span>
      </div>
      <div className="flex h-full w-[33.3%] flex-wrap items-center gap-x-4">
        <Image src="/card.svg" alt="card" width={24} height={24} />
        <span className={`${quicksand.className}  text-lg font-medium`}>
          {matricula}
        </span>
      </div>
      <span className="relative mr-4 flex items-center hover:cursor-pointer">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer text-white-default"
          onClick={toggleDropdown}
        >
          <path
            d="M14.25 12C14.25 10.7574 13.2426 9.75 12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25C13.2426 14.25 14.25 13.2426 14.25 12Z"
            fill="black"
          />
          <path
            d="M14.25 4.5C14.25 3.25736 13.2426 2.25 12 2.25C10.7574 2.25 9.75 3.25736 9.75 4.5C9.75 5.74264 10.7574 6.75 12 6.75C13.2426 6.75 14.25 5.74264 14.25 4.5Z"
            fill="black"
          />
          <path
            d="M14.25 19.5C14.25 18.2574 13.2426 17.25 12 17.25C10.7574 17.25 9.75 18.2574 9.75 19.5C9.75 20.7426 10.7574 21.75 12 21.75C13.2426 21.75 14.25 20.7426 14.25 19.5Z"
            fill="black"
          />
        </svg>
        {isDropdownOpen && (
          <div className="absolute right-4  top-12 w-[10rem]  rounded-md bg-green-200 px-4 py-2 shadow-md xl:left-0">
            <div className="flex items-center justify-center rounded  text-white-default hover:bg-green-300">
              <Link href={`/editarAluno/${id}`}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.4217 2.75 18.8923 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.655 21.1083 7.11733 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                    fill="white"
                  />
                </svg>
              </Link>
              <Link
                href={`/editarAluno/${id}`}
                className="block px-4 py-2 font-Montserrat text-sm font-medium"
              >
                Editar
              </Link>
            </div>
            <div className="flex items-center justify-center  rounded text-white-default hover:bg-green-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                onClick={() => setShowModal(true)}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 21C6.45 21 5.979 20.804 5.587 20.412C5.195 20.02 4.99933 19.5493 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.804 20.021 18.412 20.413C18.02 20.805 17.5493 21.0007 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                  fill="white"
                />
              </svg>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="block px-4 py-2 font-Montserrat text-sm font-medium"
              >
                Excluir
              </button>
            </div>
            <div className="flex w-full items-center  justify-center rounded text-white-default hover:bg-green-300">
              <span
                className="ml-8 h-6 w-6"
                onClick={() =>
                  declaracao(nomeAluno, matricula, nomeTurma, turno)
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.0625 10.5H13.5C12.9033 10.5 12.331 10.2629 11.909 9.84099C11.4871 9.41903 11.25 8.84674 11.25 8.25V1.6875C11.25 1.63777 11.2302 1.59008 11.1951 1.55492C11.1599 1.51975 11.1122 1.5 11.0625 1.5H6.75C5.95435 1.5 5.19129 1.81607 4.62868 2.37868C4.06607 2.94129 3.75 3.70435 3.75 4.5V19.5C3.75 20.2956 4.06607 21.0587 4.62868 21.6213C5.19129 22.1839 5.95435 22.5 6.75 22.5H17.25C18.0456 22.5 18.8087 22.1839 19.3713 21.6213C19.9339 21.0587 20.25 20.2956 20.25 19.5V10.6875C20.25 10.6378 20.2302 10.5901 20.1951 10.5549C20.1599 10.5198 20.1122 10.5 20.0625 10.5Z"
                    fill="white"
                  />
                  <path
                    d="M19.6509 8.84062L12.9098 2.09953C12.8967 2.0865 12.8801 2.07763 12.8619 2.07405C12.8438 2.07046 12.825 2.07232 12.8079 2.07938C12.7908 2.08644 12.7762 2.0984 12.7659 2.11374C12.7556 2.12909 12.7501 2.14714 12.75 2.16562V8.25047C12.75 8.44938 12.829 8.64014 12.9697 8.7808C13.1103 8.92145 13.3011 9.00047 13.5 9.00047H19.5848C19.6033 9.00039 19.6214 8.99485 19.6367 8.98454C19.6521 8.97423 19.664 8.95962 19.6711 8.94254C19.6781 8.92546 19.68 8.90667 19.6764 8.88853C19.6728 8.8704 19.664 8.85373 19.6509 8.84062Z"
                    fill="white"
                  />
                </svg>
              </span>

              <button
                type="button"
                onClick={() =>
                  declaracao(nomeAluno, matricula, nomeTurma, turno)
                }
                className="block w-full px-4 py-2 font-Montserrat text-sm font-medium "
              >
                Declaração
              </button>
            </div>
          </div>
        )}
      </span>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden  outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-[46.875rem] max-w-3xl bg-bgGray text-white-default">
              {/* content */}
              <div className="bg-white relative flex w-full flex-col rounded-lg border-0 shadow-lg outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between rounded-t p-5">
                  <h3 className="flex w-full justify-center font-Montserrat text-3xl text-[27px] font-bold leading-normal">
                    DESEJA EXCLUIR O ALUNO?
                  </h3>

                  <span
                    className="text-white-default"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                    >
                      <path
                        d="M23.7856 21.0005L31.5786 13.2075C31.9484 12.8383 32.1565 12.3373 32.1569 11.8147C32.1574 11.2921 31.9502 10.7908 31.581 10.4209C31.2118 10.0511 30.7108 9.84302 30.1882 9.84256C29.6657 9.8421 29.1643 10.0493 28.7944 10.4185L21.0015 18.2114L13.2085 10.4185C12.8386 10.0486 12.337 9.84082 11.814 9.84082C11.2909 9.84082 10.7893 10.0486 10.4194 10.4185C10.0496 10.7883 9.8418 11.2899 9.8418 11.813C9.8418 12.336 10.0496 12.8377 10.4194 13.2075L18.2124 21.0005L10.4194 28.7935C10.0496 29.1633 9.8418 29.6649 9.8418 30.188C9.8418 30.711 10.0496 31.2127 10.4194 31.5825C10.7893 31.9524 11.2909 32.1601 11.814 32.1601C12.337 32.1601 12.8386 31.9524 13.2085 31.5825L21.0015 23.7895L28.7944 31.5825C29.1643 31.9524 29.6659 32.1601 30.189 32.1601C30.712 32.1601 31.2136 31.9524 31.5835 31.5825C31.9533 31.2127 32.1611 30.711 32.1611 30.188C32.1611 29.6649 31.9533 29.1633 31.5835 28.7935L23.7856 21.0005Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
                {/* body */}
                <div className="relative w-full flex-auto p-6">
                  <p className="flex w-[37.813rem] justify-center text-center font-['Raleway'] text-2xl font-semibold leading-9">
                    Esta ação é permanente, não será possível recuperar o aluno
                    posteriormente!
                  </p>
                </div>
                {/* footer */}
                <div className="flex items-center justify-center rounded-b  p-6">
                  <button
                    className="mr-4 h-12 w-[138.543px] rounded-md border border-green-200 font-Montserrat text-[14.87px] text-sm font-bold not-italic	text-white-default"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    CANCELAR
                  </button>
                  <button
                    className="mr-4 h-12 w-[138.543px] rounded-md  bg-[#FF6636] font-Montserrat text-[14.87px] text-sm font-bold	not-italic text-white-default"
                    type="button"
                    onClick={handleDelete}
                  >
                    EXCLUIR
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25" />
        </>
      ) : null}
    </div>
  );
}
