import React from 'react';
import { Drawer, Divider } from '@material-ui/core';

import './styles.scss';

export const ManuscriptTOC: React.FC = () => {
  const renderContent = () => (
    <Drawer variant='permanent' anchor='left'>
      <div>Libero Editor</div>
      <div>v0.0.1</div>
      <Divider />
    </Drawer>
  );

  return renderContent();
};
