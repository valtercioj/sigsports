/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { Quicksand } from "next/font/google";
import { Tour, ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import type { TourProps } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import CriarTurma from "../Forms/CriarTurma";
import { api2 } from "@/services/api";
import { useSidebarTour } from "@/hooks/useSidebarTour";
import { handleLogout as handleLogoutUtil } from "@/utils/authUtils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const quicksand = Quicksand({
  weight: "600",
  style: "normal",
  subsets: ["latin"],
});

export default function AppSidebar({ adm, id }: { adm: boolean; id: number }) {
  const router = useRouter();
  const cookies = parseCookies();
  const tour = cookies.Tour;
  const admin = cookies.admin === "1";
  const [openTour, setOpenTour] = React.useState<boolean>(false);

  const ref = React.useRef(null);
  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  const ref4 = React.useRef(null);
  const ref5 = React.useRef(null);
  async function setTour() {
    try {
      await api2.put(`v1/usuarios/update/${id}/`, {
        tour: 0,
      });

      if (tour === "1") setCookie(undefined, "Tour", "0");
      setOpenTour(false);
    } catch (error) {
      console.error("Error setting tour:", error);
    }
  }

  const { condintions, steps, steps1 } = useSidebarTour({
    ref1,
    ref2,
    ref3,
    ref4,
    ref5,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setOpenTour(tour === "1");
    }, 2000);
  });

  const handleLogout = handleLogoutUtil(router);

  return (
    <>
      <Sidebar className="bg-gradient-to-tl from-green-300 to-green-900 text-gray-100 md:bg-gradient-to-tl md:from-green-300 md:to-green-900">
        <SidebarHeader className="p-4">
          <Link
            ref={ref}
            href="/dashboard"
            className="text-white flex items-center space-x-2"
          >
            <img src="/mascote.svg" alt="SIG SPORTS mascot" />
            <span className={`${quicksand.className} text-xl font-extrabold`}>
              SIG SPORTS
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-3 py-4 text-gray-100">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.title === "Criar Turma" && (
                  <SidebarMenuButton asChild>
                    <div
                      ref={condintions(item.title)}
                      className="ml-1 hover:cursor-pointer hover:rounded-md hover:text-white-default"
                    >
                      <img src={`/${item.icon}.svg`} className="mr-1" />
                      <CriarTurma
                        quicksand={quicksand}
                        text="Criar Turma"
                        isMenu
                      />
                    </div>
                  </SidebarMenuButton>
                )}
                {item.title === "Usuários" && adm && (
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      ref={condintions(item.title)}
                      className={`hover:rounded-md hover:text-white-default ${
                        router.pathname === item.url
                          ? "bg-green-300 text-gray-100"
                          : "hover:text-white text-gray-100"
                      }`}
                    >
                      <div
                        className={` fill-white-default text-white-default  `}
                      >
                        <img src={`/${item.icon}.svg`} />
                      </div>

                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
                {item.title !== "Criar Turma" && item.title !== "Usuários" && (
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      ref={condintions(item.title)}
                      className={`hover:rounded-md hover:text-white-default ${
                        router.pathname === item.url
                          ? "bg-green-300 text-gray-100"
                          : "hover:text-white text-gray-100"
                      }`}
                    >
                      {item.icon === "dashboard" ? (
                        <div className="ml-1 text-xl">
                          <HomeOutlined size={30} />
                        </div>
                      ) : (
                        <div
                          className={`${
                            item.icon === "emprestimo" && "ml-1"
                          } fill-white-default text-white-default  `}
                        >
                          <img src={`/${item.icon}.svg`} />
                        </div>
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button
            variant="ghost"
            className="text-white w-full justify-start"
            onClick={handleLogout}
          >
            <img src="/logout.svg" alt="Logout" className="mr-2" />
            <span className={quicksand.className}>Sair</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="hidden md:block">
        <ConfigProvider locale={ptBR}>
          <Tour
            open={openTour}
            onClose={() => setTour()}
            steps={admin ? steps : steps1}
            type="primary"
          />
        </ConfigProvider>
      </div>
    </>
  );
}
