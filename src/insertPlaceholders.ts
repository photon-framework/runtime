const htmlError = (message: string, url?: string) =>
  url
    ? `<p style="color: red !important; background-color: black !important;">${message} <a href="${url}">${url}</a></p>`
    : `<p style="color: red !important; background-color: black !important;">${message}</p>`;

export const insertPlaceholders = async (root: Element) => {
  for await (const el of Array.from(
    root.querySelectorAll("photon-ref[src]") as NodeListOf<HTMLElement>
  )) {
    try {
      const response = await fetch(el.getAttribute("src")!);
      if (response.ok) {
        el.outerHTML = await (
          await response.text()
        ).replace(/\{\{[^{}]+\}\}/g, (match) => {
          const key = match.substring(2, match.length - 2);
          return el.dataset[key] ?? "";
        });
      } else {
        el.innerHTML = htmlError(
          `${response.status} ${response.statusText}`,
          response.url
        );
      }
    } catch (err) {
      el.innerHTML = JSON.stringify(err);
    }
  }
};
