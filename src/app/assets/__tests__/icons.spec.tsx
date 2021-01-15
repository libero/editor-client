import React from 'react';
import { OrcidIcon, SubscriptIcon, SuperscriptIcon } from 'app/assets/icons';
import { create } from 'react-test-renderer';

describe('Icons', () => {
  it('SubscriptIcon', () => {
    const icon = create(<SubscriptIcon />);
    expect(icon).toMatchSnapshot();
  });

  it('SuperscriptIcon', () => {
    const icon = create(<SuperscriptIcon />);
    expect(icon).toMatchSnapshot();
  });

  it('OrcidIcon', () => {
    const icon = create(<OrcidIcon />);
    expect(icon).toMatchSnapshot();
  });
});
