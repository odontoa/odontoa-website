import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-background text-foreground font-sans",
      "py-12 sm:py-24 md:py-32 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-normal leading-tight sm:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-normal text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-4 [--gap:2rem] [gap:var(--gap)] flex-row [--duration:203s] max-w-6xl mx-auto">
            <div className="flex shrink-0 [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused] [animation-iteration-count:infinite]">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`first-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`second-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`third-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`fourth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`fifth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`sixth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`seventh-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`eighth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`ninth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`tenth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`eleventh-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`twelfth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`thirteenth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`fourteenth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`fifteenth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`sixteenth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`seventeenth-${i}`}
                  {...testimonial}
                />
              ))}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`eighteenth-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-background via-background/90 to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-background via-background/90 to-transparent sm:block" />
        </div>
      </div>
    </section>
  )
} 