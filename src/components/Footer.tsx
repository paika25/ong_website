import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-12 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Mail className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              © {currentYear} Marius Razafitsalama. Tous droits réservés.
            </p>
            <p>
              Développé avec React, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
