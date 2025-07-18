import * as React from "react";
import { GalleryVerticalEnd, Minus, Pencil, Plus } from "lucide-react";

import { SearchForm } from "./search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "./ui/sidebar";

import { useModal } from "../Models/ModalContext";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

// Replace with your actual base URL
const URI = import.meta.env.VITE_APP_URL;

export default function AppSidebar() {
  const { openModal, newCreatedId } = useModal();
  const [history, setHistory] = React.useState([]);
  const [historyWithQ, setHistoryWithQ] = React.useState([]);
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  // const selectedChatId = searchParams.get("chatId");
  const navigate = useNavigate();
  React.useEffect(() => {
    const fetchChats = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        console.log("Session is expired");
        return;
      }

      try {
        const res = await axios.get(
          `${URI}/api/getCharacters?sessionId=${sessionId}`
        );
        setHistory(res.data);

        const newHistoryWithQ = res.data.map((h) => ({
          characterId: h._id,
          questions: [],
        }));

        setHistoryWithQ(newHistoryWithQ);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    fetchChats();
  }, [newCreatedId]);

  const handleClick = (id) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("chatId", id);
    navigate(`?${newParams.toString()}`);
    setSidebarOpen(false);
  };

  const handleFetch = async (id) => {
    try {
      const existingEntry = historyWithQ.find((h) => h.characterId === id);
      if (!existingEntry || existingEntry.questions.length > 0) return;

      const res = await axios.get(`${URI}/api/previousQuestions`, {
        params: { id },
      });

      setHistoryWithQ((prev) =>
        prev.map((entry) =>
          entry.characterId === id ? { ...entry, questions: res.data } : entry
        )
      );
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/")} size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex gap-0.5 leading-none text-xl font-bold">
                  <span className="text-blue-600">Charli</span>
                  <span className="text-black">AI</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenuButton
          onClick={openModal}
          className="flex ml-3 items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-1.5 rounded border border-border bg-muted shadow-sm w-[90%]"
        >
          <Plus className="w-4 h-4" />
          <span>New Character</span>
        </SidebarMenuButton>

        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {history.map((item, index) => {
              const historyEntry = historyWithQ.find(
                (h) => h.characterId === item._id
              );
              // console.log(historyEntry);

              return (
                <Collapsible
                  key={item._id}
                  defaultOpen={index === 1}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => {
                          handleClick(item._id);
                        }}
                      >
                        <span className="truncate max-w-[140px] overflow-hidden whitespace-nowrap">
                          {item.name}
                        </span>

                        <Plus
                          // onClick={(e) => {
                          //   e.stopPropagation();
                          //   handleFetch(item._id);
                          // }}
                          className="ml-auto group-data-[state=open]/collapsible:hidden"
                        />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {/* {historyEntry.questions.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {historyEntry.questions.map((q) => (
                            <SidebarMenuSubItem key={q?._id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={q?.isActive}
                              >
                                {q?.question}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null} */}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
