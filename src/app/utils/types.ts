import React from 'react';

export type ReactFCProps<FC> = FC extends React.FC<infer P> ? P : {};
