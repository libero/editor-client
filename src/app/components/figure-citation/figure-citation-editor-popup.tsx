import React, { useCallback, useState, SyntheticEvent } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Popper, Paper, ClickAwayListener, TextField, InputAdornment } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import { useFigureCitationEditorStyles } from 'app/components/figure-citation/styles';

export interface FiguresListEntry {
  id: string;
  name: string;
}

interface FigureCitationEditorPopupProps {
  selectedIds: string[];
  figures: FiguresListEntry[];
  onClose(): void;
  anchorEl: HTMLElement;
  onChange(ids: string[]): void;
}

export const FigureCitationEditorPopup: React.FC<FigureCitationEditorPopupProps> = (props) => {
  const { onClose, onChange, anchorEl, figures, selectedIds } = props;
  const [filteredList, setFilteredList] = useState<FiguresListEntry[]>(figures);
  const [filterValue, setFilterValue] = useState<string>('');
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(selectedIds);
  const classes = useFigureCitationEditorStyles();

  const handleFilterChange = useCallback(
    (event) => {
      const filterValue = event.target['value'].toLowerCase();
      setFilterValue(event.target['value']);
      setFilteredList(
        figures.filter((fig) => {
          return fig.name.toLowerCase().indexOf(filterValue) >= 0 || internalSelectedIds.includes(fig.id);
        })
      );
    },
    [internalSelectedIds, setFilterValue, figures]
  );
  const handleClick = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const figId = (event.currentTarget as HTMLLIElement).dataset['figId'];
      const updatedIdsList = internalSelectedIds.includes(figId)
        ? internalSelectedIds.filter((id) => id !== figId)
        : [...internalSelectedIds, figId];
      setInternalSelectedIds(updatedIdsList);
      onChange(updatedIdsList);
    },
    [onChange, internalSelectedIds, setInternalSelectedIds]
  );

  const clearFilterField = useCallback(() => {
    setFilterValue('');
    setFilteredList(figures);
  }, [setFilterValue, setFilteredList, figures]);

  return (
    <Popper open={true} anchorEl={anchorEl}>
      <Paper>
        <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseUp">
          <div>
            <TextField
              fullWidth
              classes={{ root: classes.filterField }}
              InputLabelProps={{ shrink: true }}
              label="Filter list"
              value={filterValue}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <ClearIcon
                      onClick={clearFilterField}
                      color="disabled"
                      classes={{ root: classes.clearFilterIcon }}
                    />
                  </InputAdornment>
                )
              }}
              onChange={handleFilterChange}
            />
            <ul className={classes.figureSelectionList}>
              {filteredList.map((fig) => (
                <li className={classes.figureSelectionListItem} key={fig.id} data-fig-id={fig.id} onClick={handleClick}>
                  <div className={classes.figureContent}>{fig.name}</div>
                  <div className={classes.figureTick}>
                    <CheckCircleIcon
                      color="primary"
                      className={!internalSelectedIds.includes(fig.id) ? classes.hiddenIcon : ''}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
};
