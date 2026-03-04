import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidElement } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllArticlesMeta, getArticleBySlug } from "@/lib/articles";
import type { ArticleDetail } from "@/lib/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "class",
  "extends",
  "import",
  "from",
  "export",
  "default",
  "async",
  "await",
  "true",
  "false",
  "null",
  "undefined",
  "typeof",
  "instanceof",
  "in",
  "of",
  "this",
  "public",
  "private",
  "protected",
  "interface",
  "type",
  "enum"
]);

const BUILTINS = new Set([
  "console",
  "window",
  "document",
  "process",
  "Promise",
  "Array",
  "Object",
  "String",
  "Number",
  "Boolean",
  "Math",
  "Date",
  "Map",
  "Set",
  "Error",
  "JSON"
]);

function normalizeImagePath(src: string): string {
  if (src.startsWith("../images/")) {
    return src.replace("../images/", "/images/");
  }
  if (src.startsWith("./images/")) {
    return src.replace("./images/", "/images/");
  }
  return src;
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function slugifyHeading(text: string): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[：:]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "section";
}

function extractTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => extractTextContent(child)).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextContent(node.props.children);
  }
  return "";
}

function classifyToken(token: string, language: string): string {
  if (!token) {
    return "";
  }
  if (language === "bash" || language === "shell" || language === "sh" || language === "zsh") {
    if (token.startsWith("#")) {
      return "comment";
    }
    if (/^-{1,2}[a-zA-Z-]+$/.test(token)) {
      return "operator";
    }
  }
  if (token.startsWith("//") || token.startsWith("/*") || token.startsWith("*")) {
    return "comment";
  }
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'")) ||
    (token.startsWith("`") && token.endsWith("`"))
  ) {
    return "string";
  }
  if (/^\d+(\.\d+)?$/.test(token)) {
    return "number";
  }
  if (KEYWORDS.has(token)) {
    return "keyword";
  }
  if (BUILTINS.has(token)) {
    return "builtin";
  }
  if (/^[=+\-*/%<>!&|^~]+$/.test(token)) {
    return "operator";
  }
  return "";
}

function renderHighlightedCode(source: string, language: string) {
  const lines = source.split("\n");
  const pattern =
    /\/\/.*$|#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|[A-Za-z_]\w*|[=+\-*/%<>!&|^~]+|[()[\]{}.,;:]/g;

  return lines.map((line, lineIndex) => {
    const segments: ReactNode[] = [];
    let lastIndex = 0;
    for (const match of line.matchAll(pattern)) {
      const token = match[0];
      const index = match.index ?? 0;
      if (index > lastIndex) {
        segments.push(line.slice(lastIndex, index));
      }
      const tokenType = classifyToken(token, language);
      if (tokenType) {
        segments.push(
          <span className={`token-${tokenType}`} key={`${lineIndex}-${index}`}>
            {token}
          </span>
        );
      } else {
        segments.push(token);
      }
      lastIndex = index + token.length;
    }
    if (lastIndex < line.length) {
      segments.push(line.slice(lastIndex));
    }

    return (
      <span className="code-line" key={`code-line-${lineIndex}`}>
        {segments}
        {lineIndex < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
}

export async function generateStaticParams() {
  const articles = await getAllArticlesMeta();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  try {
    const article = await getArticleBySlug(normalizedSlug);
    return {
      title: article.title,
      description: article.excerpt
    };
  } catch {
    return {
      title: "文章不存在"
    };
  }
}

async function getArticleOr404(slug: string): Promise<ArticleDetail> {
  try {
    return await getArticleBySlug(slug);
  } catch {
    notFound();
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleOr404(normalizeSlug(slug));
  const headingCounter = new Map<string, number>();

  const createHeading =
    (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"): NonNullable<Components["h2"]> => {
      const HeadingRenderer: NonNullable<Components["h2"]> = ({ children }) => {
        const plainText = extractTextContent(children);
        const baseId = slugifyHeading(plainText);
        const hitCount = headingCounter.get(baseId) ?? 0;
        headingCounter.set(baseId, hitCount + 1);
        const id = hitCount === 0 ? baseId : `${baseId}-${hitCount}`;
        return <Tag id={id}>{children}</Tag>;
      };
      HeadingRenderer.displayName = `Markdown${Tag.toUpperCase()}Heading`;
      return HeadingRenderer;
    };

  return (
    <main className="shell">
      <p className="back">
        <Link href="/">← 返回首页</Link>
      </p>
      <article className="markdown">
        <h1>{article.title}</h1>
        <p className="meta">
          更新于 {new Date(article.updatedAt).toLocaleDateString("zh-CN", { dateStyle: "long" })}
        </p>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: createHeading("h1"),
            h2: createHeading("h2"),
            h3: createHeading("h3"),
            h4: createHeading("h4"),
            h5: createHeading("h5"),
            h6: createHeading("h6"),
            pre: ({ children }) => <pre className="code-block">{children}</pre>,
            code: ({ className, children }) => {
              const match = /language-([a-z0-9-]+)/i.exec(className ?? "");
              const language = match?.[1]?.toLowerCase() ?? "text";
              const content = String(children).replace(/\n$/, "");
              if (!className) {
                return <code>{children}</code>;
              }
              return <code className={className}>{renderHighlightedCode(content, language)}</code>;
            },
            img: ({ src, alt }) => {
              const imageSrc = typeof src === "string" ? normalizeImagePath(src) : "";
              return <img src={imageSrc} alt={alt ?? ""} loading="lazy" />;
            }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
