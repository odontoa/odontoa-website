import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for canonical domain redirects
 * 
 * This ensures:
 * - www.odontoa.com → odontoa.com (301)
 * - http → https (301)
 * 
 * Note: Vercel typically handles these automatically, but this middleware
 * provides a fallback for other hosting platforms or edge cases.
 */
export function middleware(request: NextRequest) {
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
