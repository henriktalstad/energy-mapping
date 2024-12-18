import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "../utils/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function Login() {
  const session = await auth();
  if (session?.user) {
      redirect("/dashboard");
  } else {
      redirect("/login");
  }

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#063B39] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Card className="max-w-sm bg-[#EFEEE7]">
          <CardHeader>
            <CardTitle className="text-2xl">Logg inn</CardTitle>
            <CardDescription>
              Fyll ut skjemaet under for å logge inn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

