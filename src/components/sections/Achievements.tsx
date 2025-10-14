import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, GraduationCap, Users } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Top 3 Hackathon Za@Geek",
    description: "Mené notre équipe à la victoire du hackathon de codage en développant une plateforme pour le startup BusNay.",
    color: "text-yellow-500"
  },
  {
    icon: Award,
    title: "Formation Architecture Logiciel",
    description: "Approfondi les différentes architectures logicielles (FSD, Hexagonal, etc.) et leurs applications pratiques.",
    color: "text-blue-500"
  },
  {
    icon: GraduationCap,
    title: "Setup Instance EC2 AWS",
    description: "Configuration d'un serveur AWS avec AMI, groupes de sécurité et volumes EBS.",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "Formateur PHP",
    description: "Formateur dans une formation PHP organisée par la MiSA. Discussion et pratique des paradigmes de programmation comme le POO.",
    color: "text-purple-500"
  }
];

export function Achievements() {
  return (
    <section id="achievements" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">Réalisations</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className={`h-6 w-6 ${achievement.color}`} />
                  </div>
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {achievement.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
