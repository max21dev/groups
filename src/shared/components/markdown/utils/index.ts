import { visit } from 'unist-util-visit';

export function rehypeInlineCodeProperty() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName === 'code') {
        node.properties = node.properties || {};
        if (parent && parent.tagName === 'pre') {
          node.properties.inline = false;
        } else {
          node.properties.inline = true;
        }
      }
    });
  };
}
