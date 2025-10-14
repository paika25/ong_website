import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

const education = [
  {
    degree: "Licence en Informatiques",
    institution: "MISA - Université d'Antananarivo",
    location: "Antananarivo, Madagascar",
    period: "03/2018 - 06/2022"
  },
  {
    degree: "Baccalauréat Série C",
    institution: "Lycée",
    location: "Madagascar",
    period: "Avant 2018"
  }
];

export function Education() {
  return (
    <section id="education" className="py-20">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">Formation</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
        
        <div className="max-w-3xl mx-auto space-y-6">
          {education.map((edu, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{edu.degree}</CardTitle>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium">{edu.institution}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {edu.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {edu.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
