import React, { useState } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { IconButton, Popover, Paper, Typography, Divider, Input } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { MoreHoriz } from '@material-ui/icons';
import type { ControllerProps } from '../../state';

const DenseInput = withStyles({
  root: {
    width: '5.5em',
    fontSize: '0.7em',
  },
})(Input);

interface Props {
  axisIndex: number;
  max: number;
}

function AxisOptions({ sourceAtom, layerAtom, axisIndex, max }: ControllerProps<Props>) {
  const sourceData = useAtomValue(sourceAtom);
  const [layer, setLayer] = useAtom(layerAtom);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value = +event.target.value;
    // Restrict value to valid range
    if (value < 0) value = 0;
    if (value > max) value = max;

    setLayer((prev) => {
      let layerProps = { ...prev.layerProps };
      // for each channel, update index
      layerProps.selections = layerProps.selections.map((ch) => {
        let new_ch = [...ch];
        new_ch[axisIndex] = value;
        return new_ch;
      });

      return { ...prev, layerProps };
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? `${axisIndex}-index-${sourceData.id}-options` : undefined;
  const value = layer.layerProps.selections[0] ? layer.layerProps.selections[0][axisIndex] : 1;

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-describedby={id}
        style={{
          backgroundColor: 'transparent',
          padding: 0,
          zIndex: 2,
          cursor: 'pointer',
        }}
      >
        <MoreHoriz />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper style={{ padding: '0px 4px', marginBottom: 4 }}>
          <Typography variant="caption">Index:</Typography>
          <Divider />
          <DenseInput value={value} onChange={handleIndexChange} type="number" id="max" fullWidth={false} />
          <Divider />
        </Paper>
      </Popover>
    </>
  );
}

export default AxisOptions;
