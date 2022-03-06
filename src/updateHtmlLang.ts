import { makePath } from "./makePath";
import { router } from "./router";

export const updateHtmlLang = () => {
  const langSegmentIndex = Number(router.dataset.langSegment);
  if (Number.isNaN(langSegmentIndex) || langSegmentIndex < 0) {
    return;
  }

  let lang = makePath(router.dataset.route ?? router.dataset.default)[
    langSegmentIndex
  ];

  if (!lang || lang.endsWith(".html")) {
    makePath(router.dataset.default)[langSegmentIndex];
  }

  if (lang) {
    document.documentElement.lang = lang;
  }
};
