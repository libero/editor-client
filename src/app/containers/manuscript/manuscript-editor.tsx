import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAbstract, getKeywords, getTitle } from '../../selectors/manuscript.selectors';
import * as manuscriptActions from '../../actions/manuscript.actions';
import { RichTextEditor } from '../../components/rich-text-editor';

import { EditorState, Transaction } from 'prosemirror-state';
import { KeywordsEditor } from '../../components/keywords';
import { KeywordGroups } from '../../models/manuscript';

export const ManuscriptEditor: React.FC = () => {
  const dispatch = useDispatch();

  const title: EditorState = useSelector(getTitle);
  const abstract: EditorState = useSelector(getAbstract);
  const allKeywords: KeywordGroups = useSelector(getKeywords);

  const handleTitleChange = (diff: Transaction) => {
    dispatch(manuscriptActions.updateTitleAction(diff));
  };

  const handleKeywordsChange = (keywordGroup: string, index: number, diff: Transaction) => {
    dispatch(manuscriptActions.updateKeywordsAction({ keywordGroup, index, change: diff }));
  };

  const handleAbstractChange = (diff: Transaction) => {
    dispatch(manuscriptActions.updateAbstractAction(diff));
  };

  const handleKeywordDelete = (keywordGroup: string, index: number) => {
    dispatch(manuscriptActions.deleteKeywordAction({ keywordGroup, index }));
  };

  const handleKeywordAdd = (keywordGroup: string, keyword: EditorState) => {
    dispatch(manuscriptActions.addNewKeywordAction({ keywordGroup, keyword }));
  };

  const renderKeywords = (keywordGroups: KeywordGroups) => {
    return Object.entries(keywordGroups).map(([groupType, keywords]) => {
      return (
        <div className='manuscript-field' key={groupType}>
          <KeywordsEditor
            keywords={keywords}
            label={groupType}
            onAdd={handleKeywordAdd.bind(null, groupType)}
            onChange={handleKeywordsChange.bind(null, groupType)}
            onDelete={handleKeywordDelete.bind(null, groupType)}
          />
        </div>
      );
    });
  };

  return (
    <div className='manuscript-editor'>
      <div className='manuscript-field'>
        <RichTextEditor editorState={title} label='Title' onChange={handleTitleChange} />
      </div>
      <div className="manuscript-field">
        <RichTextEditor editorState={abstract} label="Abstract" onChange={handleAbstractChange} />
      </div>
      {renderKeywords(allKeywords)}
    </div>
  );
};
