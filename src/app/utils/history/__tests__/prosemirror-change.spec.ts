import { givenState } from '../../../test-utils/reducer-test-helpers';
import { ProsemirrorChange } from '../prosemirror-change';

describe('ProsemirrorChange', () => {
  const manuscript = givenState({}).data.present;

  it('should apply prosemirror change', () => {
    const prosemirrorChange = new ProsemirrorChange('body', manuscript.body.tr.insertText('test content'));

    const updatedManuscript = prosemirrorChange.applyChange(manuscript);
    expect(updatedManuscript.body.doc.textContent).toBe('test content');
  });

  it('should revert prosemirror change', () => {
    const prosemirrorChange = new ProsemirrorChange('body', manuscript.body.tr.insertText('test content'));
    const updatedManuscript = prosemirrorChange.applyChange(manuscript);

    expect(prosemirrorChange.rollbackChange(updatedManuscript)).toEqual(manuscript);
  });

  it('should indicate empty change', () => {
    const prosemirrorChange = new ProsemirrorChange('body', manuscript.body.tr);
    expect(prosemirrorChange.isEmpty).toBeTruthy();
  });

  it('should check if path is affected', () => {
    const change = new ProsemirrorChange('body', manuscript.body.tr);
    expect(change.isPathAffected(/^body$/)).toBeTruthy();
  });

  it('should check if path is affected but regex is invalid', () => {
    const change = new ProsemirrorChange('body', manuscript.body.tr);
    expect(change.isPathAffected(/^wibble$/)).toBeFalsy();
  });

  it('should serialize to JSON', () => {
    const change = new ProsemirrorChange('body', manuscript.body.tr.insertText('test content'));

    expect(change.toJSON()).toEqual({
      path: 'body',
      timestamp: expect.any(Number),
      type: 'prosemirror',
      transactionSteps: [
        {
          from: 0,
          slice: { content: [{ type: 'text', text: 'test content' }] },
          stepType: 'replace',
          to: 0
        }
      ]
    });
  });

  it('should deserialize from JSON', () => {
    const JSONObject = {
      path: 'body',
      timestamp: 1610979099826,
      transactionSteps: [
        {
          stepType: 'replace',
          from: 0,
          to: 0,
          slice: {
            content: [
              {
                type: 'text',
                text: 'This text is sent from the server'
              }
            ]
          }
        }
      ],
      type: 'prosemirror'
    };

    const change = ProsemirrorChange.fromJSON(JSONObject);

    expect(change).toMatchSnapshot();
    expect(change).toBeInstanceOf(ProsemirrorChange);
  });
});
