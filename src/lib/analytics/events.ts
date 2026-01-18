/**
 * Analytics event tracking helper functions
 * Uses GA4 gtag for event tracking
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

/**
 * Generic event tracking function
 */
export function trackEvent(
  eventName: string,
  params?: {
    page_path?: string;
    cta_id?: string;
    label?: string;
    [key: string]: any;
  }
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Specific event helpers for common actions
 */
export const analytics = {
  ctaClick: (ctaId: string, label: string, pagePath?: string) => {
    trackEvent('cta_click', {
      cta_id: ctaId,
      label,
      page_path: pagePath || window.location.pathname,
    });
  },
  contactFormSubmit: (pagePath?: string) => {
    trackEvent('contact_form_submit', {
      page_path: pagePath || window.location.pathname,
    });
  },
  demoRequest: (pagePath?: string) => {
    trackEvent('demo_request', {
      page_path: pagePath || window.location.pathname,
    });
  },
  blogView: (slug: string, title: string) => {
    trackEvent('blog_view', {
      blog_slug: slug,
      blog_title: title,
      page_path: `/blogovi/${slug}`,
    });
  },
  glossaryView: (slug: string, term: string) => {
    trackEvent('glossary_view', {
      glossary_slug: slug,
      term,
      page_path: `/recnik/${slug}`,
    });
  },
};
