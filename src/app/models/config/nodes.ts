import { DOMOutputSpec } from 'prosemirror-model';
import { v4 as uuidv4 } from 'uuid';
import { getTextContentFromPath } from 'app/models/utils';
import { createEmptyLicenseAttributes, createFigureLicenseAttributes, getFigureImageUrl } from 'app/models/figure';
import { parseFigure } from 'app/models/config/figure.parser';

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
      domId: { default: uuidv4() }
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
      { tag: 'h1', attrs: { level: 1, domId: uuidv4() } },
      { tag: 'h2', attrs: { level: 2, domId: uuidv4() } },
      { tag: 'h3', attrs: { level: 3, domId: uuidv4() } },
      { tag: 'h4', attrs: { level: 4, domId: uuidv4() } }
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
        priority: 100,
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

  boxText: {
    content: 'paragraph*',
    group: 'block',
    parseDOM: [
      {
        tag: 'boxed-text'
      }
    ],
    toDOM() {
      return ['section', { class: 'box-text' }, 0];
    }
  },

  figure: {
    content: '(figureTitle | figureLegend | figureAttribution | figureLicense)*',
    group: 'block',
    atom: true,
    attrs: {
      id: { default: '' },
      label: { default: '' },
      img: { default: '' }
    },
    parseDOM: [
      {
        tag: 'fig',
        getAttrs(dom) {
          return {
            id: dom.getAttribute('id'),
            label: getTextContentFromPath(dom, 'label') || '',
            img: getFigureImageUrl(dom)
          };
        },
        getContent: parseFigure
      }
    ],
    toDOM() {
      return ['section', { class: 'figure' }, 0];
    }
  },

  figureTitle: {
    content: 'inline*',
    parseDOM: [{ tag: 'caption > title' }],
    toDOM() {
      return ['p', 0];
    }
  },

  figureLegend: {
    content: 'inline*',
    parseDOM: [
      { tag: 'caption > p', priority: 100 },
      { tag: 'label', ignore: true }
    ],
    context: 'figure',
    toDOM() {
      return ['p', 0];
    }
  },

  figureAttribution: {
    content: 'inline*',
    parseDOM: [
      { tag: 'attrib', priority: 100 },
      { tag: 'label', ignore: true }
    ],
    context: 'figure',
    toDOM() {
      return ['p', 0];
    }
  },

  figureLicense: {
    content: 'inline*',
    group: 'block',
    attrs: {
      licenseInfo: { default: createEmptyLicenseAttributes() }
    },
    contentElement: 'license > license-p',
    parseDOM: [
      {
        tag: 'permissions',
        getAttrs(dom) {
          return { licenseInfo: createFigureLicenseAttributes(dom) };
        }
      },
      { tag: 'label', ignore: true }
    ],
    toDOM(node) {
      return ['p', 0];
    }
  },

  orderedList: {
    group: 'block',
    content: 'listItem+',
    parseDOM: [{ tag: 'list[list-type=order]' }],
    toDOM(node) {
      return ['ol', 0];
    }
  },

  bulletList: {
    group: 'block',
    content: 'listItem+',
    parseDOM: [{ tag: 'list[list-type=bullet]' }],
    toDOM() {
      return ['ul', 0];
    }
  },

  listItem: {
    content: 'paragraph block*',
    parseDOM: [{ tag: 'list-item' }],
    toDOM() {
      return ['li', 0];
    },
    defining: true
  },

  figureCitation: {
    content: 'text*',
    group: 'inline',
    attrs: {
      figIds: { default: null }
    },
    inline: true,
    parseDOM: [
      {
        tag: 'xref[ref-type="fig"]',
        getAttrs(dom) {
          return {
            figIds: dom.getAttribute('rid').split(' ').filter(Boolean)
          };
        }
      },
      {
        tag: 'a.citation[data-cit-type="figure"]',
        priority: 100,
        getAttrs(dom) {
          console.log(dom);
          return {
            figIds: dom.getAttribute('data-fig-ids').split(',')
          };
        }
      }
    ],
    toDOM(node): DOMOutputSpec {
      return [
        'a',
        {
          href: '#',
          class: 'citation',
          'data-cit-type': 'figure',
          'data-fig-ids': node.attrs.figIds
        },
        0
      ];
    }
  },

  text: {
    group: 'inline'
  }
};

export type NodesType = keyof typeof nodes;
