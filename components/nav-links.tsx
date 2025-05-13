"use client";

import clsx from "clsx";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { name: "brr brr patapim" },
  { name: "sigma" },
  {
    name: "llsdkfjdlskjfsdlkjlkjsdflksjdflsdkfjdlskjfsdlkjlkjsdflksjdflsdkfjdlskjfsdlkjlkjsdflksjdfsdkfjdlskjfsdlkjlkjsdflksjdf",
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link, index) => {
        const href = "/chat/" + index;

        return (
          <Button
            key={index}
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
                {link.name}
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
