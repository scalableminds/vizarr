import { Grid, Typography, Divider } from '@material-ui/core';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import DimensionOptions from './AxisOptions';

import type { PrimitiveAtom } from 'jotai';
import type { SourceData } from '../../state';

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

interface AxisSliderProps {
  axisIndex: number;
  max: number;
  selectionsAtom: PrimitiveAtom<number[][]>;
  sourceAtom: PrimitiveAtom<SourceData & { id: string }>;
}

function AxisSlider({ sourceAtom, selectionsAtom, axisIndex, max }: AxisSliderProps) {
  const [selections, setSelections] = useAtom(selectionsAtom);
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
    setValue(selections[0] ? selections[0][axisIndex] : 1);
  }, [selections]);

  const handleRelease = () => {
    // for each channel, update index of this axis
    setSelections((prev) =>
      prev.map((ch) => {
        let new_ch = [...ch];
        new_ch[axisIndex] = value;
        return new_ch;
      })
    );
  };

  const handleDrag = (_: ChangeEvent<unknown>, value: number | number[]) => {
    setValue(value as number);
  };

  return (
    <>
      <Grid>
        <Grid container justifyContent="space-between">
          <Grid item xs={10}>
            <div style={{ width: 165, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography variant="caption" noWrap>
                {axisLabel}: {value}/{max}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={1}>
            <DimensionOptions sourceAtom={sourceAtom} selectionsAtom={selectionsAtom} axisIndex={axisIndex} max={max} />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid item xs={12}>
            <DenseSlider
              value={value}
              onChange={handleDrag}
              onChangeCommitted={handleRelease}
              min={0}
              max={max}
              step={1}
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}

export default AxisSlider;
