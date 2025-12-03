/* eslint-disable @next/next/no-img-element */
import Sidebar from "../Sidebar";
import { BaseLayout, TitleType } from "@/components/BaseLayout";

export type { TitleType };

export default function Layout(props: TitleType) {
  return <BaseLayout {...props} SidebarComponent={Sidebar} />;
}
