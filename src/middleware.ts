import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for canonical domain redirects and optional coming_soon mode.
 *
 * Coming_soon (SITE_MODE=coming_soon): all routes redirect 302 to "/" except allowlist.
 * Default: www → non-www (301), http → https (301).
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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

  // Redirect www to non-www
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '')
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }
  
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
