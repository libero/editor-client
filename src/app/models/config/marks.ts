import { DOMOutputSpecArray } from 'prosemirror-model';

export const marks = {
  subscript: {
    parseDOM: [{ tag: 'sub' }],
    toDOM(): DOMOutputSpecArray {
      return ['sub', 0];
    }
  },

  superscript: {
    parseDOM: [{ tag: 'sup' }],
    toDOM(): DOMOutputSpecArray {
      return ['sup', 0];
    }
  },

  italic: {
    parseDOM: [{ tag: 'italic' }, { tag: 'em' }, { tag: 'i' }],
    toDOM(): DOMOutputSpecArray {
      return ['em', 0];
    }
  },

  strikethrough: {
    parseDOM: [{ tag: 'sc' }, { tag: 'strike' }, { tag: 's' }],
    toDOM(): DOMOutputSpecArray {
      return ['strike', 0];
    }
  },

  underline: {
    parseDOM: [{ tag: 'underline' }, { tag: 'u' }],
    toDOM(): DOMOutputSpecArray {
      return ['u', 0];
    }
  },

  bold: {
    parseDOM: [{ tag: 'bold' }, { tag: 'strong' }, { tag: 'b' }],
    toDOM(): DOMOutputSpecArray {
      return ['strong', 0];
    }
  },
  link: {
    attrs: {
      href: { default: undefined }
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'ext-link[ext-link-type="uri"]',
        getAttrs(dom) {
          return { href: dom.getAttribute('xlink:href') };
        }
      },
      {
        tag: 'a[href]',
        getAttrs(dom) {
          return { href: dom.getAttribute('href') };
        }
      }
    ],
    toDOM(node) {
      const { href } = node.attrs;
      return ['a', { href, 'link-type': 'ext-link' }, 0];
    }
  }
};
