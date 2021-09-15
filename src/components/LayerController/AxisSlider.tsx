import { Grid, Typography, Divider } from '@material-ui/core';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import React, { useState, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { debounce } from 'lodash';
import DimensionOptions from './AxisOptions';
import type { ControllerProps } from '../../state';

const WAIT = 500; // ms, debounce

const DenseSlider = withStyles({
  root: {
    color: 'white',
    padding: '10px 0px 5px 0px',
    marginRight: '5px',
  },
  active: {
    boxshadow: '0px 0px 0px 8px rgba(158, 158, 158, 0.16)',
  },
})(Slider);

interface Props {
  axisIndex: number;
  max: number;
}

function AxisSlider({ sourceAtom, layerAtom, axisIndex, max }: ControllerProps<Props>) {
  const [layer, setLayer] = useAtom(layerAtom);
  const sourceData = useAtomValue(sourceAtom);
  const { axis_labels } = sourceData;
  let axisLabel = axis_labels[axisIndex];
  if (axisLabel === 't' || axisLabel === 'z') {
    axisLabel = axisLabel.toUpperCase();
  }
  // state of the slider to update UI while dragging
  const [value, setValue] = useState(0);

  // If axis index change externally, need to update state
  useEffect(() => {
    // Use first channel to get initial value of slider - can be undefined on first render
    setValue(layer.layerProps.loaderSelection[0]?.[axisIndex] ?? 1);
  }, [layerAtom]);

  const updateSelection = debounce((v: number) => {
    setLayer((prev) => {
      let layerProps = { ...prev.layerProps };
      // for each channel, update index of this axis
      layerProps.loaderSelection = layerProps.loaderSelection.map((ch) => {
        let new_ch = [...ch];
        new_ch[axisIndex] = v;
        return new_ch;
      });
      return { ...prev, layerProps };
    });
  }, WAIT);

  const handleChange = (_: unknown, v: number | number[]) => {
    setValue(v as number);
    updateSelection(v as number);
  };

  return (
    <>
      <Grid>
        <Grid container justify="space-between">
          <Grid item xs={10}>
            <div style={{ width: 165, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography variant="caption" noWrap>
                {axisLabel}: {value}/{max}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={1}>
            <DimensionOptions sourceAtom={sourceAtom} layerAtom={layerAtom} axisIndex={axisIndex} max={max} />
          </Grid>
        </Grid>
        <Grid container justify="space-between">
          <Grid item xs={12}>
            <DenseSlider value={value} onChange={handleChange} min={0} max={max} step={1} />
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}

export default AxisSlider;
