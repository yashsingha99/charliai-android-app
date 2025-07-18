import * as React from "react";
import {
  Ellipsis,
  GalleryVerticalEnd,
  Minus,
  Moon,
  Pencil,
  Plus,
  Sun,
} from "lucide-react";

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
import { PopoverDemo } from "./popoverSidebar";
import { Button } from "./ui/button";
import { useTheme } from "../context/theme-comtext";
import {CommandMenu} from "./searchCommand";
// Replace with your actual base URL
const URI = import.meta.env.VITE_APP_URL;

export default function AppSidebar() {
  const { openModal, newCreatedId } = useModal();
  const [history, setHistory] = React.useState([]);
  const [historyWithQ, setHistoryWithQ] = React.useState([]);
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const { theme, setTheme } = useTheme();
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
            <SidebarMenuButton  size="lg" asChild>
              <div className="flex items-center justify-between w-full">
                <div onClick={() => navigate("/")} className="flex items-center gap-2">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex gap-0.5 leading-none text-xl font-bold">
                    <span className="text-blue-600">Charli</span>
                    <span className=" dark:text-white">AI</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (theme === "dark") setTheme("light");
                    else setTheme("dark");
                  }}
                  variant="outline"
                  size="icon"
                >
                  {theme === "light" ? (
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  ) : (
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  )}
                </Button>
              </div>
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

        {/* <SearchForm /> */}
        <CommandMenu history={history} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {history.map((item, index) => {
              return (
                <Collapsible
                  key={item._id}
                  defaultOpen={index === 1}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`flex items-center justify-between `}
                      >
                        <div
                          onClick={() => {
                            handleClick(item._id);
                          }}
                          className="w-[90%] truncate max-w-[140px] overflow-hidden whitespace-nowrap"
                        >
                          <span className="truncate max-w-[140px]  overflow-hidden whitespace-nowrap">
                            {item.name}
                          </span>
                        </div>

                        <PopoverDemo id={item._id} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

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
