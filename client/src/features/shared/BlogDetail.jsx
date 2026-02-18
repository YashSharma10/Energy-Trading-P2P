import { Link, useParams } from "react-router-dom";
import { CalendarDays, Clock, Tag } from "lucide-react";

import { blogPosts } from "@/constants/blogPosts";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);
  const relatedPosts = blogPosts
    .filter((item) => item.slug !== slug)
    .slice(0, 2);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brandMainColor">
          CarbonEase Blog
        </span>
        <h1 className="mt-4 text-3xl font-bold text-foreground dark:text-white">
          We could not find that article
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground dark:text-white/80">
          The post you are looking for may have been updated. Browse our latest
          insights to stay up to date with the carbon markets.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center rounded-full bg-brandMainColor px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
        >
          Back to blog overview
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brandMainColor/20 via-background to-background py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-brandMainColor/40 bg-brandMainColor/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brandMainColor transition-colors hover:bg-brandMainColor/20 dark:border-brandSubColor/40 dark:bg-brandSubColor/10 dark:text-brandSubColor"
          >
            ← Back to blog
          </Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-brandMainColor dark:text-brandSubColor">
            {post.category}
          </span>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl dark:text-white">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground dark:text-white/70">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {post.publishedOn}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {post.tags.join(", ")}
            </span>
          </div>
          <p className="max-w-3xl text-base text-muted-foreground dark:text-white/80">
            {post.excerpt}
          </p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-8">
        {post.heroQuote && (
          <blockquote className="rounded-2xl border border-brandMainColor/40 bg-brandMainColor/10 p-6 text-center text-lg font-semibold text-brandMainColor shadow-sm dark:border-brandSubColor/40 dark:bg-brandSubColor/10 dark:text-brandSubColor">
            “{post.heroQuote}”
          </blockquote>
        )}

        <div className="mt-10 space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground dark:text-white">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-7 text-muted-foreground dark:text-white/80"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-disc space-y-2 rounded-xl border border-border bg-background/80 p-5 pl-8 text-base text-muted-foreground dark:text-white/85">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-6 pb-16 lg:px-8">
          <div className="rounded-3xl border border-border bg-card/95 p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-foreground dark:text-white">
              Keep exploring
            </h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="rounded-2xl border border-border bg-background/80 p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-brandMainColor dark:text-brandSubColor">
                    {related.category}
                  </span>
                  <h4 className="mt-3 text-lg font-semibold text-foreground dark:text-white">
                    {related.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground dark:text-white/80">
                    {related.excerpt}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brandMainColor transition-colors hover:text-brandMainColor/80 dark:text-brandSubColor dark:hover:text-brandSubColor/90">
                    Read article →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
