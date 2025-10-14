import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar } from "lucide-react";

const experiences = [
  {
    title: "FullStack Developer",
    company: "Mahafaka",
    location: "Antananarivo, Madagascar",
    period: "02/2025 - Présent",
    technologies: ["Laravel", "Vue.js", "AWS", "CI/CD"],
    achievements: [
      "Administration et configuration complète de serveurs (sécurité, performance, supervision)",
      "Automatisation des déploiements via GitHub Actions (CI/CD)",
      "Conception d'architectures backend orientées services (SOA), avec une couche BFF dédiée aux clients mobiles (Flutter) et web (Vue 3)",
      "Conception et optimisation de bases de données relationnelles",
      "Implémentation flexible des règles métiers"
    ]
  },
  {
    title: "FullStack Developer",
    company: "JejeLivraison",
    location: "Mamoutzou, Mayotte",
    period: "11/2023 - Présent",
    technologies: ["Laravel", "React", "PayPal"],
    achievements: [
      "Développement d'une plateforme de commande et de livraison en ligne",
      "Intégration de paiements en ligne (PayPal) avec gestion des transactions",
      "Mise en place d'un système de notes et commentaires pour les livreurs et restaurants",
      "Intégration et configuration d'imprimantes thermiques sous Windows",
      "Création d'une fonctionnalité HideZone : définition de zones géographiques"
    ]
  },
  {
    title: "FullStack Developer",
    company: "The 23creative",
    location: "Antananarivo, Madagascar",
    period: "07/2022 - 02/2023",
    technologies: ["Laravel", "Vue.js"],
    achievements: [
      "Développement d'outils pour Huissier et Prestataires de services",
      "Mise en place d'architectures scalables",
      "Collaboration avec équipes multidisciplinaires"
    ]
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">Expérience</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
        
        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{exp.title}</CardTitle>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {exp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {exp.period}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
