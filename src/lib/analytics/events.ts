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

export type GlossaryEventContext = {
  /** Stabilan id pojma (RecnikTerm.id). */
  contentId: string;
  /** medicalCanonicalTerm. */
  glossaryTerm: string;
  seoEntryTerm?: string;
  glossaryCluster?: string;
  categoryId: string;
  pagePath: string;
};

export type GlossaryLinkType = 'glossary_term' | 'blog_post' | 'feature_page' | 'landing_page';

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
  /* Uz postojeci custom event salje se i GA4 recommended generate_lead (konverzija). */
  contactFormSubmit: (pagePath?: string) => {
    const page_path = pagePath || window.location.pathname;
    trackEvent('contact_form_submit', { page_path });
    trackEvent('generate_lead', { lead_source: 'contact_form', page_path });
  },
  demoRequest: (pagePath?: string) => {
    const page_path = pagePath || window.location.pathname;
    trackEvent('demo_request', { page_path });
    trackEvent('generate_lead', { lead_source: 'demo_request', page_path });
  },
  blogView: (slug: string, title: string) => {
    trackEvent('blog_view', {
      blog_slug: slug,
      blog_title: title,
      page_path: `/blogovi/${slug}`,
    });
  },
  /* Recnik. Parametri su opisani u docs/ANALYTICS_GLOSSARY_SETUP.md:
     glossary_term je stabilan pojam (medicalCanonicalTerm), seo_entry_term javni izraz. */
  glossaryView: (params: GlossaryEventContext) => {
    trackEvent('glossary_view', {
      page_type: 'glossary',
      content_id: params.contentId,
      glossary_term: params.glossaryTerm,
      seo_entry_term: params.seoEntryTerm,
      glossary_cluster: params.glossaryCluster,
      category_id: params.categoryId,
      page_path: params.pagePath,
    });
  },
  /* Klik sa stranice pojma na drugi sadrzaj (GA4 recommended select_content). */
  glossarySelectContent: (params: {
    contentType: GlossaryLinkType;
    contentId: string;
    linkUrl: string;
    sourceGlossaryTerm: string;
    sourceContentId: string;
  }) => {
    trackEvent('select_content', {
      page_type: 'glossary',
      content_type: params.contentType,
      content_id: params.contentId,
      link_url: params.linkUrl,
      source_glossary_term: params.sourceGlossaryTerm,
      source_content_id: params.sourceContentId,
    });
  },
  glossaryCtaClick: (params: {
    ctaName: string;
    linkUrl: string;
    sourceGlossaryTerm: string;
    sourceContentId: string;
  }) => {
    trackEvent('cta_click', {
      page_type: 'glossary',
      cta_name: params.ctaName,
      link_url: params.linkUrl,
      source_glossary_term: params.sourceGlossaryTerm,
      source_content_id: params.sourceContentId,
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
