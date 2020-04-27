export const nodes = {
  doc: {
    content: 'block+'
  },

  'article-title': {
    group: 'block',
    content: 'inline*',
    parseDOM: [{ tag: 'article-title' }],
    toDOM(node) {
      return ['div', { 'data-tag': 'article-title', class: 'article-title' }, 0];
    }
  },

  keyword_group: {
    group: 'block',
    content: 'keyword+',
    parseDOM: [{ tag: 'kwd-group' }],
    toDOM() {
      return ['div', { 'data-tag': 'keyword-group', class: 'keyword-group' }, 0];
    }
  },

  keyword: {
    content: 'text*',
    atom: true,
    // inline: true,
    parseDOM: [{ tag: 'kwd' }],
    toDOM() {
      return ['div', 0];
    }
  },

  text: {
    group: 'inline'
  }
};

export type NodesType = keyof typeof nodes;
