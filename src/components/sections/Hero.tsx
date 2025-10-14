import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] -z-10" />
      
      <div className="container px-4 py-20 mx-auto text-center animate-fade-in-up">
        <div className="inline-block mb-6">
          <span className="text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            Disponible pour de nouvelles opportunités
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
          Marius Razafitsalama
        </h1>
        
        <p className="text-2xl md:text-3xl text-muted-foreground mb-4">
          Développeur FullStack
        </p>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Spécialisé en Laravel, Vue.js & React | 3+ ans d'expérience
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <Mail className="h-5 w-5" />
            Me contacter
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <ExternalLink className="h-5 w-5" />
            Voir mes projets
          </Button>
        </div>
        
        <div className="flex gap-4 justify-center">
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
      </div>
    </section>
  );
}
