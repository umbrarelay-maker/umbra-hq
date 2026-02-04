import { marked } from 'marked';

// Configure marked for clean output
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  // Check if content is already HTML (starts with a tag)
  if (markdown.trim().startsWith('<')) {
    return markdown;
  }
  
  return marked.parse(markdown) as string;
}

export function isMarkdown(content: string): boolean {
  if (!content) return false;
  
  // Simple heuristics to detect markdown
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headers
    /\*\*[^*]+\*\*/,        // Bold
    /\*[^*]+\*/,            // Italic
    /^[-*+]\s/m,            // Unordered lists
    /^\d+\.\s/m,            // Ordered lists
    /```[\s\S]*```/,        // Code blocks
    /^>\s/m,                // Blockquotes
    /\[.+\]\(.+\)/,         // Links
    /^---$/m,               // Horizontal rules
  ];
  
  return markdownPatterns.some(pattern => pattern.test(content));
}
