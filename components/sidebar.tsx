"use client";

import clsx from "clsx";

import { useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, SquarePen } from "lucide-react";

import { Chat } from "@/lib/definitions";

import NavLinks from "@/components/nav-links";
import { Button } from "@/components/ui/button";

export default function SideBar({ chats }: { chats: Chat[] }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <nav
      className={clsx(
        "border-border flex flex-col gap-y-4 border-r p-4",
        isOpen ? "w-1/5" : "w-auto",
      )}
    >
      <div>
        <Button size="icon" variant="ghost" onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </Button>
      </div>

      <div>
        {pathname === "/" ? (
          <Button disabled variant="ghost" className="w-full justify-start">
            <SquarePen /> {isOpen && "New chat"}
          </Button>
        ) : (
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/">
              <SquarePen /> {isOpen && "New chat"}
            </Link>
          </Button>
        )}
      </div>

      {chats.length > 0 && (
        <div hidden={!isOpen}>
          <Button
            asChild
            className="text-muted-foreground hover:text-muted-foreground hover:bg-transparent"
            variant="ghost"
          >
            <p>Recent</p>
          </Button>

          <NavLinks chats={chats} />
        </div>
      )}
    </nav>
  );
}
