import { searchParams } from "./query.js";
import { router } from "./router.js";
import { url } from "./URL.js";

class View {
  constructor() {
    for (const sp of searchParams) {
      this[sp[0]] = sp[1];
    }

    const langSegment = Number(router.dataset.langSegment);
    if (!Number.isNaN(langSegment) && langSegment > -1) {
      if (router.dataset.languages) {
        for (const lang of JSON.parse(router.dataset.languages)) {
          this[`changeLang_${lang}`] = () => {
            const path = url.pathname
              .split("/")
              .filter((x) => Boolean(x.trim()));

            path.splice(langSegment, 1, lang);

            return "/" + path.join("/");
          };
        }
      }
    }
  }

  public lang(): string {
    const langSegment = Number(router.dataset.langSegment);
    if (!Number.isNaN(langSegment)) {
      const lang = url.pathname.split("/").filter(Boolean)[langSegment];

      if (lang) {
        return lang;
      }
    }

    return document.documentElement.lang ?? "en";
  }

  public readonly title: string = document.title;
}

export const view = new View();
