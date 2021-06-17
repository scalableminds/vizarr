import React from "../../../_snowpack/pkg/react.js";
import {Grid, Divider} from "../../../_snowpack/pkg/@material-ui/core.js";
import {useAtomValue} from "../../../_snowpack/pkg/jotai/utils.js";
import AxisSlider from "./AxisSlider.js";
function AxisSliders({sourceAtom, layerAtom}) {
  const sourceData = useAtomValue(sourceAtom);
  const {axis_labels, channel_axis, loader} = sourceData;
  const sliders = axis_labels.slice(0, -2).map((name, i) => [name, i, loader[0].shape[i]]).filter((d) => {
    if (d[1] === channel_axis)
      return false;
    if (d[2] > 1)
      return true;
    return false;
  }).map(([name, i, size]) => /* @__PURE__ */ React.createElement(AxisSlider, {
    key: name,
    sourceAtom,
    layerAtom,
    axisIndex: i,
    max: size - 1
  }));
  if (sliders.length === 0)
    return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, null, sliders), /* @__PURE__ */ React.createElement(Divider, null));
}
export default AxisSliders;
