import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

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
const execFileAsync = promisify(execFile);

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

async function getGitFirstCommitISO(filePath: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["log", "--diff-filter=A", "--follow", "--format=%aI", "-1", filePath],
      { cwd: process.cwd() }
    );
    const line = stdout.split("\n").find(Boolean)?.trim();
    return line || null;
  } catch {
    return null;
  }
}

async function getFileCreationISO(filePath: string): Promise<string> {
  const fromGit = await getGitFirstCommitISO(filePath);
  if (fromGit) return fromGit;
  try {
    const stat = await fs.stat(filePath);
    const birth = stat.birthtime?.toISOString?.();
    if (birth) return birth;
    return stat.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
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
      const source = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(source);
      const title = typeof data.title === "string" ? data.title : slug;
      const createdAt = await getFileCreationISO(filePath);

      return {
        slug,
        title,
        excerpt: makeExcerpt(content),
        updatedAt: createdAt
      };
    })
  );

  return articles.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail> {
  "use cache";
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  const source = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(source);
  const title = typeof data.title === "string" ? data.title : slug;
  const createdAt = await getFileCreationISO(filePath);

  return {
    slug,
    title,
    content,
    excerpt: makeExcerpt(content),
    updatedAt: createdAt
  };
}
