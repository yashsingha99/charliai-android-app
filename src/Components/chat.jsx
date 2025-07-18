"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { toast, Toaster } from "sonner";
import { Plus, Send, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CircularSpinner from "./ui/spinner";
import { useModal } from "../Models/ModalContext";
const URI = import.meta.env.VITE_APP_URL;

export default function Chat() {
  const [question, setQuestion] = useState("");
  const { openModal, newCreatedId } = useModal();
  const [qaHistory, setQaHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const chatBoxRef = useRef(null);
  const [searchParams] = useSearchParams();
  const selectedChatId = searchParams.get("chatId");

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return setError("Please enter a question.");
    if (!selectedChatId) return setError("Please select a character.");
    setGenerating(true);
    setError("");

    try {
      const res = await axios.post(`${URI}/api/chat`, {
        question,
        id: selectedChatId,
      });

      setQaHistory((prev) => [...prev, { question, answer: res.data.answer }]);
      setQuestion("");
    } catch (err) {
      toast(err?.response?.data?.message || "An error occurred.");
    }
    setGenerating(false);
  };

  useEffect(() => {
    // window.scrollTo(0, document.body.scrollHeight);
    scrollToBottom();
  }, [qaHistory]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedChatId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${URI}/api/previousById`, {
          params: { id: selectedChatId },
        });
        setQaHistory(res.data);
      } catch (err) {
        setError("Error fetching history");
      }
      setLoading(false);
    };
    fetchHistory();
  }, [selectedChatId]);

  if (loading) {
    return <ChatSkeleton />;
  }

  return (
    <>
      <Toaster />
      <Card className="flex h-full flex-col dark:bg-dark light:bg-white/80">
        <ScrollArea
          className="flex-1 p-4"
          style={{ height: "calc(100% - 80px)" }}
        >
          {!selectedChatId || qaHistory.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <User className="mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Start chatting with your character
              </h3>
              <p className="max-w-sm text-sm">
                Send messages to communicate with you character.
              </p>
              {!selectedChatId && (
                <>
                  <Button
                    onClick={openModal}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Character</span>
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {qaHistory.map((qa, index) => (
                <div key={qa._id}>
                  <div className="flex justify-end">
                    <div className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground max-w-md">
                      {qa.question}
                    </div>
                  </div>

                  <ScrollArea className="w-[90%] text-sm mt-4 rounded-md border border-border bg-muted p-3 overflow-x-auto">
                    {/* <div className="w-max min-w-full"> */}
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: qa.answer }}
                    />
                    {/* </div> */}
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              ))}
              {generating && (
                <div className=" flex justify-center py-4 text-muted-foreground animate-pulse">
                  {/* Generating... */}
                  <CircularSpinner backgroundColor={"red"} />
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {selectedChatId && (
          <div className="border-t p-4">
            <form
              onSubmit={handleAskQuestion}
              className="flex items-center gap-2"
            >
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything"
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="icon" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </Card>
      <div ref={chatBoxRef} />
    </>
  );
}

function ChatSkeleton() {
  return (
    <Card className="flex h-[calc(100svh-170px)] flex-col">
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                i % 2 === 0 ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-[200px] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
