import React from 'react';
import { EditorState } from 'prosemirror-state';
import { KeywordsEditor } from '../index';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Keyword } from '../keyword';
import { NewKeywordSection } from '../new-keyword-section';

describe('KeywordsEditorComponent', () => {
  it('renders keywords', () => {
    const props = {
      keywords: [new EditorState()],
      label: 'Keywords label',
      onDelete: jest.fn(),
      onChange: jest.fn(),
      onAdd: jest.fn()
    };

    const component = create(<KeywordsEditor {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('fires events when changes appear on an existing keyword', () => {
    const props = {
      keywords: [new EditorState()], // EditorState[];
      label: 'Keywords label',
      onDelete: jest.fn(),
      onChange: jest.fn(),
      onAdd: jest.fn()
    };

    const component = shallow(<KeywordsEditor {...props} />);
    const keywordProps = component.find(Keyword).props();
    const change = props.keywords[0].tr;

    keywordProps.onChange(change);
    expect(props.onChange).toBeCalledWith(0, change);

    keywordProps.onDelete();
    expect(props.onDelete).toBeCalledWith(0);
  });

  it('fires events when changes appear on an a new keyword', () => {
    const props = {
      keywords: [new EditorState()], // EditorState[];
      label: 'Keywords label',
      onDelete: jest.fn(),
      onChange: jest.fn(),
      onAdd: jest.fn()
    };

    const component = shallow(<KeywordsEditor {...props} />);
    const newKeywordProps = component.find(NewKeywordSection).props();
    newKeywordProps.onEnter(newKeywordProps.editorState);
    expect(props.onAdd).toBeCalledWith(newKeywordProps.editorState);
  });
});