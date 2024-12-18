"use client";

import { RainbowButton } from "@/components/ui/rainbow-button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface iAppProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function SubmitButton({ text }: iAppProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <RainbowButton disabled className="w-full">
          <Loader2 className="size-4 mr-2 animate-spin" /> Vennligst vent...
        </RainbowButton>
      ) : (
        <RainbowButton type="submit" className="w-full">
          {text}
        </RainbowButton>
      )}
    </>
  );
}
