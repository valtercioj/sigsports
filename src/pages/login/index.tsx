/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @next/next/no-img-element */
// import { useContext, useState } from "react";
import { GetServerSideProps } from "next";
import { notification } from "antd";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaFacebookSquare,
} from "react-icons/fa";

import { Quicksand, Bebas_Neue } from "next/font/google";
// import * as yup from "yup";
import { useEffect } from "react";
import LoginSuap from "@/components/LoginSuap";
// import { AuthContext } from "@/contexts/AuthContext";

// const schema = yup
//   .object({
//     username: yup
//       .string()
//       .required("Matricula obrigatória")
//       .matches(/^\d+$/, "A matrícula deve conter apenas números")
//       .min(14, "Matricula Invalida")
//       .max(14, "A matrícula deve ter máximo 14 dígitos"),
//     password: yup.string().required("Senha obrigatória"),
//   })
//   .required();
// type FormData = yup.InferType<typeof schema>;

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
export default function Login({ permission }: { permission: boolean }) {
  // const { signIn } = useContext(AuthContext);

  // const [isLoading, setIsLoading] = useState(false);
  // const onSubmit = async (data: FormData) => {
  //   setIsLoading(true); // Ativa o carregamento
  //   try {
  //     const response = await signIn(data);

  //     // Se a resposta contém a mensagem de erro, mostramos o toast
  //     if (response && response.message) {
  //       notification.error({
  //         message: response.message, // Exibe a mensagem de erro no toast
  //       });
  //     }
  //   } catch (error: any) {
  //     // Caso ocorra um erro inesperado, mostramos um toast genérico
  //     notification.error({
  //       message: error?.response?.data?.detail || "Erro desconhecido",
  //     });
  //   } finally {
  //     setIsLoading(false); // Desativa o carregamento, independentemente do resultado
  //   }
  // };

  const notificationMensage = () => {
    if (permission) {
      notification.error({
        message: "Proibido",
        description: "Você não tem permissão para acessar esse sistema",
      });
    }
  };
  useEffect(() => {
    notificationMensage();
  }, []);

  return (
    <div className={`scrollable ${quicksand.className} flex h-screen `}>
      <div className="flex h-full w-full flex-col lg:justify-between ">
        <div className="fixed z-50 flex w-screen bg-bgGray shadow-2xl">
          <nav className="z-50 w-full">
            <div className=" w-full px-4">
              <div className="flex w-full">
                <div className="flex w-full gap-x-8">
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="mr-20 flex items-center px-2 py-4"
                    >
                      <Image
                        src="/mascote.svg"
                        alt="Logo"
                        className="mr-2 h-10 w-8"
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

                  <div className="mr-24 hidden w-full items-center justify-end gap-x-4 text-white-default md:flex">
                    <FaInstagram size={24} />
                    <FaLinkedin size={24} />

                    <FaTwitter size={24} />
                    <FaYoutube size={24} />
                    <FaFacebookSquare size={24} />
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="mt-20 flex h-full w-screen justify-center md:mt-36 tablet:w-full">
          <div className="flex h-full flex-col justify-around lg:p-0">
            <div className="my-auto mt-14  w-[321px] px-8">
              <Image src="/SIGSport.svg" alt="Logo" width={321} height={83} />
              {/* <Form onFinish={onSubmit} className="w-64 lg:w-96">
                <div className="mt-6 flex flex-col">
                  {" "}
                  <label
                    htmlFor="username"
                    className={`w-full  ${quicksand.className} text-lg font-medium leading-6 text-white-default`}
                  >
                    Matricula
                  </label>{" "}
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, digite sua Matricula",
                      },
                      { len: 14, message: "Digite uma matricula valida" },
                    ]}
                  >
                    <Input
                      className="plaheholder: plaheholder:leading-5 text-gray  placeholder:text-gray  plaheholder:font-medium plaheholder:text-base focus:bg-white
                    h-14 w-64 border-2  border-green-200 bg-white-default
                     pl-4 text-base font-medium
                focus:border-gray-600
                focus:placeholder-gray-500
                focus:outline-none
                md:w-96"
                    />
                  </Form.Item>
                </div>

                <div className="flex flex-col">
                  {" "}
                  <label
                    htmlFor="password"
                    className={`w-full  ${quicksand.className} text-lg font-medium leading-6 text-white-default`}
                  >
                    Senha
                  </label>{" "}
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, digite sua senha",
                      },
                    ]}
                  >
                    <Input.Password
                      className="plaheholder: plaheholder:leading-5 text-gray  placeholder:text-gray  plaheholder:font-medium plaheholder:text-base focus:bg-white
                    h-14 w-64 border-2 border-green-200 bg-white-default
                     pl-4 text-base font-medium
                focus:border-gray-600
                focus:placeholder-gray-500
                focus:outline-none
                md:w-96"
                    />
                  </Form.Item>
                </div>
                <Form.Item className="mt-2 flex w-full justify-end text-white-default">
                  <Button
                    loading={isLoading}
                    htmlType="submit"
                    className="h-[57.6px] w-[144px] rounded-sm border-none bg-green-200 text-base font-bold leading-5 text-white-default hover:bg-green-300"
                  >
                    ENTRAR
                  </Button>
                </Form.Item>
              </Form> */}
              <LoginSuap />
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
        <div className="invisible absolute mt-10 flex flex-wrap items-center justify-end tablet:visible">
          <img src="/women.svg" alt="Logo" className="h-full" />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies["sig-token"];
  const { notificationMensage } = req.cookies;
  const permission = notificationMensage === "1";
  if (token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {
      permission,
    },
  };
};
