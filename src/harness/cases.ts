import { builtinDictionary } from "../core/dictionary";
import type { HarnessCase } from "@/core/types";

export const harnessCases: HarnessCase[] = [
  {
    name: "inline software engineering translation",
    html: "<main><p>This documentation is focusing on Software Engineering.</p><code>API</code></main>",
    dictionary: builtinDictionary,
    expectedText: "This documentation(文档) is focusing on Software Engineering(软件工程).API",
    forbiddenSelectors: ["code"]
  }
];
