'use client'

import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setLoading(true);
      const result = await signIn("credentials", { 
        email, 
        password,
        redirect: false,
      });
      console.log(result);

      if (result?.error) {
        setError("Ugyldig email eller passord");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="hello@example.com"
        />
        <Label htmlFor="password">Passord</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="********"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <Button className="w-full" disabled={loading} variant={"default"}>
        {loading ? "Logger inn.." : "Logg inn"}
      </Button>
    </form>
  );
}

