export const nodes = {
  doc: {
    content: 'block'
  },

  'article-title': {
    group: 'block',
    content: 'inline*',
    parseDom: [{ tag: 'div', attrs: {'data-tag': 'article-title'}}],
    toDOM(node) {
      return ['div', {'data-tag': 'article-title', class: 'article-title'}, 0]
    }
  },

  'kwd-group': {
    group: 'block',
    content: 'block*',
    parseDom: [{ tag: 'div', attrs: {'data-tag': 'keyword-group'}}],
    toDOM(node) {
      return ['div', {'data-tag': 'keyword-group', class: 'keyword-group'}, 0]
    }
  },

  'kwd': {
    group: 'block',
    content: 'inline*',
    parseDom: [{ tag: 'div', attrs: {'data-tag': 'keyword'}}],
    toDOM(node) {
      return ['div', {'data-tag': 'keyword', class: 'keyword'}, 0]
    }
  },

  text: {
    group: 'inline'
  }
};

export type NodesType = keyof typeof nodes;
