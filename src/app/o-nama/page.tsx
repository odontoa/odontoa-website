'use client';

import { Button } from "@/components/ui/button";
import { 
  Users, 
  Heart, 
  ShieldCheck, 
  BrainCircuit, 
  GraduationCap, 
  BadgeCheck, 
  Linkedin, 
  Github, 
  Mail, 
  ArrowRight, 
  Calendar,
  User,
  Zap,
  Globe,
  Code,
  Shield,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { DemoForm } from "@/components/DemoForm";
import { Hero } from "@/components/ui/hero-with-group-of-images-text-and-two-buttons";
import OdontoaMissionSection from "@/components/ui/mission-section";


export default function AboutPage() {

  return (
    <div className="min-h-screen bg-background w-full pt-20">
      {/* Hero Section - Full Width */}
      <section className="w-full relative overflow-hidden">
        <Hero />
      </section>

      {/* Mission Section */}
      <OdontoaMissionSection />

      {/* Values Section */}
      <section className="section-spacing">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl font-normal leading-tight sm:text-5xl sm:leading-tight text-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Vrednosti iza kojih stojimo
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Svako rešenje u Odontoa platformi osmišljeno je da pomogne stomatolozima u svakodnevnom radu i unapredi iskustvo pacijenata.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              {
                icon: Heart,
                title: "Podrška doktorima",
                description: "Naš sistem je osmišljen da olakša svakodnevni rad stomatologa i osoblja, smanji administraciju i omogući više vremena za pacijente."
              },
              {
                icon: ShieldCheck,
                title: "Sigurnost podataka",
                description: "Najviši standardi zaštite medicinskih podataka i privatnosti - jer poverenje je temelj svake prakse."
              },
              {
                icon: BrainCircuit,
                title: "Inovacije",
                description: "Kontinuirano unapređujemo tehnologiju kako bi stomatološke ordinacije uvek imale najmodernija rešenja."
              },
              {
                icon: GraduationCap,
                title: "Stručnost",
                description: "Naš tim čine stručnjaci iz stomatologije i informacionih tehnologija - spoj prakse i inovacija."
              },
              {
                icon: Users,
                title: "Timski rad",
                description: "Verujemo u saradnju sa stomatolozima iz celog regiona i zajedničko kreiranje rešenja koja donose stvarnu vrednost."
              },
              {
                icon: BadgeCheck,
                title: "Kvalitet",
                description: "Ne kompromitujemo kvalitet - svako rešenje mora biti najbolje moguće"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl bg-card border border-border p-4 hover:bg-card/80 transition-colors duration-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="bg-primary/10 rounded-lg p-2 w-fit mb-4">
                  <item.icon className="text-primary stroke-[1.5]" size={24} />
                </div>
                <h3 className="text-lg font-normal text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl font-normal leading-tight sm:text-5xl sm:leading-tight text-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Tim koji razvija Odontoa
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Stručnjaci iz stomatologije i tehnologije okupljeni oko jedne misije - unapređenja rada ordinacija u regionu.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Ognjen Drinić */}
            <motion.div 
              className="rounded-xl bg-card p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 mx-auto">
                <img 
                  src="/odontoa-team/ognjen drinic.jpeg" 
                  alt="Ognjen Drinić" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-normal text-foreground mb-1">Ognjen Drinić</h3>
              <p className="text-primary font-normal mb-3 text-sm">Co-Founder & Chief Strategist</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Vizija i strategija Odontoa platforme.
              </p>
              <div className="flex justify-center gap-2">
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Linkedin className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Mail className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </motion.div>

            {/* Bojan Antović */}
            <motion.div 
              className="rounded-xl bg-card p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 mx-auto">
                <img 
                  src="/odontoa-team/bojan antovic.jpeg" 
                  alt="Bojan Antović" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-normal text-foreground mb-1">Bojan Antović</h3>
              <p className="text-primary font-normal mb-3 text-sm">Co-Founder & Head of Sales</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Prodaja i razvoj partnerskih odnosa.
              </p>
              <div className="flex justify-center gap-2">
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Linkedin className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Mail className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </motion.div>

            {/* Petar Kovačević */}
            <motion.div 
              className="rounded-xl bg-card p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 mx-auto">
                <img 
                  src="/odontoa-team/petar kovacevic.jpeg" 
                  alt="Petar Kovačević" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-normal text-foreground mb-1">Petar Kovačević</h3>
              <p className="text-primary font-normal mb-3 text-sm">CTO</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Tehnologija, inovacije i kvalitet sistema.
              </p>
              <div className="flex justify-center gap-2">
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Linkedin className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Github className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </motion.div>

            {/* Uroš Simeunović */}
            <motion.div 
              className="rounded-xl bg-card p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 mx-auto">
                <img 
                  src="/odontoa-team/uros simeunovic.jpeg" 
                  alt="Uroš Simeunović" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-normal text-foreground mb-1">Uroš Simeunović</h3>
              <p className="text-primary font-normal mb-3 text-sm">Software Engineer</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Sigurnost podataka i performanse aplikacije.
              </p>
              <div className="flex justify-center gap-2">
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Github className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Linkedin className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </motion.div>

            {/* Aleksa Kovačević */}
            <motion.div 
              className="rounded-xl bg-card p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 mx-auto bg-muted flex items-center justify-center">
                <User className="text-muted-foreground" size={28} />
              </div>
              <h3 className="text-lg font-normal text-foreground mb-1">Aleksa Kovačević</h3>
              <p className="text-primary font-normal mb-3 text-sm">Software Engineer</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Razvoj stabilnih i skalabilnih rešenja.
              </p>
              <div className="flex justify-center gap-2">
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Github className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Linkedin className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing w-full px-6 bg-background">
        <div className="max-w-screen-xl mx-auto">
          {/* Glassmorphism Container */}
          <motion.div 
            className="bg-card/40 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 bg-clip-border relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated Grid Pattern Background */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatedGridPattern
                numSquares={18}
                maxOpacity={0.04}
                duration={12}
                repeatDelay={6}
                width={60}
                height={60}
                className={cn(
                  "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                  "opacity-50",
                )}
              />
            </div>
            
            {/* CTA content */}
            <div className="text-center relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Spremni da digitalizujete ordinaciju?<br />
                <span className="text-primary">Start za 5 minuta.</span>
              </motion.h2>

              <motion.p 
                className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Zakažite demo i saznajte kako da automatizujete zakazivanja, smanjite broj propuštenih termina i uštedite 10+ sati nedeljno. Sve to bez komplikovane obuke.
              </motion.p>

              {/* Contact Form */}
              <motion.div 
                className="max-w-md mx-auto mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <DemoForm 
                  title="Zakažite demo"
                  description="Kontaktirajte nas za besplatan demo Odontoa sistema"
                  buttonText="Zakaži demo"
                />
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Demo traje 15 minuta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Bez obaveze</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Odmah dostupan</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 