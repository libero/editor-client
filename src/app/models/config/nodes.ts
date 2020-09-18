import { DOMOutputSpec } from 'prosemirror-model';
import { v4 as uuidv4 } from 'uuid';

function getTitleLevel(title: Element): number {
  let parent = title.parentNode;
  let level = 1;
  while (parent && parent.nodeName !== 'body') {
    if (parent.nodeName === 'sec') {
      level++;
    }
    parent = parent.parentNode;
  }
  return level;
}

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
      return ['h1', { class: 'article-title' }, 0];
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
    attrs: {
      level: { default: 1 },
      domId: { default: '' }
    },
    content: 'inline*',
    defining: true,
    group: 'block',
    parseDOM: [
      {
        tag: 'sec > title',
        getAttrs(dom) {
          return {
            level: getTitleLevel(dom),
            domId: uuidv4()
          };
        }
      },
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } }
    ],
    toDOM(node) {
      return ['h' + node.attrs.level, { id: node.attrs.domId }, 0];
    }
  },

  refCitation: {
    content: undefined,
    attrs: {
      refId: { default: undefined },
      refText: { default: undefined }
    },
    group: 'inline',
    atom: true,
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
      },
      {
        tag: 'a.citation[data-cit-type="reference"]',
        getAttrs(dom) {
          return {
            refText: dom.getAttribute('data-ref-text'),
            refId: dom.getAttribute('data-ref-id')
          };
        }
      }
    ],
    toClipboardDOM(node): DOMOutputSpec {
      const refCitationDom = document.createElement('a');
      refCitationDom.setAttribute('href', '#');
      refCitationDom.setAttribute('data-cit-type', 'reference');
      refCitationDom.setAttribute('data-ref-id', node.attrs.refId);
      refCitationDom.setAttribute('data-ref-text', node.attrs.refText);
      refCitationDom.classList.add('citation');
      refCitationDom.innerHTML = `${node.attrs.refText}`;
      return refCitationDom;
    },
    toClipboardText(node): string {
      return node.attrs.refText;
    },
    toDOM(node): DOMOutputSpec {
      return [
        'a',
        {
          href: '#',
          class: 'citation',
          'data-cit-type': 'reference',
          'data-ref-id': node.attrs.refId,
          'data-ref-text': node.attrs.refText
        }
      ];
    }
  },

  text: {
    group: 'inline'
  }
};

export type NodesType = keyof typeof nodes;
