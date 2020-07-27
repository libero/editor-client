import React, { ChangeEvent, useCallback } from 'react';
import { MenuItem, Select as MuiSelect, FormControl, InputLabel } from '@material-ui/core';
import { isEqual, get, cloneDeep } from 'lodash';

import { useSelectComponentStyles } from './styles';

type SelectValueType = number | string | boolean | object | undefined;

interface SelectProps {
  name?: string;
  blankValue?: SelectValueType;
  className?: string;
  label?: string;
  fullWidth?: boolean;
  placeholder?: string;
  value?: SelectValueType;
  options: Array<{ label: string; value: SelectValueType }>;
  onChange?(event: ChangeEvent<{ name: string; value: SelectValueType }>): void;
}

export const Select: React.FC<SelectProps> = React.memo(
  ({ fullWidth, placeholder, name, className, label, value, options, onChange, blankValue }) => {
    const classes = useSelectComponentStyles();
    const labelId = getNextId();
    const muiOptions = options.map((option) => ({
      ...option,
      disabled: false,
      muiValue: getNextId()
    }));

    if (placeholder) {
      muiOptions.unshift({
        muiValue: getNextId(),
        label: placeholder,
        value: blankValue,
        disabled: true
      });
    }

    const getMuiValue = useCallback(
      (value: SelectValueType) => {
        const muiOption = muiOptions.find((option) => option.value === value);
        return get(muiOption, 'muiValue');
      },
      [muiOptions]
    );

    const handleChange = useCallback(
      (event: ChangeEvent<{ name: string; value: string }>) => {
        const selectedOption = muiOptions.find(({ muiValue }) => muiValue === event.target.value);
        const newEvent = cloneDeep(event) as ChangeEvent<{ name: string; value: SelectValueType }>;
        newEvent.target.value = get(selectedOption, 'value');
        onChange && onChange(newEvent);
      },
      [muiOptions, onChange]
    );
    return (
      <FormControl variant="outlined" className={className} fullWidth={fullWidth}>
        <InputLabel shrink id={labelId}>
          {label}
        </InputLabel>
        <MuiSelect
          name={name}
          displayEmpty
          value={getMuiValue(value)}
          onChange={handleChange}
          labelId={labelId}
          label={label}
          classes={{ root: value === blankValue ? classes.blankOptionSelected : undefined }}
        >
          {muiOptions.map((option) => (
            <MenuItem disabled={option.disabled} value={option.muiValue}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    );
  },
  isEqual
);

let selectId = 0;
function getNextId(): string {
  return `select-id-${selectId++}`;
}
