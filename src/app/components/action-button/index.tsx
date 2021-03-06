import React from 'react';
import { Button, PropTypes } from '@material-ui/core';
import { mapValues, isEqual } from 'lodash';

import { useActionButtonStyles } from './styles';

type MuiButtonVariant = 'text' | 'outlined' | 'contained';

const VARIANTS = {
  containedWarning: {
    variant: 'contained' as MuiButtonVariant,
    disableElevation: true,
    classes: {
      root: 'containedRedButton'
    }
  },
  outlinedWarning: {
    variant: 'outlined' as MuiButtonVariant,
    disableElevation: true,
    classes: {
      root: 'outlinedRedButton'
    }
  },
  primaryContained: {
    variant: 'contained' as MuiButtonVariant,
    color: 'primary',
    disableElevation: true,
    classes: {
      root: 'regularButton'
    }
  },
  secondaryOutlined: {
    disableElevation: true,
    variant: 'outlined',
    classes: {
      root: 'regularButton'
    }
  },
  addEntity: {
    disableElevation: true,
    size: 'medium',
    classes: { root: 'addEntityButton_root', startIcon: 'addEntityButton_icon' },
    variant: 'text',
    color: 'primary'
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
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = React.memo((props) => {
  const classes = useActionButtonStyles();
  const variantProps = VARIANTS[props.variant];
  const variantClasses = mapValues(variantProps.classes, (className: string) => classes[className]);
  const buttonProps = { ...variantProps, classes: variantClasses };
  return (
    <Button onClick={props.onClick} {...buttonProps} className={props.className} disabled={props.disabled}>
      {props.title}
    </Button>
  );
}, isEqual);
