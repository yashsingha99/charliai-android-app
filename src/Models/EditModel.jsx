import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FileEdit } from "lucide-react";
import { useModal } from "./ModalContext";

import { Button } from "../Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/ui/dialog";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { SidebarMenuButton } from "../Components/ui/sidebar";
import CircularSpinner from "../Components/ui/spinner";

const URI = import.meta.env.VITE_APP_URL;

export function DialogEdit({ id }) {
  const[open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const { setNewCreatedId } = useModal();

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await axios.patch(`${URI}/api/editChat`, {
        id,
        ...data,
      });
      setNewCreatedId((prev) => !prev);
      setOpen(false);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="flex items-center gap-2 w-full">
          <FileEdit className="w-4 h-4" />
          <span>Rename</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSaveChanges}>
          <DialogHeader>
            <DialogTitle>Rename Character</DialogTitle>
            <DialogDescription>
              Make changes to your character here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Character Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description-1">Description</Label>
              <Input
                id="description-1"
                name="description"
                placeholder="A friendly character"
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ?  <CircularSpinner backgroundColor="white" /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
