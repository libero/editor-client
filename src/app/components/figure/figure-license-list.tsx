import React, { useCallback, useContext } from 'react';
import { Button } from '@material-ui/core';
import { Node as ProsemirrorNode } from 'prosemirror-model';

import { FigureLicenseEditor } from 'app/components/figure/figure-license-editor';
import { NodeViewContext } from 'app/utils/view.utils';
import { createEmptyLicenseAttributes } from 'app/models/figure';
import { useFigureEditorStyles } from 'app/components/figure/styles';

interface FigureLicenseListProps {
  licenses: Array<{
    node: ProsemirrorNode;
    offset: number;
  }>;
}

const FIGURE_LICENSE_NODE_OFFSET_CORRECTION = 2;

export const FigureLicensesList: React.FC<FigureLicenseListProps> = (props) => {
  const { licenses } = props;
  const nodeViewContext = useContext(NodeViewContext);
  const classes = useFigureEditorStyles();

  const handleAddNewLicense = useCallback(() => {
    const newNodePosition = nodeViewContext.getPos() + nodeViewContext.getNode().nodeSize - 1;
    const newNode = nodeViewContext.view.state.schema.nodes.figureLicense.create({
      licenseInfo: createEmptyLicenseAttributes()
    });
    const change = nodeViewContext.view.state.tr.insert(newNodePosition, newNode);
    nodeViewContext.view.dispatch(change);
  }, [nodeViewContext]);

  return (
    <section>
      {licenses.map(({ node, offset }, index) => {
        return (
          <FigureLicenseEditor
            key={index}
            node={node}
            offset={offset + FIGURE_LICENSE_NODE_OFFSET_CORRECTION}
            index={index}
          />
        );
      })}
      <Button classes={{ root: classes.addLicenseCta }} onClick={handleAddNewLicense} color="primary">
        Add Licence
      </Button>
    </section>
  );
};
