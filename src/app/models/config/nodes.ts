export const nodes = {
  doc: {
    content: 'block+'
  },

  annotatedReferenceInfoDoc: {
    group: 'block',
    content: 'inline*',
    parseDOM: [{ tag: 'article-title' }, { tag: 'source' }],
    toDOM(node) {
      return ['p', 0];
    }
  },

  'article-title': {
    group: 'block',
    content: 'inline*',
    parseDOM: [{ tag: 'article-title' }],
    toDOM(node) {
      return ['h1', 0];
    }
  },

  abstract: {
    group: 'block',
    content: 'paragraph',
    parseDOM: [{ tag: 'abstract' }],
    toDOM(node) {
      return ['p', { class: 'abstract' }, 0];
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

  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', { class: 'paragraph' }, 0];
    }
  },

  section: {
    content: 'block*',
    group: 'block',
    parseDOM: [{ tag: 'sec' }],
    toDOM() {
      return ['section', 0];
    }
  },

  heading: {
    attrs: { level: { default: 1 } },
    content: 'inline*',
    group: 'block',
    parseDOM: [
      {
        tag: 'sec > title',
        getAttrs(dom) {
          return { level: dom.parentNode.getAttribute('id')[1] };
        }
      }
    ],
    toDOM(node) {
      return ['h' + node.attrs.level, 0];
    }
  },

  refCitation: {
    content: 'text*',
    attrs: {
      refId: { default: undefined },
      refText: { default: undefined }
    },
    group: 'inline',
    atom: true,
    leaf: true,
    inline: true,
    parseDOM: [
      {
        tag: 'xref[ref-type="bibr"]',
        getAttrs(dom) {
          return {
            refText: dom.textContent,
            refId: dom.getAttribute('rid')
          };
        }
      }
    ],
    toDOM(node) {
      return ['a', { href: '#', class: 'citation' }, 0];
    }
  },

  text: {
    group: 'inline'
  }
};

export type NodesType = keyof typeof nodes;
