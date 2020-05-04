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
    parseDOM: [{ tag: 'italic' }],
    toDOM(): DOMOutputSpecArray {
      return ['em', 0];
    }
  },

  bold: {
    parseDOM: [{ tag: 'bold' }],
    toDOM(): DOMOutputSpecArray {
      return ['strong', 0];
    }
  }
};

export type MarksType = keyof typeof marks;
