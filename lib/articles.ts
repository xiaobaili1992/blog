import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";

export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

export type ArticleDetail = ArticleMeta & {
  content: string;
};

const articlesDirectory = path.join(process.cwd(), "articles");

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/^>\s+/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content: string): string {
  const plain = stripMarkdown(content);
  if (!plain) {
    return "暂无摘要";
  }
  return plain.length > 140 ? `${plain.slice(0, 140)}...` : plain;
}

export async function getArticleSlugs(): Promise<string[]> {
  "use cache";
  const entries = await fs.readdir(articlesDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""));
}

export async function getAllArticlesMeta(): Promise<ArticleMeta[]> {
  "use cache";
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(articlesDirectory, `${slug}.md`);
      const [source, stat] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)]);
      const { data, content } = matter(source);
      const title = typeof data.title === "string" ? data.title : slug;

      return {
        slug,
        title,
        excerpt: makeExcerpt(content),
        updatedAt: stat.mtime.toISOString()
      };
    })
  );

  return articles.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail> {
  "use cache";
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  const [source, stat] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)]);
  const { data, content } = matter(source);
  const title = typeof data.title === "string" ? data.title : slug;

  return {
    slug,
    title,
    content,
    excerpt: makeExcerpt(content),
    updatedAt: stat.mtime.toISOString()
  };
}
