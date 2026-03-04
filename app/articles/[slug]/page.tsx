import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllArticlesMeta, getArticleBySlug } from "@/lib/articles";
import type { ArticleDetail } from "@/lib/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

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
