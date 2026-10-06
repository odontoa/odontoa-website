import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { HIDDEN_SECTIONS } from '@/lib/config/hidden-sections'

/**
 * Middleware for optional coming_soon mode and http → https redirect.
 *
 * Coming_soon (SITE_MODE=coming_soon): all routes redirect 302 to "/" except allowlist.
 * Default: http → https (301) in production. Canonical domain (www vs apex) is handled by Vercel Domain settings.
 */
/* Rute koje u produkciji nisu javne: interni alati (ui-lab, capture stranice, Sanity Studio)
   i sekcije sakrivene do content launcha (blog, recnik, o nama: src/lib/config/hidden-sections.ts).
   U developmentu ostaju dostupne. Na preview deploy-u mogu da se ukljuce sa
   ENABLE_INTERNAL_ROUTES=true. Kod i sadrzaj se ne brisu. */
const HIDDEN_IN_PRODUCTION = [...HIDDEN_SECTIONS, '/ui-lab', '/dashboard-capture', '/demo-hero', '/studio']

function isHiddenInProduction(pathname: string) {
  return HIDDEN_IN_PRODUCTION.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.ENABLE_INTERNAL_ROUTES !== 'true' &&
    isHiddenInProduction(pathname)
  ) {
    // Rewrite na nepostojecu putanju: Next vraca standardnu 404 stranicu sa statusom 404.
    const response = NextResponse.rewrite(new URL('/__hidden', request.url))
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  if (process.env.SITE_MODE === 'coming_soon') {
    const allowed =
      pathname === '/' ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname === '/favicon.ico' ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/assets') ||
      ['/privacy', '/contact', '/politika-privatnosti', '/kontakt'].includes(pathname)
    if (!allowed) {
      return NextResponse.redirect(new URL('/', request.url), 302)
    }
  }

  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Redirect http to https (only in production)
  // In development, allow http for local testing
  if (
    request.nextUrl.protocol === 'http:' &&
    process.env.NODE_ENV === 'production' &&
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1')
  ) {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, llms.txt (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt).*)',
  ],
}
