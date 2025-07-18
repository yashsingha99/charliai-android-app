import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../Components/ui/command";
import { Dialog, DialogContent } from "../Components/ui/dialog";
import {
  Calendar,
  Smile,
  Calculator,
  User,
  CreditCard,
  Settings,
  Search,
} from "lucide-react";
import { Input } from "./ui/input";

export function CommandMenu({history}) {
  const [open, setOpen] = useState(false);

  // Open with Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e) => {
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <>
       
     <div className="relative w-full">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  <Input
    onClick={() => setOpen(true)}
    placeholder="Search… or Ctrl + K"
    className="pl-10 text-muted-foreground cursor-pointer"
    readOnly
  />
</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-lg shadow-lg border">
          <Command className="rounded-lg md:min-w-[450px]">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
               {history?.map((item) => (
                <CommandItem
                  key={item._id}
                >
                  <span>{item.name}</span>
                </CommandItem>
              ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
