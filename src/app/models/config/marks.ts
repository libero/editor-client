import { DOMOutputSpecArray } from 'prosemirror-model';

export const marks = {
  sub: {
    parseDOM: [{ tag: 'sub' }],
    toDOM(): DOMOutputSpecArray {
      return ['sub', 0];
    }
  },

  sup: {
    parseDOM: [{ tag: 'sup' }],
    toDOM(): DOMOutputSpecArray {
      return ['sup', 0];
    }
  },

  em: {
    parseDOM: [{ tag: 'italic' }],
    toDOM(): DOMOutputSpecArray {
      return ['em', 0];
    }
  }
};

export type MarksType = keyof typeof marks;
