import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const skillCategories = [
  {
    category: "Backend",
    skills: ["PHP", "Laravel", "Node.js", "MySQL", "PostgreSQL", "REST API", "GraphQL"]
  },
  {
    category: "Frontend",
    skills: ["JavaScript", "TypeScript", "Vue.js", "React", "Inertia.js", "Tailwind CSS", "HTML/CSS"]
  },
  {
    category: "DevOps & Tools",
    skills: ["Git", "GitHub Actions", "CI/CD", "AWS EC2", "Docker", "Linux Server"]
  },
  {
    category: "Mobile",
    skills: ["Flutter", "BFF Architecture"]
  },
  {
    category: "Autres",
    skills: ["Architecture Logicielle", "SOA", "Design Patterns", "Agile/Scrum"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">Compétences</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
        
        <div className="max-w-5xl mx-auto space-y-6">
          {skillCategories.map((category, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
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
