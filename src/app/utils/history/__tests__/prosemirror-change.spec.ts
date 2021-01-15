import { givenState } from 'app/test-utils/reducer-test-helpers';
import { ProsemirrorChange } from 'app/utils/history/prosemirror-change';

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
});
