"use client";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Pencil, Share, Trash, FileEdit, Ellipsis } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";
import ShareModal from "../Models/ShareModel";
import DeleteModal from "../Models/DeleteModel";
import { DialogEdit } from "../Models/EditModel";

export function PopoverDemo({ id }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis className="w-5 h-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-36 rounded-2xl p-2">
        <div className="flex flex-col gap-2">
          <ShareModal id={id} />

           <DialogEdit id={id} />

          <DeleteModal id={id} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
