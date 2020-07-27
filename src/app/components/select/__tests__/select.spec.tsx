import React from 'react';
import { create } from 'react-test-renderer';

import { Select } from '..';

describe('Select component', () => {
  it('should render component', () => {
    const wrapper = create(
      <Select
        className={'test-class-name'}
        name="articleType"
        placeholder="Please select"
        fullWidth
        blankValue={undefined}
        label="Competing interest"
        value={false}
        onChange={jest.fn()}
        options={[
          { label: 'No competing interest', value: false },
          { label: 'Has competing interest', value: true }
        ]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
