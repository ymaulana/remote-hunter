export const KEYWORDS = [
  // Tech (Major)
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Data Science",
  // Design & Creative
  "Design",
  "UI/UX",
  "Figma",
  "Writing",
  "Copywriting",
  // Business & Operations
  "Marketing",
  "Sales",
  "Support",
  "Customer Application",
  "Product",
  "Finance",
  "Accounting",
  "HR",
  "Operations",
  "Legal",
  "Management",
];

export function cleanTags(tags: string[]): string[] {
  if (!tags) return [];
  return tags.filter((tag) => {
    const lower = tag.toLowerCase();
    // Remove relative time (e.g., "7 days ago")
    if (lower.includes("ago") || lower.includes("posted")) return false;
    // Remove salary info (e.g., "$100k a year", "140k", contains currency symbols)
    if (lower.match(/[\$€£¥]/) || lower.match(/\d+k/)) return false;
    return true;
  });
}

export function extractKeywords(description: string): string[] {
  if (!description) return [];
  const foundTags: Set<string> = new Set();
  const lowerDesc = description.toLowerCase();

  KEYWORDS.forEach((keyword) => {
    // simple word boundary check to avoid partial matches like "Go" in "Google"
    // expanding this regex for robust matching
    // escaping special chars in keyword for regex
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedKeyword.toLowerCase()}\\b`, "i");
    
    // Special handling for some keywords that might not match word boundaries well or have common variations
    if (keyword === "C++") {
        if (lowerDesc.includes("c++")) foundTags.add(keyword);
    } else if (keyword === "C#") {
         if (lowerDesc.includes("c#")) foundTags.add(keyword);
    } else if (keyword === ".NET") {
         if (lowerDesc.includes(".net")) foundTags.add(keyword);
    } else if (keyword === "Node.js") {
         if (lowerDesc.includes("node.js") || lowerDesc.includes("nodejs")) foundTags.add(keyword);
    } else {
        if (regex.test(lowerDesc)) {
            foundTags.add(keyword);
        }
    }
  });

  return Array.from(foundTags);
}
