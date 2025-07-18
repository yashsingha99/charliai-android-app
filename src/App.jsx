import React, { useEffect, useState } from "react";
import "./App.css";
import { useSearchParams } from "react-router-dom";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import AppSidebar  from "./Components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Components/ui/breadcrumb";
import { Separator } from "./Components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./Components/ui/sidebar";
import Chat  from "./Components/chat";
const URI = import.meta.env.VITE_APP_URL;
export async function getOrCreateSession() {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    const response = await axios.post(`${URI}/api/session`, {
      fingerprint,
    });

    console.log("User Session:", response);
    if (response.status === 200) {
      localStorage.setItem("fp_id", fingerprint);
      localStorage.setItem("sessionId", response.data.sessionId);
    }
  } catch (error) {
    console.log("creating error", error);
  }
}
export default function App() {
  const [loading, setIsloading] = useState(false);
  const session = localStorage.getItem("fp_id");
  const [searchParams] = useSearchParams();
  const selectedChatId = searchParams.get("chatId");
  const [chatName, setChatName] = useState("");

  useEffect(() => {
    async function create() {
      if (!session) {
        try {
          setIsloading(true);
          await getOrCreateSession();
        } catch (error) {
          console.log(error);
        }
        setIsloading(false);
      }
    }
    create();
  }, [session]);

  useEffect(() => {
    const fetchName = async () => {
      if (!selectedChatId) return;
      try {
        const res = await axios.get(`${URI}/api/getChatName`, {
          params: { id: selectedChatId },
        });
        setChatName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch chat name", err);
      }
    };
    fetchName();
  }, [selectedChatId]);

  if (loading) return <>Loading...</>;

  return (
    <SidebarProvider className="flex h-screen w-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        {/* Fixed Header */}
        <header className="h-16 flex items-center gap-2 border-b bg-white/80 backdrop-blur px-4 ">

          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 hidden sm:block"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-500 text-xl">
                  {chatName ? chatName.toUpperCase() : "Character"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Chat Section */}
        <main className=" flex-1 overflow-y-auto">
          <Chat />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
