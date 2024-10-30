import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Notebook } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Notebook className="h-12 w-12 mr-4" />
          <h1 className="text-4xl font-bold tracking-tight">
            Modern Notes App
          </h1>
        </div>
        <p className="text-xl text-muted-foreground">
          A beautiful and intuitive notes application for your daily thoughts
          and ideas.
        </p>
        <Link href="/notes">
          <Button size="lg" className="mt-6">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}
