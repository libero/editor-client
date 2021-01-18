import React from 'react';

export type ReactFCProps<FC> = FC extends React.FC<infer P> ? P : {};

export type ValueOf<T> = T[keyof T];

export type ComponentWithId<T = {}> = {
  [k in keyof T]: T[k];
} & { id?: string };

export type ListType = 'order' | 'bullet';

type Primitives = number | string | boolean | null | undefined;

export type JSONObject = {
  [k: string]: Primitives | JSONObject | Array<Primitives | JSONObject>;
};
