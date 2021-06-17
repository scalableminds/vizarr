import React, {useState} from "../../../_snowpack/pkg/react.js";
import {useAtom} from "../../../_snowpack/pkg/jotai.js";
import {useAtomValue} from "../../../_snowpack/pkg/jotai/utils.js";
import {IconButton, Popover, Paper, Typography, Divider, NativeSelect} from "../../../_snowpack/pkg/@material-ui/core.js";
import {Add} from "../../../_snowpack/pkg/@material-ui/icons.js";
import {hexToRGB, MAX_CHANNELS} from "../../utils.js";
function AddChannelButton({sourceAtom, layerAtom}) {
  const sourceData = useAtomValue(sourceAtom);
  const [layer, setLayer] = useAtom(layerAtom);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event) => {
    const {
      defaults: {selection},
      channel_axis,
      colors,
      contrast_limits
    } = sourceData;
    handleClose();
    const channelIndex = +event.target.value;
    const channelSelection = [...selection];
    if (channel_axis) {
      channelSelection[channel_axis] = channelIndex;
    }
    setLayer((prev) => {
      const {layerProps} = prev;
      const loaderSelection = [...layerProps.loaderSelection, channelSelection];
      const colorValues = [...layerProps.colorValues, hexToRGB(colors[channelIndex])];
      const sliderValues = [...layerProps.sliderValues, contrast_limits[channelIndex]];
      const contrastLimits = [...sliderValues];
      const channelIsOn = [...layerProps.channelIsOn, true];
      return {
        ...prev,
        layerProps: {
          ...layerProps,
          loaderSelection,
          colorValues,
          sliderValues,
          contrastLimits,
          channelIsOn
        }
      };
    });
  };
  const {names} = sourceData;
  const open = Boolean(anchorEl);
  const id = open ? `layer-${sourceData.id}-add-channel` : void 0;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: handleClick,
    "aria-describedby": id,
    style: {
      backgroundColor: "transparent",
      padding: 0,
      zIndex: 2,
      cursor: "pointer"
    },
    disabled: layer.layerProps.loaderSelection.length === MAX_CHANNELS
  }, /* @__PURE__ */ React.createElement(Add, null)), /* @__PURE__ */ React.createElement(Popover, {
    id,
    open,
    anchorEl,
    onClose: handleClose,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    }
  }, /* @__PURE__ */ React.createElement(Paper, {
    style: {padding: "0px 4px", marginBottom: 4, width: "8em"}
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "caption"
  }, "selection: "), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(NativeSelect, {
    fullWidth: true,
    style: {fontSize: "0.7em"},
    id: `layer-${sourceData.id}-channel-select`,
    onChange: handleChange
  }, /* @__PURE__ */ React.createElement("option", {
    "aria-label": "None",
    value: ""
  }, "None"), names.map((name, i) => /* @__PURE__ */ React.createElement("option", {
    value: i,
    key: name
  }, name))))));
}
export default AddChannelButton;
