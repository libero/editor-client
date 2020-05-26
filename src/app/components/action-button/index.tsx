import React from 'react';
import { Button, PropTypes } from '@material-ui/core';
import { useActionButtonStyles } from './styles';
import { mapValues } from 'lodash';

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
}

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const classes = useActionButtonStyles();
  const variantProps = VARIANTS[props.variant];
  const variantClasses = mapValues(variantProps.classes, (className: string) => classes[className]);
  const buttonProps = { ...variantProps, classes: variantClasses };
  return (
    <Button onClick={props.onClick} {...buttonProps}>
      {props.title}
    </Button>
  );
};
