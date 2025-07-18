"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../Components/ui/dialog";
import { Button } from "../Components/ui/button";
import { Trash } from "lucide-react";
import { SidebarMenuButton } from "../Components/ui/sidebar";
import { toast, Toaster } from "sonner";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import CircularSpinner from "../Components/ui/spinner";
import { useModal } from "./ModalContext";
const URI = import.meta.env.VITE_APP_URL;
export default function DeleteModal({ id, chatName = "This Chat" }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const{setNewCreatedId} = useModal()
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${URI}/api/deleteChat`, { params: { id } });
      toast.success("Chat deleted successfully");
      setNewCreatedId((prev) => !prev);  
      setOpen(false);
      navigate('/')
    } catch (error) {
      toast.error("Failed to delete chat");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Toaster /> */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SidebarMenuButton className="flex items-center gap-2 w-full hover:bg-red-200 hover:text-red-500 text-red-500">
            <Trash className="w-4 h-4" />
            <span>Delete</span>
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent >
          <DialogHeader className=" ">
            <DialogTitle className="text-lg font-semibold">Delete chat?</DialogTitle>
            <DialogDescription className=" ">
              This will delete <strong>{chatName ? chatName : "this chat"}</strong>.
              <br />
              Visit{" "}
              <Link
                to=""
                className="underline text-blue-400 hover:text-blue-300"
              >
                settings
              </Link>{" "}
              to delete any memories saved during this chat.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" className="border-1 border-gray-600" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? <CircularSpinner backgroundColor="white" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
