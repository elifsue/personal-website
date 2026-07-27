import { useEffect } from "react";

interface CaseStudyMetaOptions {
  title: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
}

export default function useCaseStudyMeta({
  title,
  ogTitle,
  ogDescription,
  ogImage,
  ogImageWidth = "1200",
  ogImageHeight = "960",
}: CaseStudyMetaOptions) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.title = title;

    const setMeta = (property: string, content: string) => {
      let el =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (property.startsWith("twitter:")) {
          el.setAttribute("name", property);
        } else {
          el.setAttribute("property", property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("og:title", ogTitle);
    setMeta("og:description", ogDescription);
    setMeta("og:image", ogImage);
    setMeta("og:image:width", ogImageWidth);
    setMeta("og:image:height", ogImageHeight);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle);
    setMeta("twitter:description", ogDescription);
    setMeta("twitter:image", ogImage);

    return () => {
      document.title = "Elifsu Ateş — UI/UX Designer";
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
