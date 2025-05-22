"use client";

import { Settings2 } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FaSellcast } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";

import { usePathname } from "next/navigation";
import clsx from "clsx";
import { SiTransportforlondon } from "react-icons/si";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";

export function NavMain() {
  const pathname = usePathname();
  const { language } = useLanguage()
  const t=content[language]

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="p-10">
        <SidebarMenuButton asChild>
          <a href="/dashboard/homepage">
            <SiTransportforlondon className="text-black dark:text-white " />
            <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
              PortfoyPro
            </span>
          </a>
        </SidebarMenuButton>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className={clsx("m-2 mb-4", {
              "bg-muted text-muted-foreground rounded-md":
                pathname === "/dashboard/portfolios",
            })}
          >
            <a href="/dashboard/portfolios" className="flex gap-2 ">
              <GrTransaction />
              <span>{t.myPortfolio}</span>
            </a>
          </SidebarMenuButton>
          {/*Simdilik bu sayfa kaldirildi */}
          {/* <SidebarMenuButton
            asChild
            className={clsx("m-2 mb-4", {
              "bg-muted text-muted-foreground rounded-md":
                pathname === "/dashboard/buy-sell",
            })}
          >
            <a href="/dashboard/buy-sell" className="flex  gap-2 ">
              <AiOutlineTransaction className="size-5" />
              <span>Buy-Sell</span>
            </a>
          </SidebarMenuButton> */}

          <SidebarMenuButton
            asChild
            className={clsx("m-2 mb-4", {
              "bg-muted text-muted-foreground rounded-md":
                pathname === "/dashboard/transactions",
            })}
          >
            <a href="/dashboard/transactions" className="flex gap-2 ">
              <FaSellcast className="size-4" />
              <span>{ t.transactions}</span>
            </a>
          </SidebarMenuButton>

          <SidebarMenuButton
            asChild
            className={clsx("m-2 mb-4", {
              "bg-muted text-muted-foreground rounded-md":
                pathname === "/dashboard/profile",
            })}
          >
            <a href="/dashboard/profile" className="flex gap-2 ">
              <CgProfile className="size-4" />
              <span>{ t.profile}</span>
            </a>
          </SidebarMenuButton>

          <SidebarMenuButton
            asChild
            className={clsx("m-2 mb-4", {
              "bg-muted text-muted-foreground rounded-md":
                pathname === "/dashboard/settings",
            })}
          >
            <a href="/dashboard/settings" className="flex gap-2 ">
              <Settings2 className="size-4" />
              <span>{ t.settings}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
