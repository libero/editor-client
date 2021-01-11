import React from 'react';
import { EditorState } from 'prosemirror-state';
import { KeywordsEditor } from 'app/components/keywords/index';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { KeywordSection } from 'app/components/keywords/keyword-section';
import { NewKeywordSection } from 'app/components/keywords/new-keyword-section';

describe('KeywordsEditorComponent', () => {
  it('renders keywords', () => {
    const props = {
      keywords: [new EditorState()],
      newKeyword: new EditorState(),
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
      keywords: [new EditorState()],
      newKeyword: new EditorState(),
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
    const change = props.keywords[0].tr;

    keywordProps.onChange(change);
    expect(props.onChange).toBeCalledWith(props.name, 0, change);

    keywordProps.onDelete();
    expect(props.onDelete).toBeCalledWith(props.name, 0);
  });

  it('fires events when changes appear on an a new keyword', () => {
    const props = {
      keywords: [new EditorState()],
      newKeyword: new EditorState(),
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
    expect(props.onAdd).toBeCalledWith(props.name, newKeywordProps.editorState);
  });
});
