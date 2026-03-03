import { marked } from "marked";

export function markdownToHtml(content: string) {
  return marked.parse(content, { async: false }) as string;
}
