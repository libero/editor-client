import { DOMOutputSpecArray } from 'prosemirror-model';

export const nodes = {
  doc: {
    content: 'block'
  },

  'article-title': {
    group: 'block',
    content: 'inline*',
    parseDom: [{ tag: 'div', attrs: { 'data-tag': 'article-title' } }],
    toDOM(node): DOMOutputSpecArray {
      return ['div', { 'data-tag': 'article-title', class: 'article-title' }, 0];
    }
  },

  text: {
    group: 'inline'
  }
};

export type NodesType = keyof typeof nodes;
