export const marks = {
  sub: {
    parseDOM: [{ tag: 'sub' }],
    toDOM() {
      return ['sub', 0];
    }
  },

  sup: {
    parseDOM: [{ tag: 'sup' }],
    toDOM() {
      return ['sup', 0];
    }
  },

  em: {
    parseDOM: [{ tag: 'italic' }],
    toDOM() {
      return ['em', 0];
    }
  }
};

export type MarksType = keyof typeof marks;