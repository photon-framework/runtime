import { initialize } from "./src/initialize.js";

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initialize();
} else {
  document.addEventListener("DOMContentLoaded", initialize);
}

export * from "./src/page.js";
