import React from 'react';
import { create } from 'react-test-renderer';
import { PromptDialog } from 'app/components/prompt-dialog/index';

jest.mock('@material-ui/core', () => ({
  Dialog: ({ children }) => <div data-cmp="dialog">{children}</div>,
  DialogTitle: ({ children }) => <div data-cmp="dialog-title">{children}</div>,
  DialogActions: ({ children }) => <div data-cmp="dialog-actions">{children}</div>,
  DialogContent: ({ children }) => <div data-cmp="dialog-content">{children}</div>,
  DialogContentText: ({ children }) => <div data-cmp="dialog-content-text">{children}</div>,
  Content: ({ children }) => <div data-cmp="dialog-content">{children}</div>,
  Typography: () => <div data-cmp="typography"></div>,
  Button: () => <div data-cmp="Button"></div>
}));

describe('Prompt Dialog', () => {
  it('renders prompt dialog', () => {
    const wrapper = create(
      <PromptDialog
        isOpen={true}
        message="testMessage"
        title="testTitle"
        onReject={jest.fn()}
        onAccept={jest.fn()}
        acceptLabel="Okido"
        rejectLabel="Nope"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders prompt with default params', () => {
    const wrapper = create(
      <PromptDialog isOpen={true} message="testMessage" title="testTitle" onReject={jest.fn()} onAccept={jest.fn()} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
