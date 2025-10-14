import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Téléphone",
    value: "+261 34 99 48 684",
    href: "tel:+261349948684"
  },
  {
    icon: Mail,
    label: "Email",
    value: "Contactez-moi",
    href: "mailto:marius@example.com"
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Antananarivo, Madagascar"
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Voir mon profil",
    href: "https://www.linkedin.com/in/razafitsalama-marius-08517b227/"
  },
  {
    icon: ExternalLink,
    label: "Portfolio",
    value: "01marius10-portfolio.netlify.app",
    href: "https://01marius10-portfolio.netlify.app"
  }
];

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">Contact</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        {item.href ? (
                          <a 
                            href={item.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-foreground font-medium hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-8 border-t text-center">
                <p className="text-muted-foreground mb-4">Prêt à collaborer sur votre prochain projet ?</p>
                <Button size="lg" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Envoyez-moi un message
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              NIF: 5018377557 | STAT: 70209 11 2023 0 08425
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
