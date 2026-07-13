import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import("shiki/themes/github-light.mjs")],
      langs: [
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/html.mjs"),
        import("shiki/langs/css.mjs"),
        import("shiki/langs/bash.mjs"),
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return highlighterPromise;
}
