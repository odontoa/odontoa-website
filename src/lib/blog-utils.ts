/**
 * Extract plain text from Sanity Portable Text content
 * Used for reading time calculation
 */
export function extractPlainTextFromContent(content: any[] | undefined | null): string {
  if (!content || !Array.isArray(content)) {
    return "";
  }

  const extractText = (node: any): string => {
    if (typeof node === "string") {
      return node;
    }

    if (node._type === "block") {
      // Extract text from block children
      if (node.children && Array.isArray(node.children)) {
        return node.children.map((child: any) => extractText(child)).join("");
      }
    }

    if (node.children && Array.isArray(node.children)) {
      return node.children.map((child: any) => extractText(child)).join(" ");
    }

    if (node.text) {
      return node.text;
    }

    return "";
  };

  return content.map((block) => extractText(block)).join(" ").trim();
}

/**
 * Calculate reading time in minutes from word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: any[] | undefined | null): number {
  const text = extractPlainTextFromContent(content);
  
  if (!text) {
    return 1; // Minimum 1 minute
  }

  // Count words (split by whitespace and filter empty strings)
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Calculate minutes (200 words per minute)
  const minutes = Math.ceil(wordCount / 200);

  // Return at least 1 minute
  return Math.max(1, minutes);
}
