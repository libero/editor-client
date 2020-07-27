import React from 'react';

export type ReactFCProps<FC> = FC extends React.FC<infer P> ? P : {};

export type ValueOf<T> = T[keyof T];
