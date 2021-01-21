import React, { useCallback, SyntheticEvent, ChangeEvent } from 'react';
import { TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { EditorState, Transaction } from 'prosemirror-state';
import { RichTextInput } from 'app/components/rich-text-input';
import { ReferenceContributor} from 'app/models/reference';
import { ReferenceContributorsList } from 'app/containers/reference-form-dialog/reference-contributors-list';
import { Select } from 'app/components/select';
import {ReferenceType} from "app/models/reference-type";

export type RefInfoChangeCallback<T> = (name: string, value: T) => void;

interface ReferenceInputTypeProps<T> {
  label: string;
  name: string;
  className?: string;
  value: T;
  onChange: RefInfoChangeCallback<T>;
  error?: boolean;
}

export const StringInput: React.FC<ReferenceInputTypeProps<string>> = (props) => {
  const { onChange } = props;
  const handleChange = useCallback(
    (event: SyntheticEvent) => {
      const name = event.target['name'];
      const value = event.target['value'];
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <TextField
      name={props.name}
      fullWidth
      label={props.label}
      classes={{ root: props.className }}
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      value={props.value}
      onChange={handleChange}
      error={props.error}
    />
  );
};

export const DateInput: React.FC<ReferenceInputTypeProps<string>> = (props) => {
  const { onChange } = props;
  const handleChange = useCallback(
    (event: SyntheticEvent) => {
      const name = event.target['name'];
      const value = event.target['value'];
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <TextField
      name={props.name}
      fullWidth
      type="date"
      label={props.label}
      classes={{ root: props.className }}
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      value={props.value}
      onChange={handleChange}
      error={props.error}
    />
  );
};

export const SpecificUseInput: React.FC<ReferenceInputTypeProps<string>> = (props) => {
  const { onChange } = props;
  const handleChange = useCallback(
    (event: ChangeEvent<{ name: string; value: ReferenceType }>) => {
      const name = event.target['name'];
      const value = event.target['value'];
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <Select
      className={props.className}
      name={props.name}
      placeholder="Please select"
      fullWidth
      blankValue={undefined}
      label={props.label}
      value={props.value}
      onChange={handleChange}
      options={[
        { label: 'Analyzed', value: 'analyzed' },
        { label: 'Generated', value: 'generated' }
      ]}
    />
  );
};

export const NumberInput: React.FC<ReferenceInputTypeProps<number>> = (props) => {
  const { onChange } = props;
  const handleChange = useCallback(
    (event: SyntheticEvent) => {
      const name = event.target['name'];
      const value = event.target['value'];
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <TextField
      name={props.name}
      fullWidth
      label={props.label}
      classes={{ root: props.className }}
      InputLabelProps={{ shrink: true }}
      inputProps={{ type: 'number', min: 0 }}
      variant="outlined"
      value={props.value}
      onChange={handleChange}
    />
  );
};

export const EditorsListInput: React.FC<ReferenceInputTypeProps<ReferenceContributor[]>> = (props) => {
  const { onChange, name } = props;
  const handleChange = useCallback(
    (editors: ReferenceContributor[]) => {
      onChange(name, editors);
    },
    [onChange, name]
  );

  return (
    <ReferenceContributorsList
      className={props.className}
      refContributors={props.value}
      onChange={handleChange}
      entityName="editor"
      addCtaLabel={'Add Editor'}
    />
  );
};

export const TextInput: React.FC<ReferenceInputTypeProps<EditorState>> = (props) => {
  const { onChange, name, value } = props;
  const handleChange = useCallback(
    (change: Transaction) => {
      onChange(props.name, value.apply(change));
    },
    [onChange, props.name, value]
  );

  return (
    <RichTextInput
      editorState={value}
      name={name}
      onChange={handleChange}
      label={props.label}
      className={props.className}
      error={props.error}
    />
  );
};

export const CheckboxInput: React.FC<ReferenceInputTypeProps<boolean>> = (props) => {
  const { onChange } = props;
  const handleChange = useCallback(
    (event: SyntheticEvent) => {
      const name = event.target['name'];
      const value = event.target['checked'];
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <FormControlLabel
      control={<Checkbox name={props.name} color="primary" onChange={handleChange} checked={props.value} />}
      label={props.label}
      className={props.className}
    />
  );
};

export function renderFormControl<T>(
  type: string,
  label: string,
  name: string,
  className: string,
  value: T,
  onChange: RefInfoChangeCallback<T>,
  error: boolean = false
): React.ReactElement {
  const Component = {
    string: StringInput,
    'rich-text': TextInput,
    number: NumberInput,
    boolean: CheckboxInput,
    'specific-use': SpecificUseInput,
    'editors-list': EditorsListInput,
    date: DateInput
  }[type];

  if (!Component) {
    return;
  }

  const props = { label, name, value, onChange, className, error };
  return <Component {...props} />;
}
