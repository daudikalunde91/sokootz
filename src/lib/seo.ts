export function seo(title: string, description: string, extra: { noindex?: boolean } = {}) {
  const t = `${title} | SokoTZ`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(extra.noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
  };
}
