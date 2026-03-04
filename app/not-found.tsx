import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="shell">
      <section className="hero">
        <h1>页面不存在</h1>
        <p>该文章可能已删除或文件名已变更。</p>
        <p className="back">
          <Link href="/">返回首页</Link>
        </p>
      </section>
    </main>
  );
}
