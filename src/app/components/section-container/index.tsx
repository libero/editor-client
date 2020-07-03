import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { isEqual } from 'lodash';
import classNames from 'classnames';

import { useSectionContainerStyles } from './styles';

type SectionContainerVariant = 'outlined' | 'plain';
const DEFAULT_VARIANT = 'plain';

interface SectionContainerProps {
  label: string;
  className?: string;
  variant?: SectionContainerVariant;
}

export const SectionContainer: React.FC<SectionContainerProps> = React.memo((props) => {
  const { children, label, variant, className } = props;
  const classes = useSectionContainerStyles();
  const containerRef = useRef<HTMLDivElement>();
  const [focused, setFocused] = useState<boolean>();
  const handleFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  useEffect(() => {
    const containerNode = containerRef.current;
    if (containerNode) {
      containerNode.addEventListener('focus', handleFocus, true);
      containerNode.addEventListener('blur', handleBlur, true);

      return () => {
        containerNode.removeEventListener('focus', handleFocus, true);
        containerNode.removeEventListener('blur', handleBlur, true);
      };
    }
  }, [containerRef, handleFocus, handleBlur]);

  const variantClass = useMemo(() => {
    const variantClass = {
      outlined: classes.outlinedVariant,
      plain: classes.plainVariant
    }[variant || DEFAULT_VARIANT];

    return classNames(classes.root, variantClass, { [classes.focused]: focused });
  }, [classes, focused, variant]);

  return (
    <div className={classNames(className, variantClass)} ref={containerRef}>
      <label className={classes.label}>{label}</label>
      {children}
    </div>
  );
}, isEqual);
