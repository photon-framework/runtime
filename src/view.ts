import { searchParams } from "./query";
import { getLanguages, router } from "./router";
import { url } from "./URL";

class View {
  constructor() {
    for (const sp of searchParams) {
      this[sp[0]] = sp[1];
    }

    const langSegment = Number(router.dataset.langSegment);
    if (!Number.isNaN(langSegment) && langSegment > -1) {
      const languages = getLanguages();
      if (languages) {
        for (const lang of languages) {
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
      const languages = getLanguages();

      if (lang && (!languages || languages.has(lang))) {
        return lang;
      }
    }

    return document.documentElement.lang || "en";
  }

  public readonly title: string = document.title;

  public plus<T>(obj: T): this & T {
    const copyObj = Object.assign({}, obj);
    return Object.assign(copyObj, this);
  }
}

/** @internal */
export const view = new View();

// eslint-disable-next-line no-undef
(globalThis as any).view = view;
