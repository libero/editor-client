import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';

import { KeywordsEditor } from 'app/components/keywords/index';
import { KeywordSection } from 'app/components/keywords/keyword-section';
import { NewKeywordSection } from 'app/components/keywords/new-keyword-section';
import { createNewKeywordState } from 'app/models/keyword';

describe('KeywordsEditorComponent', () => {
  it('renders keywords', () => {
    const props = {
      keywords: [createNewKeywordState()],
      newKeyword: createNewKeywordState(),
      name: 'keyword-group',
      label: 'Keywords label',
      onDelete: jest.fn(),
      onChange: jest.fn(),
      onAdd: jest.fn(),
      onFocus: jest.fn(),
      onNewKeywordChange: jest.fn(),
      onBlur: jest.fn()
    };

    const component = create(<KeywordsEditor {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('fires events when changes appear on an existing keyword', () => {
    const props = {
      keywords: [createNewKeywordState()],
      newKeyword: createNewKeywordState(),
      name: 'keyword-group',
      label: 'Keywords label',
      onDelete: jest.fn(),
      onChange: jest.fn(),
      onAdd: jest.fn(),
      onFocus: jest.fn(),
      onNewKeywordChange: jest.fn(),
      onBlur: jest.fn()
    };

    const component = shallow(<KeywordsEditor {...props} />);
    const keywordProps = component.find(KeywordSection).props();
    const change = props.keywords[0].content.tr;

    keywordProps.onChange(props.keywords[0].id, change);
    expect(props.onChange).toBeCalledWith(props.name, props.keywords[0].id, change);

    keywordProps.onDelete(props.keywords[0]);
    expect(props.onDelete).toBeCalledWith(props.name, props.keywords[0]);
  });

  it('fires events when changes appear on an a new keyword', () => {
    const props = {
      keywords: [createNewKeywordState()],
      newKeyword: createNewKeywordState(),
      name: 'keyword-group',
      label: 'Keywords label',
      onDelete: jest.fn(),
      onChange: jest.fn(),
      onAdd: jest.fn(),
      onFocus: jest.fn(),
      onNewKeywordChange: jest.fn(),
      onBlur: jest.fn()
    };

    const component = shallow(<KeywordsEditor {...props} />);
    const newKeywordProps = component.find(NewKeywordSection).props();
    newKeywordProps.onEnter(newKeywordProps.editorState);
    expect(props.onAdd).toBeCalledWith(props.name, { id: props.newKeyword.id, content: newKeywordProps.editorState });
  });
});
