import Link from "next/link";
import { getAllArticlesMeta } from "@/lib/articles";

export default async function HomePage() {
  const articles = await getAllArticlesMeta();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">李小白 BLOG</p>
        <h1 className="hero-title">前端与 AI 实战博客</h1>
        <p className="hero-sub">记录前端 + AI实战，记录开发经验与行业感悟，聊聊技术人的成长与日常</p>
      </section>
      <section className="list">
        {articles.map((article) => (
          <article className="card" key={article.slug}>
            <h2>
              <Link href={`/articles/${encodeURIComponent(article.slug)}`}>{article.title}</Link>
            </h2>
            <p className="meta">
              更新于 {new Date(article.updatedAt).toLocaleDateString("zh-CN", { dateStyle: "long" })}
            </p>
            <p>{article.excerpt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
