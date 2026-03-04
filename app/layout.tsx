import type { Metadata } from "next";
import type { ReactNode } from "react";
import MouseOrb from "./mouse-orb";
import "./globals.css";

export const metadata: Metadata = {
  title: "李小白 的前端博客",
  description: "聚焦前端 + AI 实战，记录开发经验与行业感悟"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="tech-bg" aria-hidden />
        <div className="tech-grid" aria-hidden />
        <div className="tech-glow tech-glow-one" aria-hidden />
        <div className="tech-glow tech-glow-two" aria-hidden />
        <MouseOrb />
        <div className="page-wrap">{children}</div>
      </body>
    </html>
  );
}
