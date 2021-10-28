import React from 'react';
import { create } from 'react-test-renderer';
import { ActionButton } from '../index';

describe('Action Button', () => {
  it('renders action button secondaryOutlined', () => {
    const wrapper = create(<ActionButton variant="secondaryOutlined" onClick={jest.fn()} title="secondaryOutlined" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders action button containedWarning', () => {
    const wrapper = create(<ActionButton variant="containedWarning" onClick={jest.fn()} title="containedWarning" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders action button outlinedWarning', () => {
    const wrapper = create(<ActionButton variant="outlinedWarning" onClick={jest.fn()} title="outlinedWarning" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders action button primaryContained', () => {
    const wrapper = create(<ActionButton variant="primaryContained" onClick={jest.fn()} title="primaryContained" />);
    expect(wrapper).toMatchSnapshot();
  });
});
