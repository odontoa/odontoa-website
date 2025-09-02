import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Calendar, 
  Phone, 
  Mail, 
  MessageCircle,
  Zap,
  Star,
  Users
} from 'lucide-react'
import Link from 'next/link'

interface CTABlockProps {
  type: 'blog' | 'glossary'
  data: {
    title?: string
    term?: string
    slug: string
  }
  variant?: 'default' | 'outline' | 'gradient'
  className?: string
}

export const CTABlock: React.FC<CTABlockProps> = ({ 
  type, 
  data, 
  variant = 'default',
  className = ''
}) => {
  const getCTAContent = () => {
    if (type === 'blog') {
      return {
        title: "Organizovana ordinacija počinje ovde.",
        description: "",
        buttonText: "Saznaj kako",
        buttonUrl: `/kontakt?source=blog&slug=${data.slug}`,
        icon: Calendar,
        features: []
      }
    } else {
      return {
        title: "Potrebna vam je pomoć oko ovog termina?",
        description: "Naš tim je tu da vam objasni sve detalje i pomogne u implementaciji.",
        buttonText: "Kontaktirajte nas",
        buttonUrl: `/kontakt?source=glossary&term=${data.slug}`,
        icon: MessageCircle,
        features: [
          "Stručna podrška",
          "Detaljna objašnjenja",
          "Praktični saveti"
        ]
      }
    }
  }

  const content = getCTAContent()
  const IconComponent = content.icon

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-card/40 backdrop-blur-sm border border-gray-200 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 bg-clip-border'
      case 'outline':
        return 'bg-white border-2 border-blue-200 text-blue-900'
      default:
        return 'bg-blue-50 border border-blue-200 text-blue-900'
    }
  }

  const getButtonVariant = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-white text-blue-600 hover:bg-gray-100'
      case 'outline':
        return 'bg-blue-600 text-white hover:bg-blue-700'
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700'
    }
  }

  return (
    <Card className={`${getVariantStyles()} ${variant === 'gradient' && type === 'blog' ? 'shadow-2xl overflow-hidden relative' : ''} ${className}`}>
      <CardContent className={variant === 'gradient' && type === 'blog' ? 'p-8 md:p-12' : 'p-6'}>
        {variant === 'gradient' && type === 'blog' ? (
          // Middle CTA style for blog gradient variant
          <div className="text-center relative z-10">
            <h3 className="text-3xl font-normal mb-8 text-foreground">
              {content.title}
            </h3>
            <div className="flex justify-center">
              <Link href={content.buttonUrl}>
                <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                  {content.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Original layout for other variants
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  variant === 'gradient' ? 'bg-white/20' : 'bg-blue-100'
                }`}>
                  <IconComponent className={`h-5 w-5 ${
                    variant === 'gradient' ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-normal">{content.title}</h3>
                  <p className="text-sm opacity-80 mt-1">{content.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {content.features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant={variant === 'gradient' ? 'secondary' : 'outline'}
                    className={`${
                      variant === 'gradient' 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Link href={content.buttonUrl}>
                <Button 
                  size="lg" 
                  className={`${getButtonVariant()} px-8 py-3 font-medium`}
                >
                  {content.buttonText}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-sm opacity-70">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>500+ ordinacija</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span>24/7 podrška</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Alternative CTA for lead magnets
export const LeadMagnetCTA: React.FC<{
  title: string
  description: string
  offer: string
  className?: string
}> = ({ title, description, offer, className = '' }) => {
  return (
    <Card className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 ${className}`}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="p-3 bg-white/20 rounded-full w-fit mx-auto">
            <Mail className="h-6 w-6 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm opacity-90 mt-1">{description}</p>
          </div>

          <div className="bg-white/20 rounded-lg p-4">
            <p className="font-semibold">{offer}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 font-semibold"
            >
              Preuzmite besplatno
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
            >
              Saznajte više
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// CTA for consultation booking
export const ConsultationCTA: React.FC<{
  urgency?: boolean
  className?: string
}> = ({ urgency = false, className = '' }) => {
  return (
    <Card className={`bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {urgency ? "Hitna konsultacija potrebna?" : "Potrebna vam je konsultacija?"}
                </h3>
                <p className="text-sm opacity-90">
                  Naš tim stručnjaka je tu da vam pomogne
                </p>
              </div>
            </div>

            {urgency && (
              <div className="flex items-center gap-2 text-sm">
                <div className="animate-pulse bg-white/20 px-2 py-1 rounded">
                  🔥 OGRANIČENO VREME
                </div>
                <span>Besplatna konsultacija samo danas</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/kontakt?type=consultation">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 font-semibold"
              >
                Zakažite konsultaciju
                <Calendar className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <div className="text-center text-sm opacity-80">
              <p>✓ Besplatno</p>
              <p>✓ Bez obaveza</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 