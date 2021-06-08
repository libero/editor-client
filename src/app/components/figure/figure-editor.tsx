import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Selection } from 'prosemirror-state';
import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, TextField } from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

import { useFigureEditorStyles } from 'app/components/figure/styles';
import { getImageFileUpload } from 'app/utils/view.utils';
import { FigureContentEditor } from 'app/components/figure/figure-content-editor';
import { EditorView } from 'prosemirror-view';
import { FigureLicensesList } from './figure-license-list';
import { renderConfirmDialog } from 'app/components/prompt-dialog';
import DragIcon from 'app/assets/drag-indicator-grey.svg';
import { useDispatch, useSelector } from 'react-redux';
import { updateFigureImageAction } from 'app/actions/manuscript.actions';
import { getManuscriptId } from 'app/selectors/manuscript-editor.selectors';

/* Prosemirror relies heavily on the positioning of nodes in its internal state presentation.
  Given figure structure

  <figure>
    <figureTitle>Title content</figureTitle>
    <figureLegend>Legend content</figureLegend>
  </figure>

  Method getPos of NodeView will return a position of just before the <figure>. Then position of figureTitle node
  in the entire document will be getPos() + 1 and the position of text content of title is getPos() + 2.
  When creating a new EditorState for figureTitleNode we supply the node itself as a document. In this new document
  the position of text is 0 (zero), thus we are losing the offset of "2". Wh
  en translating all changes to the main document we need to put this adjustments back.
 */

const FIGURE_TITLE_CONTENT_OFFSET_CORRECTION = 2;
const FIGURE_LEGEND_CONTENT_OFFSET_CORRECTION = 2;
const FIGURE_ATTRIBUTION_CONTENT_OFFSET_CORRECTION = 2;

export interface FigureEditorHandle {
  updateContent(node: ProsemirrorNode): void;
  focusFromSelection(selection: Selection, figurePos: number): void;
  hasFocus(): boolean;
}

interface FigureEditorProps {
  node: ProsemirrorNode;
  getParentNodePos: () => number;
  parentView: EditorView;
  onDelete(): void;
  onAttributesChange(img: string, label: string): void;
}

export const FigureEditor = React.forwardRef((props: FigureEditorProps, ref) => {
  const { onDelete, onAttributesChange } = props;
  const manuscriptId = useSelector(getManuscriptId);
  const [figureNode, setFigureNode] = useState<ProsemirrorNode>(props.node);
  const [isConfirmShown, setConfirmShown] = useState<boolean>(false);
  const dispatch = useDispatch();
  const classes = useFigureEditorStyles();
  const titleNodeData = findChildrenByType(figureNode, figureNode.type.schema.nodes.figureTitle)[0];
  const legendNodeData = findChildrenByType(figureNode, figureNode.type.schema.nodes.figureLegend)[0];
  const attributionNodeData = findChildrenByType(figureNode, figureNode.type.schema.nodes.figureAttribution)[0];
  const licenseNodesData = findChildrenByType(figureNode, figureNode.type.schema.nodes.figureLicense);
  const handleDeleteAccept = useCallback(() => {
    setConfirmShown(false);
    onDelete();
  }, [onDelete]);

  const handleDeleteReject = useCallback(() => {
    setConfirmShown(false);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setConfirmShown(true);
  }, []);

  const handleLabelChange = useCallback(
    (event) => {
      onAttributesChange(event.target['value'], figureNode.attrs.img);
    },
    [figureNode, onAttributesChange]
  );

  const handleUploadImageClick = useCallback(() => {
    getImageFileUpload((image: File) => {
      dispatch(updateFigureImageAction({ figurePos: props.getParentNodePos(), imgFile: image }));
    });
  }, [dispatch, props]);

  useImperativeHandle(ref, () => ({
    updateContent: (updatedFigureNode: ProsemirrorNode) => {
      setFigureNode(updatedFigureNode);
    }
  }));

  return (
    <div className={classes.figureContainer}>
      <div className={classes.figureContent}>
        <img src={DragIcon} alt="drag handle" aria-hidden={true} className="drag-handle" />
        <TextField
          fullWidth
          name="figureNumber"
          label="Figure number"
          classes={{ root: classes.inputField }}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={figureNode.attrs.label}
          onChange={handleLabelChange}
        />
        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            alt="figure"
            src={
              figureNode.attrs.img
                ? `/api/v1/articles/${manuscriptId}/assets/${figureNode.attrs.img.replace(/\.tiff?$/, '.jpeg')}`
                : ''
            }
          />
          <IconButton classes={{ root: classes.uploadImageCta }} onClick={handleUploadImageClick}>
            <AddPhotoAlternateIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.inputField}>
          <FigureContentEditor
            label="Title"
            node={titleNodeData.node}
            offset={titleNodeData.offset + FIGURE_TITLE_CONTENT_OFFSET_CORRECTION}
          />
        </div>
        <div className={classes.inputField}>
          <FigureContentEditor
            label="Legend"
            node={legendNodeData.node}
            offset={legendNodeData.offset + FIGURE_LEGEND_CONTENT_OFFSET_CORRECTION}
          />
        </div>
        <div>
          <FigureContentEditor
            label="Attribution"
            node={attributionNodeData.node}
            offset={attributionNodeData.offset + FIGURE_ATTRIBUTION_CONTENT_OFFSET_CORRECTION}
          />
        </div>
        <FigureLicensesList licenses={licenseNodesData} />
      </div>
      <IconButton classes={{ root: classes.deleteButton }} onClick={handleDeleteClick}>
        <DeleteIcon fontSize="small" />
      </IconButton>
      {isConfirmShown
        ? renderConfirmDialog(
            'You are deleting a figure',
            'Deleting a figure will remove all linked citations from this article. Are you sure you want to proceed?',
            handleDeleteAccept,
            handleDeleteReject
          )
        : undefined}
    </div>
  );
});

function findChildrenByType(
  node: ProsemirrorNode,
  nodeType: NodeSpec
): Array<{ node: ProsemirrorNode; offset: number }> {
  const foundChildren = [];
  node.descendants((childNode, pos) => {
    if (nodeType === childNode.type) {
      foundChildren.push({ node: childNode, offset: pos });
    }
    return false;
  });
  return foundChildren;
}
