export const htmlError = (message: string, url?: string) =>
  url
    ? `<p style="color: red !important; background-color: black !important;">${message} <a href="${url}">${url}</a></p>`
    : `<p style="color: red !important; background-color: black !important;">${message}</p>`;
