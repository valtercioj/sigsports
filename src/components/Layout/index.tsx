import React from "react";
import { Quicksand } from "next/font/google";
import Sidebar from "../Sidebar";
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
};

export default function index({ children, title, description }: TitleType) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-white-default">
        <Sidebar />
        <div className="w-full flex-1 overflow-auto">
          <div className="bg-white top-0 w-full border-b border-[#E0D8C5]">
            <div className="flex h-16 items-center bg-green-bg px-4 md:bg-white-default">
              <SidebarTrigger className="text-gray-100 md:text-green-bg" />
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
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
