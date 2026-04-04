function runCleanups(cleanups) {
  return () => {
    [...cleanups].reverse().forEach((cleanup) => cleanup());
  };
}

function setDocumentTitle(title) {
  if (typeof document === "undefined") {
    return () => {};
  }

  const previousTitle = document.title;
  document.title = title;

  return () => {
    document.title = previousTitle;
  };
}

function setMetaContent(selector, attrName, attrValue, content) {
  if (typeof document === "undefined") {
    return () => {};
  }

  let tag = document.querySelector(selector);
  const hadTag = Boolean(tag);
  const previousContent = tag?.getAttribute("content");

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);

  return () => {
    if (hadTag) {
      if (previousContent === null) {
        tag?.removeAttribute("content");
      } else {
        tag?.setAttribute("content", previousContent);
      }
      return;
    }

    tag?.remove();
  };
}

function setLinkHref(selector, rel, href) {
  if (typeof document === "undefined") {
    return () => {};
  }

  let tag = document.querySelector(selector);
  const hadTag = Boolean(tag);
  const previousHref = tag?.getAttribute("href");

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);

  return () => {
    if (hadTag) {
      if (previousHref === null) {
        tag?.removeAttribute("href");
      } else {
        tag?.setAttribute("href", previousHref);
      }
      return;
    }

    tag?.remove();
  };
}

function setJsonLd(key, payload) {
  if (typeof document === "undefined") {
    return () => {};
  }

  const scriptTag = document.createElement("script");
  scriptTag.type = "application/ld+json";
  scriptTag.setAttribute("data-seo-key", key);
  scriptTag.text = JSON.stringify(payload);
  document.head.appendChild(scriptTag);

  return () => {
    scriptTag.remove();
  };
}

export function setPageSeo({ title, description, url, ogType = "website" }) {
  const cleanups = [
    setDocumentTitle(title),
    setMetaContent('meta[name="description"]', "name", "description", description),
    setLinkHref('link[rel="canonical"]', "canonical", url),
    setMetaContent('meta[property="og:title"]', "property", "og:title", title),
    setMetaContent('meta[property="og:description"]', "property", "og:description", description),
    setMetaContent('meta[property="og:type"]', "property", "og:type", ogType),
    setMetaContent('meta[property="og:url"]', "property", "og:url", url),
    setMetaContent('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image"),
    setMetaContent('meta[name="twitter:title"]', "name", "twitter:title", title),
    setMetaContent('meta[name="twitter:description"]', "name", "twitter:description", description),
  ];

  return runCleanups(cleanups);
}

export function setFaqSchema(faqItems, key) {
  return setJsonLd(key, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  });
}

export function setBreadcrumbSchema(items, key) {
  return setJsonLd(key, {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}
