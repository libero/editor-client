import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSectionContainerStyles } from './styles';
import classNames from 'classnames';

interface SectionContainerProps {
  label: string;
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

  return (
    <div className={classNames(classes.root, { [classes.focused]: focused })} ref={containerRef}>
      <label className={classes.label}>{label}</label>
      {children}
    </div>
  );
};
