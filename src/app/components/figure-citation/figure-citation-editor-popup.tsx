import React, { useCallback, useState, SyntheticEvent } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Popper, Paper, ClickAwayListener, TextField, InputAdornment } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import { useFigureCitationEditorStyles } from 'app/components/figure-citation/styles';
import { EditorState } from 'prosemirror-state';
import { getBody } from 'app/selectors/manuscript.selectors';
import { useSelector } from 'react-redux';

export interface FiguresListEntry {
  id: string;
  name: string;
}

export const UNLABELLED_FIGURE_TEXT = 'Unlabelled figure';

interface FigureCitationEditorPopupProps {
  selectedIds: string[];
  onClose(): void;
  anchorEl: HTMLElement;
  onChange(selectedFigures: FiguresListEntry[]): void;
}

export const FigureCitationEditorPopup: React.FC<FigureCitationEditorPopupProps> = (props) => {
  const { onClose, onChange, anchorEl, selectedIds } = props;

  const bodyEditorState = useSelector(getBody);
  const figures = getAvailableFigures(bodyEditorState);

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
      const selectedFigures = figures.filter((figureEntry) => updatedIdsList.includes(figureEntry.id));
      onChange(selectedFigures);
    },
    [onChange, internalSelectedIds, setInternalSelectedIds, figures]
  );

  const clearFilterField = useCallback(() => {
    setFilterValue('');
    setFilteredList(figures);
  }, [setFilterValue, setFilteredList, figures]);

  return (
    <Popper open={true} anchorEl={anchorEl} style={{ zIndex: 1 }}>
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
                  <div className={classes.figureContent}>{fig.name || UNLABELLED_FIGURE_TEXT}</div>
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

function getAvailableFigures(editorState: EditorState): FiguresListEntry[] {
  const figureType = editorState.schema.nodes.figure;
  const foundFigures = [] as FiguresListEntry[];
  editorState.doc.descendants((childNode) => {
    if (childNode.type === figureType) {
      foundFigures.push({ id: childNode.attrs.id, name: childNode.attrs.label });
    }
    // do not descend into a node if it allows inline content since figure is a block node
    return !childNode.inlineContent;
  });
  return foundFigures;
}
