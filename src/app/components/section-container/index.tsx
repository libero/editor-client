import React from 'react';
import { useSectionContainerStyles } from './styles';

interface SectionContainerProps {
  label: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = (props) => {
  const { children, label } = props;
  const classes = useSectionContainerStyles();

  return (
    <section className={classes.root}>
      <label className={classes.label}>{label}</label>
      {children}
    </section>
  );
};
