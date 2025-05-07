/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { Drawer } from "antd";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaFacebookSquare,
} from "react-icons/fa";
import { GetServerSideProps } from "next";
import { Quicksand, Bebas_Neue, Raleway, Montserrat } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/services/api";
import CardModalidade from "../components/CardModalidade";
import Sugestao from "@/components/Forms/sugestao";

const quicksand = Quicksand({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const bebas_neue = Bebas_Neue({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const raleway = Raleway({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

type Turma = {
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
  vagas_restantes: number;
  descricaoModalidade: string;
};

export interface Modalidades {
  id: number;
  nomeModalidade: string;
  descricao: string;
}

type AlunoType = {
  turma_id: number;
  nome_turma: string;
  vagas_restantes: number;
};

export default function Home({
  turmas,
  alunosT,
  modalidades,
}: {
  // eslint-disable-next-line
  turmas: Turma[];
  alunosT: AlunoType[];
  modalidades: Modalidades[];
}) {
  const router = useRouter();
  const [path, setPath] = useState(router.asPath.replace("/#", ""));
  const [showMenu, setShowMenu] = useState(false);
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    setPath(router.asPath.replace("/#", ""));
  }, [router.asPath]);

  const turmasAlunosOrdenadas = alunosT.sort(
    (a, b) => a.vagas_restantes - b.vagas_restantes
  );

  // Separa os primeiros 6 e todos os turmas
  const primeirosSeis = turmasAlunosOrdenadas.slice(0, 6);
  const todos = turmasAlunosOrdenadas;

  // Função para buscar turmas equivalentes
  function buscarTurmasEquivalentes(
    alunosT: AlunoType[],
    turmas: Turma[],
    modalidades: Modalidades[]
  ) {
    return alunosT
      .map((turmaAluno) => {
        // Encontra a turma correspondente
        const turma = turmas.find((turma) => turma.id === turmaAluno.turma_id);
        if (turma) {
          // Encontra a modalidade correspondente
          const modalidade = modalidades.find(
            (mod) => mod.nomeModalidade === turma.modalidade
          );

          return {
            ...turma,
            vagasRestantes: turmaAluno.vagas_restantes,
            vagaDisponivel: turmaAluno.vagas_restantes > 0, // True se há vagas disponíveis
            descricaoModalidade: modalidade ? modalidade.descricao : "", // Inclui a descrição da modalidade
          };
        }
        return null; // Se a turma não for encontrada
      })
      .filter((turma) => turma !== null) as (Turma & {
      descricaoModalidade: string;
    })[]; // Remove possíveis nulls e garante que o tipo inclui a descrição da modalidade
  }

  // Busca as turmas equivalentes
  const equivalentesPrimeirosSeis = buscarTurmasEquivalentes(
    primeirosSeis,
    turmas,
    modalidades
  );
  const equivalentesTodos = buscarTurmasEquivalentes(
    todos,
    turmas,
    modalidades
  );
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const toggleButton = () => {
    setShowButton(!showButton);
  };
  const onClose = () => {
    setShowMenu(false);
  };
  function mudarGenero(genero: string) {
    if (genero === "Masculino") {
      return "Masc";
    }
    if (genero === "Feminino") {
      return "Fem";
    }
    return "Misto";
  }

  return (
    <div className="scrollable flex flex-col bg-white-default">
      <div
        className={`${quicksand.className} flex w-full bg-bgGray pb-10 md:pb-10  lg:h-screen lg:pb-0 `}
      >
        <div className="flex h-full w-screen flex-col lg:justify-between ">
          <div className="fixed z-50 flex w-screen bg-bgGray shadow-2xl">
            <nav className="z-50 w-full">
              <div className=" w-full px-4">
                <div className="flex w-full">
                  <div className="flex w-full justify-between">
                    <div>
                      <Link href="/" className="flex items-center px-2 py-4">
                        <Image
                          src="/mascote.svg"
                          alt="Logo"
                          className="mr-2 h-10 w-10 lg:h-8 lg:w-8"
                          width={32}
                          height={32}
                        />
                        <span
                          className={`${bebas_neue.className} flex items-center text-2xl text-white-default transition duration-300 hover:border-b-4 hover:border-green-500`}
                        >
                          SigSports
                        </span>
                      </Link>
                    </div>
                    <div
                      className={`${bebas_neue.className} dropShadow-100 hidden items-center gap-x-8 space-x-1 text-xl text-white-default md:flex lg:gap-x-14`}
                    >
                      <Link
                        href="/#modalidades"
                        prefetch={false}
                        className="flex items-center  transition duration-300 hover:border-b-4 hover:border-green-500"
                      >
                        MODALIDADES
                        <span className="ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99816 11.3125L13.5588 5.75184L12.4982 4.69118L7.99816 9.19118L3.49816 4.69118L2.4375 5.75184L7.99816 11.3125Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                      </Link>

                      <Link
                        href="/#equipe"
                        prefetch={false}
                        className="flex items-center  transition duration-300 hover:border-b-4 hover:border-green-500"
                      >
                        EQUIPES
                        <span className="ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99816 11.3125L13.5588 5.75184L12.4982 4.69118L7.99816 9.19118L3.49816 4.69118L2.4375 5.75184L7.99816 11.3125Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                      </Link>
                      <Link
                        href="/#sugerir"
                        prefetch={false}
                        className="flex items-center  transition duration-300 hover:border-b-4 hover:border-green-500"
                      >
                        SUGERIR
                        <span className="ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99816 11.3125L13.5588 5.75184L12.4982 4.69118L7.99816 9.19118L3.49816 4.69118L2.4375 5.75184L7.99816 11.3125Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                      </Link>
                      <Link
                        href="/login"
                        className="flex items-center transition duration-300 hover:border-b-4 hover:border-green-500"
                      >
                        LOGIN
                      </Link>
                    </div>
                    <div className="mr-4 hidden items-center gap-x-4 text-white-default md:flex lg:mr-24">
                      <FaInstagram size={24} cursor="pointer" />
                      <FaLinkedin size={24} cursor="pointer" />

                      <FaTwitter size={24} cursor="pointer" />
                      <FaYoutube size={24} cursor="pointer" />
                      <FaFacebookSquare size={24} cursor="pointer" />
                    </div>
                  </div>

                  <div
                    className={`${
                      showMenu ? "hidden" : "flex"
                    } mr-4 flex animate-pulse items-center md:hidden`}
                  >
                    <button
                      type="button"
                      className="mobile-menu-button outline-none"
                      onClick={toggleMenu}
                    >
                      <svg
                        className="h-10 w-10
                         text-green-100 hover:text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {showMenu && (
                <Drawer
                  onClose={onClose}
                  placement="left"
                  size="large"
                  open={showMenu}
                  style={{
                    backgroundColor: "#058c42",
                    height: "100vh",
                    width: "75vw",
                    color: "white",
                    fontSize: "20px",
                  }}
                >
                  <ul>
                    <div className="flex py-4">
                      <a
                        href="#"
                        className="text-white flex flex-col items-center space-x-2 px-4"
                        title="mascote"
                      >
                        <Image
                          src="/mascote.svg"
                          alt="Logo"
                          className="mr-2 h-8 w-8"
                          width={32}
                          height={32}
                        />
                        <span className="truncate whitespace-nowrap text-2xl font-extrabold">
                          SIG SPORTS
                        </span>
                      </a>
                    </div>
                    <li className="active">
                      <Link
                        href="#modalidades"
                        className={`${
                          path === "modalidades"
                            ? "bg-green-500"
                            : "w-32 hover:border-b-4 hover:border-green-500"
                        } text-white block  px-2 py-4 text-sm  font-semibold hover:text-white-default`}
                      >
                        MODALIDADES
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#equipes"
                        className={`${
                          path === "equipes"
                            ? "bg-green-500"
                            : "w-32 hover:border-b-4 hover:border-green-500"
                        } text-white block  px-2 py-4 text-sm  font-semibold hover:text-white-default`}
                      >
                        EQUIPES
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#sugerir"
                        className={`${
                          path === "sugerir"
                            ? "bg-green-500"
                            : "w-32 hover:border-b-4 hover:border-green-500"
                        } text-white block  px-2 py-4 text-sm  font-semibold hover:text-white-default`}
                      >
                        SUGERIR
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="block px-2 py-4 text-sm transition duration-300 hover:bg-green-500"
                      >
                        LOGIN
                      </Link>
                    </li>
                  </ul>
                </Drawer>
              )}
            </nav>
          </div>
          <div className="mt-36 flex h-full w-screen justify-center md:mt-52 tablet:w-full">
            <div className="flex flex-col lg:p-0">
              <div
                className={`${raleway.className} mb-12 px-8 text-[22px] font-semibold leading-[50px] text-white-ligth md:w-[598px] md:px-0`}
              >
                Descubra os esportes mais praticados e disponíveis no IFRN
                campus Natal Central.
              </div>

              <div className="">
                <Image
                  src="/SIGSport.svg"
                  alt="Logo"
                  width={221}
                  height={83}
                  className="ml-8 h-[106px] w-[236px] md:ml-0 md:w-[336px]"
                />
                <div
                  className={`${quicksand.className} mt-12 flex w-full justify-around text-white-default`}
                >
                  <Link
                    href="/esportes"
                    className={`${montserrat.className} flex h-[57.6px] w-[144px] items-center justify-center bg-green-700  text-base font-bold leading-5 text-[#FCFFFC]`}
                  >
                    ESPORTES
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="invisible mt-10 flex w-0 flex-row-reverse flex-wrap justify-between overflow-hidden lg:w-2/4 tablet:visible">
          <img
            src="/background.svg"
            alt="Logo"
            className="absolute top-0 h-full overflow-hidden"
          />
          <img src="/text.svg" alt="Logo" className="absolute h-full" />
          <div className="invisible absolute mt-10 flex  w-full flex-wrap items-center justify-end tablet:visible">
            <img src="/women.svg" alt="Logo" className="h-full" />
          </div>
        </div>
      </div>
      <div
        id="equipe"
        className="flex flex-col bg-white-default bg-cover bg-no-repeat lg:bg-[url('/img-fundo1.png')]	xl:h-screen"
      >
        <div
          className={`${bebas_neue.className} flex w-full justify-center text-[53.551px] text-green-200 lg:pt-20`}
        >
          <h1>Equipe CODESP</h1>
        </div>
        <div className="flex h-full w-full flex-wrap justify-evenly md:mt-20">
          <Image
            src="/equipe.svg"
            alt="Logo"
            width={200}
            height={200}
            className="h-[403px] w-[657px]"
          />
          <div
            className={`${raleway.className} flex w-[605px] flex-col gap-y-8 px-8 text-2xl font-medium text-bgGray lg:h-[339px] lg:px-0`}
          >
            <span>
              A Coordenação de Esportes do Instituto Federal de Educação,
              Ciência e Tecnologia do Rio Grande do Norte (IFRN), é o epicentro
              das atividades esportivas que inspiram e conectam nossa comunidade
              acadêmica.
            </span>
            <span>
              Descubra o seu potencial atlético na CODESP - onde o esporte
              encontra a educação, criando uma experiência única para todos.
              Estamos comprometidos em moldar não apenas atletas, mas também
              cidadãos engajados e saudáveis.
            </span>
            <button
              type="button"
              className={`${montserrat.className} mb-8 ml-auto w-36 bg-green-200 py-5 text-[17.28px] font-bold text-white-default md:mb-0`}
            >
              INSCRIÇÃO
            </button>
          </div>
        </div>
      </div>
      <div
        id="modalidades"
        className="flex-col  bg-white-default bg-[url('/img-fundo.png')] bg-cover bg-no-repeat md:mt-20	lg:h-screen"
      >
        <div
          className={`${bebas_neue.className} flex w-full justify-center pt-14 text-[53.551px] uppercase text-green-200`}
        >
          <h1 className="ml-8 md:ml-0">esportes mais procurados</h1>
        </div>
        <div className="flex w-full justify-end pr-8">
          <button
            type="button"
            onClick={toggleButton}
            className={`${montserrat.className} h-14 w-36 bg-green-200 text-lg font-bold text-white-default`}
          >
            {showButton ? "VER MENOS" : "VER MAIS"}
          </button>
        </div>
        <div className={`${showButton && "h-96 overflow-y-scroll"}`}>
          <div className="mx-auto mt-20 grid grid-cols-1 gap-8  md:grid-cols-2 lg:grid-cols-3">
            {showButton &&
              equivalentesTodos.map((el, i) => (
                <CardModalidade
                  key={i}
                  id={el.id}
                  title={`${el.nomeTurma} - ${mudarGenero(el.genero)}`}
                  number={i + 1}
                  turmas={equivalentesTodos}
                  description={el.descricaoModalidade}
                />
              ))}
            {!showButton &&
              equivalentesPrimeirosSeis.map((el, i) => (
                <CardModalidade
                  key={i}
                  id={el.id}
                  title={`${el.modalidade} - ${mudarGenero(el.genero)}`}
                  number={i + 1}
                  turmas={equivalentesPrimeirosSeis}
                  description={el.descricaoModalidade}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="w-full flex-col lg:h-screen" id="sugerir">
        <div className="flex h-[80vh] w-full items-center bg-bgGray lg:h-[50%]">
          <div className="flex flex-col px-8 lg:ml-24 lg:w-[1065px] lg:px-0">
            <span
              className={`${raleway.className} w-full font-['Raleway'] text-2xl font-medium text-white-default lg:h-[58px]`}
            >
              Dentre os esportes disponíveis, algum te chamou atenção? Dirija-se
              até a Codesp para realizar sua matrícula! Algum esporte que
              gostaria não está na lista? Faça uma sugestão abaixo:
            </span>{" "}
            {/* <button
              type="button"
              className={`${montserrat.className} mt-7 h-14 w-36 bg-green-200 text-lg font-bold text-white-default`}
            >
              SUGERIR
            </button> */}
            <Sugestao quicksand={quicksand} montserrat={montserrat} />
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center bg-[#191919] pl-8 pt-20 md:h-[50%] md:flex-row md:pl-0">
          <div
            className={` flex w-full flex-col gap-y-6 text-white-default md:ml-[88px]`}
          >
            <span className={`${raleway.className} text-lg font-medium`}>
              Coordenação
            </span>
            <span className={`${raleway.className} text-lg font-medium`}>
              Portal IFRN Cnat
            </span>
            <span className={`${raleway.className} text-lg font-medium`}>
              Nossa Equipe
            </span>
          </div>
          <div className="flex w-full flex-col gap-y-6 text-white-default">
            <span className={`${raleway.className} text-lg font-medium`}>
              Contato
            </span>
            <span className={`${raleway.className} text-lg font-medium`}>
              Localização
            </span>
            <span className={`${raleway.className} text-lg font-medium`}>
              Politica de Privacidade
            </span>
          </div>
          <div className="my-4 flex h-full w-full items-center pr-2 text-white-default md:my-0 md:justify-end md:pr-0">
            <span
              className={`${raleway.className} text-base font-bold md:mt-44`}
            >
              © 2023 Sigsport, Todos os Direitos Reservados
            </span>
          </div>
          <div className="my-8 flex w-full justify-center text-white-default md:my-0 md:mr-20 md:justify-end">
            <div className="flex flex-col md:w-[271px]">
              <span className={`${raleway.className} text-lg font-medium`}>
                Nos siga!
              </span>
              <div className="mt-8 flex gap-x-4">
                <FaInstagram size={24} />
                <FaLinkedin size={24} />

                <FaTwitter size={24} />
                <FaYoutube size={24} />
                <FaFacebookSquare size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await api.get(`v1/listarTurmas`);
  const resp1 = await api.get(`v1/vagasDeTurmas`);
  const resp2 = await api.get(`v1/listarModalidades`);
  const turmas = await response.data;
  const alunosT = await resp1.data;
  const modalidades = await resp2.data;
  return {
    props: {
      turmas,
      alunosT,
      modalidades,
    },
  };
};
