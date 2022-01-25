import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { AccordionDetails, Grid, Typography, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import AcquisitionController from './AcquisitionController';
import AddChannelButton from './AddChannelButton';
import OpacitySlider from './OpacitySlider';
import AxisSliders from './AxisSliders';
import ChannelController from './ChannelController';

import { range } from '../../utils';

import type { PrimitiveAtom } from 'jotai';
import type { SourceData, LayerState } from '../../state';

const Details = withStyles({
  root: {
    padding: '2px 5px',
    borderLeft: '1px solid rgba(150, 150, 150, .2)',
    borderRight: '1px solid rgba(150, 150, 150, .2)',
  },
})(AccordionDetails);

interface ContentProps {
  sourceAtom: PrimitiveAtom<SourceData & { id: string }>;
  layerAtom: PrimitiveAtom<LayerState>;
  selectionsAtom: PrimitiveAtom<number[][]>;
}

function Content({ sourceAtom, layerAtom, selectionsAtom }: ContentProps) {
  const layer = useAtomValue(layerAtom);
  const nChannels = layer.layerProps.selections.length;
  return (
    <Details>
      <Grid container direction="column">
        <AcquisitionController sourceAtom={sourceAtom} layerAtom={layerAtom} />
        <Grid>
          <Grid container justifyContent="space-between">
            <Grid item xs={3}>
              <Typography variant="caption">opacity:</Typography>
            </Grid>
            <Grid item xs={8}>
              <OpacitySlider sourceAtom={sourceAtom} layerAtom={layerAtom} />
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <AxisSliders sourceAtom={sourceAtom} selectionsAtom={selectionsAtom} />
        <Grid container justifyContent="space-between">
          <Grid item xs={3}>
            <Typography variant="caption">channels:</Typography>
          </Grid>
          <Grid item xs={1}>
            <AddChannelButton sourceAtom={sourceAtom} layerAtom={layerAtom} />
          </Grid>
        </Grid>
        <Divider />
        <Grid>
          {range(nChannels).map((i) => (
            <ChannelController sourceAtom={sourceAtom} layerAtom={layerAtom} channelIndex={i} key={i} />
          ))}
        </Grid>
      </Grid>
    </Details>
  );
}

export default Content;
