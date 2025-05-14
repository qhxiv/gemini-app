"use client";

import clsx from "clsx";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { EllipsisVertical } from "lucide-react";

import { Chat } from "@/lib/definitions";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavLinks({ chats }: { chats?: Chat[] }) {
  const pathname = usePathname();

  return (
    <>
      {chats &&
        chats.map((chat) => {
          const href = "/chat/" + chat.id;

          return (
            <Button
              key={chat.id}
              variant="ghost"
              className="group w-full text-ellipsis"
              asChild
            >
              <Link href={href}>
                <span
                  className={clsx("grow truncate text-left", {
                    "font-bold": pathname === href,
                  })}
                >
                  {chat.title}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="text-muted-foreground hover:text-primary hidden cursor-pointer group-hover:block">
                      <EllipsisVertical />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    side="right"
                    className="peer"
                  >
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Link>
            </Button>
          );
        })}
    </>
  );
}
