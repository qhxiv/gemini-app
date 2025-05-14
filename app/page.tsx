"use client";

import { createNewChat } from "@/lib/server-action";

import InformationInput from "@/components/information-input";

export default function Home() {
  return (
    <>
      <div className="mb-4 grow">
        <div className="flex h-full items-center justify-center">
          <h1 className="text-4xl font-bold">What can I help with?</h1>
        </div>
      </div>

      <InformationInput />
    </>
  );
}
