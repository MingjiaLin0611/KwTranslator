const SKIPPED_TAGS = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "INPUT", "TEXTAREA", "NOSCRIPT"]);

export function collectEligibleTextNodes(root: ParentNode): Text[] {
  const doc = root.ownerDocument ?? document;
  const view = doc.defaultView ?? window;
  const nodes: Text[] = [];
  const walker = doc.createTreeWalker(root, view.NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim()) return view.NodeFilter.FILTER_REJECT;
      if (hasSkippedAncestor(node)) return view.NodeFilter.FILTER_REJECT;
      return view.NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  return nodes;
}

function hasSkippedAncestor(node: Node): boolean {
  let current = node.parentElement;

  while (current) {
    if (SKIPPED_TAGS.has(current.tagName)) return true;
    if (current.hasAttribute("data-kw-translator-skip")) return true;
    current = current.parentElement;
  }

  return false;
}
