import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useSectionContainerStyles } from './styles';
import classNames from 'classnames';

type SectionContainerVariant = 'outlined' | 'plain';
const DEFAULT_VARIANT = 'plain';

interface SectionContainerProps {
  label: string;
  variant?: SectionContainerVariant;
}

export const SectionContainer: React.FC<SectionContainerProps> = (props) => {
  const { children, label } = props;
  const classes = useSectionContainerStyles();
  const containerRef = useRef<HTMLDivElement>();
  const [focused, setFocused] = useState<boolean>();

  const handleFocus = useCallback(setFocused.bind(null, true), []);
  const handleBlur = useCallback(setFocused.bind(null, false), []);

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

  const variantClass = useMemo(
    () => ({
      outlined: classes.outlinedVariant,
      plain: classes.plainVariant
    }),
    [classes]
  )[props.variant || DEFAULT_VARIANT];

  return (
    <div className={classNames(classes.root, variantClass, { [classes.focused]: focused })} ref={containerRef}>
      <label className={classes.label}>{label}</label>
      {children}
    </div>
  );
};
