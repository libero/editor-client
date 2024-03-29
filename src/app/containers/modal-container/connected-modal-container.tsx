import React from 'react';
import { useSelector } from 'react-redux';

import { isModalVisible, getModalParams } from '../../selectors/manuscript-editor.selectors';
import { ModalContainer } from './modal-container';

export const ConnectedModalContainer: React.FC<{}> = () => {
  const isVisible = useSelector(isModalVisible);
  const params = useSelector(getModalParams);
  return isVisible ? <ModalContainer params={params.props} component={params.component} title={params.title} /> : <></>;
};
