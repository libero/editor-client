import React, { useRef, useMemo } from 'react';
import { isEqual } from 'lodash';
import classNames from 'classnames';

import { useSectionContainerStyles } from './styles';
import { ComponentWithId } from 'app/utils/types';

type SectionContainerVariant = 'outlined' | 'plain';
const DEFAULT_VARIANT = 'plain';

interface SectionContainerProps {
  label: string;
  focused?: boolean;
  className?: string;
  variant?: SectionContainerVariant;
}

export const SectionContainer: React.FC<ComponentWithId<SectionContainerProps>> = React.memo((props) => {
  const { children, label, variant, className, focused, id } = props;
  const classes = useSectionContainerStyles();
  const containerRef = useRef<HTMLDivElement>();

  const variantClass = useMemo(() => {
    const variantClass = {
      outlined: classes.outlinedVariant,
      plain: classes.plainVariant
    }[variant || DEFAULT_VARIANT];

    return classNames(classes.root, variantClass, { [classes.focused]: focused });
  }, [classes, focused, variant]);

  return (
    <div className={classNames(className, variantClass)} ref={containerRef} id={id}>
      <label className={classes.label}>{label}</label>
      {children}
    </div>
  );
}, isEqual);
