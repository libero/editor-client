import React from 'react';
import { create } from 'react-test-renderer';
import { SectionContainer } from 'app/components/section-container/index';

describe('Prompt Dialog', () => {
  it('renders section container', () => {
    const wrapper = create(
      <SectionContainer label="test">
        <div />
      </SectionContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders section container', () => {
    const wrapper = create(
      <SectionContainer label="test" variant="plain">
        <div />
      </SectionContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
