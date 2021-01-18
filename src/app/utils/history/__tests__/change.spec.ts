import { givenState } from 'app/test-utils/reducer-test-helpers';
import { BatchChange } from 'app/utils/history/batch-change';
import { ProsemirrorChange } from 'app/utils/history/prosemirror-change';

describe('BatchChange', () => {
  const manuscript = givenState({}).data.present;

  it('should apply batch change', () => {
    const batchChange = new BatchChange([
      new ProsemirrorChange('body', manuscript.body.tr.insertText('test content')),
      new ProsemirrorChange('title', manuscript.title.tr.insertText('sample content'))
    ]);

    const updatedManuscript = batchChange.applyChange(manuscript);
    expect(updatedManuscript.body.doc.textContent).toBe('test content');
    expect(updatedManuscript.title.doc.textContent).toBe('sample content');
    expect(batchChange.isEmpty).toBeFalsy();
  });

  it('should revert batch change', () => {
    const batchChange = new BatchChange([
      new ProsemirrorChange('body', manuscript.body.tr.insertText('test content')),
      new ProsemirrorChange('title', manuscript.title.tr.insertText('sample content'))
    ]);

    const updatedManuscript = batchChange.applyChange(manuscript);
    const revertedManuscript = batchChange.rollbackChange(updatedManuscript);
    expect(revertedManuscript).toEqual(manuscript);
  });

  it('should indicate empty change', () => {
    const batchChange = new BatchChange([new ProsemirrorChange('body', manuscript.body.tr)]);
    expect(batchChange.isEmpty).toBeTruthy();

    const batchChange2 = new BatchChange();
    expect(batchChange2.isEmpty).toBeTruthy();
  });

  it('should have a timestamp', () => {
    jest.spyOn(Date, 'now').mockReturnValue(123);
    const batchChange = new BatchChange([new ProsemirrorChange('body', manuscript.body.tr)]);
    expect(batchChange.timestamp).toBe(Date.now());
    jest.restoreAllMocks();
  });

  it('should apply batch change', () => {
    const change1 = new ProsemirrorChange('body', manuscript.body.tr.insertText('test content'));
    const change2 = new ProsemirrorChange('title', manuscript.title.tr.insertText('sample content'));
    const batchChange = new BatchChange([change1, change2]);

    expect(batchChange.toJSON()).toEqual({
      timestamp: expect.any(Number),
      type: 'batch',
      changes: [change1.toJSON(), change2.toJSON()]
    });
  });
});
