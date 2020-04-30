export const nodes = {
  doc: {
    content: 'block+'
  },

  'article-title': {
    group: 'block',
    content: 'inline*',
    parseDOM: [{ tag: 'article-title' }],
    toDOM(node) {
      return ['div', { class: 'article-title' }, 0];
    }
  },

  abstract: {
    group: 'block',
    content: 'paragraph',
    parseDOM: [{ tag: 'abstract' }],
    toDOM(node) {
      return ['div', { class: 'abstract' }, 0];
    }
  },

  keyword: {
    content: 'text*',
    atom: true,
    parseDOM: [{ tag: 'kwd' }],
    toDOM() {
      return ['div', 0];
    }
  },

  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', { class: 'paragraph' }, 0];
    }
  },

  text: {
    group: 'inline'
  }
};

export type NodesType = keyof typeof nodes;
