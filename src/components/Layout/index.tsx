/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Quicksand } from "next/font/google";
import { parseCookies } from "nookies";
import { FourSquare } from "react-loading-indicators";
import { Image } from "antd";
import Sidebar from "../Sidebar";
import Rollback from "../Rollback";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const quicksand = Quicksand({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export type TitleType = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  rollback?: boolean;
  op?: boolean;
};

export default function Index({
  children,
  title,
  description,
  rollback = true,
  op = true,
}: TitleType) {
  const [trigger, setTrigger] = useState(true);
  const [cookies, setCookies] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false); // Para controlar quando o cliente foi montado

  useEffect(() => {
    // Definir que o componente foi montado no cliente
    setIsClient(true);

    // Obter os cookies apenas no lado do cliente
    const parsedCookies = parseCookies();
    setCookies(parsedCookies);
  }, []);

  const { foto } = cookies;
  const { nome } = cookies;
  const { matricula } = cookies;
  const { adm } = cookies;
  const { id } = cookies;
  if (!isClient) {
    // Garantir que o layout não seja renderizado no lado do servidor
    return null;
  }

  return (
    <SidebarProvider>
      {adm && foto && nome && matricula ? (
        <div className="scrollable flex h-screen w-full bg-white-default">
          <Sidebar adm={adm === "1"} id={parseInt(id, 10)} />
          <div className="w-full flex-1 overflow-auto">
            <div className="bg-white top-0 w-full border-b border-[#E0D8C5]">
              <div className="flex items-center justify-between bg-green-bg px-4 md:bg-white-default">
                <div className="flex items-center">
                  <SidebarTrigger
                    className="text-gray-100 md:text-green-bg"
                    setTriggered={setTrigger}
                    triggered={trigger}
                  />
                  <div className="ml-6">
                    <h1
                      className={`${quicksand.className} text-xl font-semibold leading-[37.57px] text-gray-100 md:text-green-bg `}
                    >
                      {title}
                    </h1>
                    {description && (
                      <p className="text-sm text-[#7F8C8D]">{description}</p>
                    )}
                  </div>
                </div>

                <div className="h-18 flex gap-x-4">
                  <div className="hidden flex-col md:flex">
                    <span>{nome}</span>
                    <span>{matricula}</span>
                  </div>
                  <div className="h-14 w-14">
                    <Image
                      alt="Foto do usuário"
                      height={56}
                      width={56}
                      className="h-full w-full rounded-full"
                      src={foto}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div
                className={`flex h-full w-full flex-col items-center justify-center pl-4 ${
                  trigger && op && "md:w-[85%]"
                } md:pl-10`}
              >
                {rollback && <Rollback />}
                {children}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full items-center justify-center">
          <FourSquare
            color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]}
            size="large"
            text="Carregando..."
            style={{ fontSize: 25 }}
            textColor="#33CC36"
          />
        </div>
      )}
    </SidebarProvider>
  );
}
