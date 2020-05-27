import React from 'react';
import { Button, PropTypes } from '@material-ui/core';
import { mapValues } from 'lodash';
import AddIcon from '@material-ui/icons/Add';

import { useActionButtonStyles } from './styles';

type MuiButtonVariant = 'text' | 'outlined' | 'contained';

const VARIANTS = {
  containedWarning: {
    variant: 'contained' as MuiButtonVariant,
    classes: {
      root: 'containedRedButton'
    }
  },
  outlinedWarning: {
    variant: 'outlined' as MuiButtonVariant,
    classes: {
      root: 'outlinedRedButton'
    }
  },
  primaryContained: {
    variant: 'contained' as MuiButtonVariant,
    color: 'primary',
    classes: {}
  },
  secondaryOutlined: {
    variant: 'outlined',
    classes: {}
  },
  addEntity: {
    size: 'small',
    classes: { root: 'addEntityButton_root', startIcon: 'addEntityButton_icon' },
    variant: 'text',
    startIcon: <AddIcon />
  }
} as {
  [key: string]: {
    variant: MuiButtonVariant;
    classes: Record<string, string>;
    color?: PropTypes.Color;
  };
};

export type VariantType = keyof typeof VARIANTS;

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  variant: VariantType;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const classes = useActionButtonStyles();
  const variantProps = VARIANTS[props.variant];
  const variantClasses = mapValues(variantProps.classes, (className: string) => classes[className]);
  const buttonProps = { ...variantProps, classes: variantClasses };
  return (
    <Button onClick={props.onClick} {...buttonProps} className={props.className}>
      {props.title}
    </Button>
  );
};
