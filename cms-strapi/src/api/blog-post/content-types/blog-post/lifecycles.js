'use strict';

/**
 * blog-post lifecycle callbacks
 */

module.exports = {
  // Called before an entry is created
  async beforeCreate(event) {
    const { data } = event.params;
    
    // TODO: Pri svakom create/update automatski generiši seo_schema polje prema standardu WebPage + BreadcrumbList + Article + FAQPage, sa jezikom 'sr'
    // Implementation needed:
    // 1. Generate WebPage schema with basic page information
    // 2. Generate BreadcrumbList for navigation structure
    // 3. Generate Article schema with blog post content
    // 4. Generate FAQPage schema from faq component data
    // 5. Combine all schemas into single JSON-LD structure
    // 6. Set language to 'sr' (Serbian)
    
    // Set current timestamp for datePublished if not provided
    if (!data.datePublished) {
      data.datePublished = new Date().toISOString();
    }
    
    // Set dateModified to current timestamp
    data.dateModified = new Date().toISOString();
  },

  // Called before an entry is updated
  async beforeUpdate(event) {
    const { data } = event.params;
    
    // TODO: Pri svakom create/update automatski generiši seo_schema polje prema standardu WebPage + BreadcrumbList + Article + FAQPage, sa jezikom 'sr'
    // Same implementation as beforeCreate but for updates
    
    // Update dateModified to current timestamp
    data.dateModified = new Date().toISOString();
  },

  // Called after an entry is created
  async afterCreate(event) {
    const { result } = event;
    
    // TODO: After SEO schema generation, trigger any additional post-processing
    console.log('Blog post created:', result.id);
  },

  // Called after an entry is updated
  async afterUpdate(event) {
    const { result } = event;
    
    // TODO: After SEO schema generation, trigger any additional post-processing
    console.log('Blog post updated:', result.id);
  }
};
