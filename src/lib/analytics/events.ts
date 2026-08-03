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
  quizStart: () => {
    trackEvent('quiz_start', {
      source: 'digital_readiness_tool',
      page_path:
        typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  },
  quizQuestionAnswered: (questionNumber: number, questionId: string) => {
    trackEvent('quiz_question_answered', {
      source: 'digital_readiness_tool',
      question_number: questionNumber,
      question_id: questionId,
    });
  },
  quizComplete: (params: {
    totalScore: number;
    band: string;
    profile: string;
    weakestCategory?: string;
  }) => {
    trackEvent('quiz_complete', {
      source: 'digital_readiness_tool',
      score: params.totalScore,
      score_band: params.band,
      profile: params.profile,
      weakest_category: params.weakestCategory,
    });
  },
  quizCtaClick: (ctaId: string, href: string, score?: number) => {
    trackEvent('quiz_cta_click', {
      source: 'digital_readiness_tool',
      cta_id: ctaId,
      href,
      score,
    });
  },
  quizEmailCapture: (score: number, profile: string) => {
    trackEvent('quiz_email_capture', {
      source: 'digital_readiness_tool',
      score,
      profile,
    });
  },
  toolStart: (tool: string) => {
    trackEvent('tool_start', { tool });
  },
  toolComplete: (tool: string, extra?: Record<string, unknown>) => {
    trackEvent('tool_complete', { tool, ...extra });
  },
  toolCtaClick: (tool: string, href: string) => {
    trackEvent('tool_cta_click', { tool, href });
  },
};
