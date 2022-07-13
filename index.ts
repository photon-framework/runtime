import { initialize } from "./src/initialize";

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  void initialize();
} else {
  document.addEventListener("DOMContentLoaded", initialize);
}

export * from "./src/page";
export * from "./src/dotenv";
export * from "./src/logger";
