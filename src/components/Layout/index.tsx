import React, { useState } from "react";
import { Quicksand } from "next/font/google";
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
  return (
    <SidebarProvider>
      <div className="scrollable flex h-screen w-full bg-white-default">
        <Sidebar />
        <div className="w-full flex-1 overflow-auto">
          <div className="bg-white top-0 w-full border-b border-[#E0D8C5]">
            <div className="flex items-center bg-green-bg px-4 py-1 md:bg-white-default">
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
          </div>
          {!op && (
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
          )}
          {op && (
            <div className={`${trigger ? "w-full" : "w-screen"}`}>
              <div
                className={`flex h-full w-full flex-col items-center justify-center pl-4 ${
                  trigger && op && "md:w-[85%]"
                } md:pl-10`}
              >
                {rollback && <Rollback />}
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
