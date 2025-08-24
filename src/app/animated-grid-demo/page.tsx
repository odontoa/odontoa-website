import { AnimatedGridPatternDemo } from "@/components/ui/animated-grid-pattern-demo";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function AnimatedGridDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Animated Grid Pattern Demo</h1>
          <p className="text-muted-foreground text-lg font-light">
            Različiti stilovi i konfiguracije animated grid pattern-a
          </p>
        </div>

        {/* Demo 1: Basic Demo */}
        <div>
          <h2 className="text-2xl font-light mb-6">1. Osnovni Demo</h2>
          <AnimatedGridPatternDemo />
        </div>

        {/* Demo 2: Hero Style */}
        <div>
          <h2 className="text-2xl font-light mb-6">2. Hero Section Stil</h2>
          <div className="relative h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center z-10">
                <h3 className="text-3xl font-light mb-4">Hero Section</h3>
                <p className="text-lg text-muted-foreground font-light">Suptilni background efekat</p>
              </div>
            </div>
            <AnimatedGridPattern
              numSquares={20}
              maxOpacity={0.03}
              duration={6}
              repeatDelay={2}
              width={60}
              height={60}
              className={cn(
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "opacity-40",
              )}
            />
          </div>
        </div>

        {/* Demo 3: Feature Section Style */}
        <div>
          <h2 className="text-2xl font-light mb-6">3. Feature Section Stil</h2>
          <div className="relative bg-white rounded-2xl p-12 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-light mb-2">Feature 1</h4>
                <p className="text-muted-foreground font-light">Opis funkcionalnosti</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-light mb-2">Feature 2</h4>
                <p className="text-muted-foreground font-light">Opis funkcionalnosti</p>
              </div>
            </div>
            <AnimatedGridPattern
              numSquares={25}
              maxOpacity={0.025}
              duration={10}
              repeatDelay={4}
              width={70}
              height={70}
              className={cn(
                "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
                "opacity-30",
              )}
            />
          </div>
        </div>

        {/* Demo 4: CTA Section Style */}
        <div>
          <h2 className="text-2xl font-light mb-6">4. CTA Section Stil</h2>
          <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 border">
            <div className="text-center relative z-10">
              <h3 className="text-3xl font-light mb-4">Zakaži Demo</h3>
              <p className="text-lg text-muted-foreground mb-8 font-light">
                Spremni da digitalizujete ordinaciju?
              </p>
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-light">
                Kontaktiraj nas
              </button>
            </div>
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
        </div>

        {/* Demo 5: Dashboard Style */}
        <div>
          <h2 className="text-2xl font-light mb-6">5. Dashboard Stil</h2>
          <div className="relative bg-card rounded-3xl overflow-hidden border">
            <div className="p-8 relative z-10">
              <h3 className="text-2xl font-light mb-4">Dashboard Pregled</h3>
              <p className="text-muted-foreground mb-6 font-light">
                Kompletan pregled rada ordinacije u realnom vremenu
              </p>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <span className="text-muted-foreground font-light">Dashboard Screenshot</span>
              </div>
            </div>
            <AnimatedGridPattern
              numSquares={12}
              maxOpacity={0.06}
              duration={15}
              repeatDelay={8}
              width={100}
              height={100}
              className={cn(
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "opacity-40",
              )}
            />
          </div>
        </div>

        {/* Demo 6: Intense Style */}
        <div>
          <h2 className="text-2xl font-light mb-6">6. Intenzivni Stil</h2>
          <div className="relative bg-black text-white rounded-2xl p-12 overflow-hidden">
            <div className="text-center relative z-10">
              <h3 className="text-3xl font-light mb-4">Tech Vibes</h3>
              <p className="text-gray-300 font-light">Više vidljivih animacija</p>
            </div>
            <AnimatedGridPattern
              numSquares={40}
              maxOpacity={0.15}
              duration={4}
              repeatDelay={1}
              width={40}
              height={40}
              className="fill-white/20 stroke-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 