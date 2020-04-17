/* eslint-disable */
import { DOMOutputSpec, Schema, SchemaSpec } from 'prosemirror-model';

const pDOM = ['p', 0] as DOMOutputSpec,
  hrDOM = ['hr'] as DOMOutputSpec,
  preDOM = ['pre', ['code', 0]] as DOMOutputSpec,
  brDOM = ['br'] as DOMOutputSpec;

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: 'block+'
  },

  article: {
    content: 'body*',
    parseDOM: [{ tag: 'article' }],
    toDOM() {
      return ['div'] as DOMOutputSpec;
    }
  },

  body: {
    content: 'block*',
    parseDOM: [{ tag: 'body' }],
    toDOM() {
      return ['div', 0] as DOMOutputSpec;
    }
  },

  boxed_text: {
    content: 'paragraph*',
    group: 'block',
    parseDOM: [{ tag: 'boxed-text' }],
    toDOM() {
      return ['div', { class: 'sc-card' }, 0] as DOMOutputSpec;
    }
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM;
    }
  },

  // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return ['div'] as DOMOutputSpec;
    }
  },

  // :: NodeSpec A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM;
    }
  },

  // :: NodeSpec A heading textblock, with a `level` attribute that
  // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  // `<h6>` elements.
  heading: {
    attrs: { level: { default: 1 } },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } }
    ],
    toDOM(node) {
      return ['h' + node.attrs.level, 0] as DOMOutputSpec;
    }
  },

  // :: NodeSpec A code listing. Disallows marks or non-text inline
  // nodes by default. Represented as a `<pre>` element with a
  // `<code>` element inside of it.
  code_block: {
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return preDOM;
    }
  },

  // :: NodeSpec The text node.
  text: {
    group: 'inline'
  },

  // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
  // `alt`, and `href` attributes. The latter two default to the empty
  // string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null }
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs(dom) {
          return {
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt')
          };
        }
      }
    ],
    toDOM(node) {
      const { src, alt, title } = node.attrs;
      return ['img', { src, alt, title }] as DOMOutputSpec;
    }
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM;
    }
  },

  ext_link: {
    inline: true,
    content: 'inline*',
    attrs: {
      type: { default: 'uri' },
      href: {}
    },
    group: 'inline',
    parseDOM: [
      {
        tag: 'ext-link',
        getAttrs(dom) {
          return {
            type: dom.getAttribute('ext-link-type'),
            href: dom.getAttribute('xlink:href')
          };
        }
      }
    ],
    toDOM(node) {
      const { href } = node.attrs;
      return ['a', { href }, 0] as DOMOutputSpec;
    }
  },

  //<xref ref-type="bibr" rid="bib5">Katz et al., 2009</xref>
  xref: {
    inline: true,
    content: 'inline*',
    attrs: {
      type: { default: 'bibr' },
      href: { default: '#' }
    },
    group: 'inline',
    parseDOM: [
      {
        tag: 'xref',
        getAttrs(dom) {
          return {
            type: dom.getAttribute('ref-type'),
            href: dom.getAttribute('rid')
          };
        }
      }
    ],
    toDOM(node) {
      const { href } = node.attrs;
      return ['a', { href }, 0] as DOMOutputSpec;
    }
  },

  figure: {
    content: 'label* caption* graphic* attrib*',
    group: 'block',
    attrs: {
      id: {},
      position: { default: 'float' }
    },
    parseDOM: [
      {
        tag: 'fig',
        getAttrs(dom) {
          return {
            id: dom.getAttribute('id'),
            position: dom.getAttribute('position')
          };
        }
      }
    ],
    toDOM(node) {
      return ['div', { class: 'sc-card' }, 0] as DOMOutputSpec;
    }
  },

  label: {
    content: 'inline*',
    group: 'figure',
    selectable: false,
    parseDOM: [
      {
        tag: 'label'
      }
    ],
    toDOM(node) {
      return ['h2', 0] as DOMOutputSpec;
    }
  },

  caption: {
    content: 'title* paragraph*',
    group: 'figure',
    parseDOM: [
      {
        tag: 'caption'
      }
    ],
    toDOM() {
      return ['div', 0] as DOMOutputSpec;
    }
  },

  title: {
    content: 'text*',
    parseDOM: [
      {
        tag: 'title'
      }
    ],
    toDOM() {
      return ['h3', 0] as DOMOutputSpec;
    }
  },

  graphic: {
    attrs: {
      src: {}
    },
    group: 'figure',
    draggable: true,
    parseDOM: [
      {
        tag: 'graphic',
        getAttrs(dom) {
          return {
            src: dom.getAttribute('xlink:href')
          };
        }
      }
    ],
    toDOM(node) {
      const { src } = node.attrs;
      return ['img', { src }] as DOMOutputSpec;
    }
  },

  attrib: {
    content: 'text*',
    parseDOM: [
      {
        tag: 'attrib'
      }
    ],
    toDOM(node) {
      return ['h3', 0] as DOMOutputSpec;
    }
  }
};

const emDOM = ['em', 0] as DOMOutputSpec,
  strongDOM = ['strong', 0] as DOMOutputSpec,
  codeDOM = ['code', 0] as DOMOutputSpec;

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  // :: MarkSpec A link. Has `href` and `title` attributes. `title`
  // defaults to the empty string. Rendered and parsed as an `<a>`
  // element.
  link: {
    attrs: {
      href: {},
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(dom) {
          return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
        }
      }
    ],
    toDOM(node) {
      const { href, title } = node.attrs;
      return ['a', { href, title }, 0] as DOMOutputSpec;
    }
  },

  // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
  // Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'italic' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM() {
      return emDOM;
    }
  },

  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: 'strong' },
      { tag: 'bold' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      { tag: 'b', getAttrs: (node) => node.style.fontWeight !== 'normal' && null },
      { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
    ],
    toDOM() {
      return strongDOM;
    }
  },

  // :: MarkSpec Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM;
    }
  }
};

// :: Schema
// This schema roughly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).

type NodesType = keyof typeof nodes;
type MarksType = keyof typeof marks;
export const schema = new Schema<NodesType, MarksType>({ nodes, marks } as SchemaSpec<NodesType, MarksType>);
/* eslint-enable */
