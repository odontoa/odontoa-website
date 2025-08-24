import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-xl border-t font-sans",
        "bg-gradient-to-b from-gray-50 to-white",
        "border-gray-200",
        "p-4 text-start sm:p-6",
        "hover:from-gray-100 hover:to-gray-50",
        "w-[300px] sm:w-[320px] flex-shrink-0",
        "transition-colors duration-300",
        "shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-sm font-normal leading-none text-gray-900">
            {author.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-gray-700 leading-relaxed">
        {text}
      </p>
    </Card>
  )
} 