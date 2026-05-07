export const SITE_URL = "https://demartransportation.com";

const DEFAULT_IMAGE = `${SITE_URL}/demar-logo-official.png`;

export interface PageSeoOptions {
  path: string;
  title: string;
  description: string;
  ogType?: "website" | "article";
  image?: string;
}

export function canonicalUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const withoutQuery = normalizedPath.split(/[?#]/)[0];
  const trailingPath = withoutQuery.endsWith("/")
    ? withoutQuery
    : `${withoutQuery}/`;

  return `${SITE_URL}${trailingPath}`;
}

function ensureMetaByName(name: string): HTMLMetaElement {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  return element;
}

function ensureMetaByProperty(property: string): HTMLMetaElement {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  return element;
}

function ensureCanonicalLink(): HTMLLinkElement {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  return element;
}

function absoluteImageUrl(image?: string): string {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

export function setPageSeo({
  path,
  title,
  description,
  ogType = "website",
  image,
}: PageSeoOptions): void {
  const url = canonicalUrl(path);
  const resolvedImage = absoluteImageUrl(image);

  document.title = title;
  ensureMetaByName("description").setAttribute("content", description);

  ensureCanonicalLink().setAttribute("href", url);

  ensureMetaByProperty("og:title").setAttribute("content", title);
  ensureMetaByProperty("og:description").setAttribute("content", description);
  ensureMetaByProperty("og:type").setAttribute("content", ogType);
  ensureMetaByProperty("og:url").setAttribute("content", url);
  ensureMetaByProperty("og:image").setAttribute("content", resolvedImage);

  ensureMetaByName("twitter:card").setAttribute("content", "summary_large_image");
  ensureMetaByName("twitter:title").setAttribute("content", title);
  ensureMetaByName("twitter:description").setAttribute("content", description);
  ensureMetaByName("twitter:image").setAttribute("content", resolvedImage);
}
