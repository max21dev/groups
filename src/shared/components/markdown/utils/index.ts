import { visit } from 'unist-util-visit';

export function rehypeInlineCodeProperty() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, _index: number | undefined, parent: any) => {
      if (node.tagName === 'code') {
        node.properties = node.properties || {};
        node.properties.inline = !(parent && parent.tagName === 'pre');
      }
    });
  };
}
