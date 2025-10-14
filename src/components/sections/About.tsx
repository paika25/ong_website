import { Card, CardContent } from "@/components/ui/card";
import { Code2, Briefcase, Award } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">À propos</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
        
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground mb-12 text-center leading-relaxed">
            Ayant travaillé plus de 3 ans dans le monde du développement web, j'ai développé des compétences 
            solides dans divers langages de programmation. Je suis passionné par les modèles de conception 
            et d'architectures logiciels visant l'équilibre entre la productivité et la qualité des produits 
            livrables. Je suis toujours à la recherche de nouveaux défis techniques et je n'hésite pas à 
            repousser les limites.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3+ Ans</h3>
                <p className="text-sm text-muted-foreground">d'expérience en développement</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">FullStack</h3>
                <p className="text-sm text-muted-foreground">Laravel, Vue.js, React</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Top 3</h3>
                <p className="text-sm text-muted-foreground">Hackathon Za@Geek</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
