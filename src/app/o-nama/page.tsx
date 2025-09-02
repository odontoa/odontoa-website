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


export default function AboutPage() {

  return (
    <div className="min-h-screen bg-background w-full pt-20">
      {/* Hero Section - Full Width */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>
        </div>
        
        {/* Content container with max-width for readability */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text content */}
            <motion.div 
              className="text-center lg:text-left space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-normal text-foreground leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Zašto postoji Odontoa?
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Od digitalnog kalendara do sigurnog vođenja kartona – razvili smo platformu koja stomatolozima štedi vreme i donosi više fokusa na pacijente.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                  <Button className="rounded-xl px-6 text-base text-white h-14">
                    Kontaktiraj nas
                    <ArrowRight className="ml-2 h-4 w-4 text-white" />
                  </Button>
                </div>
                <Button variant="outline" className="rounded-xl px-6 h-14">
                  Saznaj više
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side - Tooth Icon as Background Cover */}
            <motion.div 
              className="relative group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Tooth Icon as Background Cover */}
              <div className="relative w-full h-64 rounded-3xl overflow-hidden flex items-center justify-center">
                <img 
                  src="/images/Odontoa - logo pack/Icon_color.png" 
                  alt="Odontoa Tooth Icon Background" 
                  className="w-72 h-72 object-contain opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing border-t border-border">
        <div className="max-w-screen-xl mx-auto">
          <div className="md:flex md:flex-row items-center justify-between gap-10">
            <motion.div 
              className="relative group md:w-[40%] mt-10 md:mt-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img 
                src="/images/2dentists-smiling.jpg" 
                alt="Stomatolozi u Odontoa sistemu" 
                className="relative rounded-3xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent rounded-3xl"></div>
            </motion.div>
            <motion.div 
              className="space-y-8 md:w-[60%]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-4">
                <motion.h2 
                  className="text-3xl font-normal leading-tight sm:text-5xl sm:leading-tight text-foreground"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  Naša misija
                </motion.h2>
              </div>
              <motion.p 
                className="text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Verujemo da stomatološke prakse zaslužuju tehnologiju koja oslobađa tim od administracije i daje više vremena za ono što je najvažnije – pacijente.
              </motion.p>
              <motion.p 
                className="text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Kroz digitalizaciju procesa unapređujemo kvalitet rada ordinacija u regionu i činimo savremene usluge dostupnijim većem broju pacijenata.
              </motion.p>
              
              <motion.div 
                className="space-y-3 pt-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-lg font-normal text-foreground">Šta radimo za doktore:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Automatizujemo zakazivanja i smanjujemo propuštene termine</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Digitalizujemo kartone sa najvišim standardima sigurnosti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Pojednostavljujemo fakturisanje i finansije</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Štedimo 10+ sati nedeljno na administraciji</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                  <Button className="rounded-xl px-5 text-base text-white h-12">
                    Kontaktiraj nas
                    <ArrowRight className="ml-2 h-4 w-4 text-white" />
                  </Button>
                </div>
                <Button variant="outline" className="rounded-xl px-5 h-12">
                  Saznaj više
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing border-t border-border">
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