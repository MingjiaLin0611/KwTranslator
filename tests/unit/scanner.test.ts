import { describe, expect, it } from "vitest";
import { collectEligibleTextNodes } from "@/core/scanner";

describe("scanner", () => {
  it("collects visible content text nodes and skips unsafe regions", () => {
    document.body.innerHTML = `
      <main>
        <h1>Software Engineering</h1>
        <p>API documentation</p>
        <code>Software Engineering</code>
        <textarea>API</textarea>
        <script>const text = "API"</script>
      </main>
    `;

    const nodes = collectEligibleTextNodes(document.body);
    const text = nodes.map((node) => node.textContent?.trim()).filter(Boolean);

    expect(text).toEqual(["Software Engineering", "API documentation"]);
  });
});
