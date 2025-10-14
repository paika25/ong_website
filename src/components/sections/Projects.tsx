import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Pizzeria Backoffice",
    description: "Back-office pour une pizzeria avec gestion complète des actions, produits et clientèle. Tableaux statistiques pour suivre l'évolution de l'entreprise.",
    technologies: ["Laravel", "Vue.js", "Inertia", "SSR"],
    category: "Application Web"
  },
  {
    title: "JejeLivraison Platform",
    description: "Plateforme de commande et de livraison en ligne avec intégration PayPal, système de notation, et gestion des zones géographiques.",
    technologies: ["Laravel", "React", "PayPal API"],
    category: "E-commerce"
  },
  {
    title: "To Do App",
    description: "Application de gestion de tâches permettant de créer, catégoriser (priorités, dates) et assigner des tâches à un ou plusieurs utilisateurs.",
    technologies: ["Laravel", "Vue.js", "MySQL"],
    category: "Productivity"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">Projets</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{project.category}</Badge>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="text-sm mt-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
