import React, { useState } from "react";
import { useModal } from "./ModalContext";
import axios from "axios";
import { UserCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../Components/ui/dialog";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import CircularSpinner from "../Components/ui/spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const URI = import.meta.env.VITE_APP_URL;

export default function GlobalModal() {
  const { isOpen, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { setNewCreatedId } = useModal();
  const [character, setCharacter] = React.useState({
    name: "",
    about: "",
    file: "",
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handler = async () => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.warn("Session expired. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post(`${URI}/api/createCharacter`, {
        ...character,
        sessionId,
      });
      toast.success("Character created successfully");
      setNewCreatedId((prev) => !prev); 
      const newParams = new URLSearchParams(searchParams);
      newParams.set("chatId", res.data._id);
      navigate(`?${newParams.toString()}`);
      closeModal();
    } catch (error) {
      console.error("❌ Failed to create character:", error);
    } finally {
      setIsLoading(false);
      setCharacter({
        name: "",
        about: "",
        file: "",
      });
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserCircle size={20} />
            Create Your Character
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handler();
          }}
          className="space-y-4"
        >
          <Input
            type="text"
            placeholder="Character Name"
            value={character.name}
            onChange={(e) =>
              setCharacter({ ...character, name: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="About Character"
            value={character.about}
            onChange={(e) =>
              setCharacter({ ...character, about: e.target.value })
            }
          />

          <Button
            type="submit"
            className="w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <CircularSpinner
                  backgroundColor="white"
                  classStyle="w-[1.5px] h-[12px]"
                />
              </>
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
