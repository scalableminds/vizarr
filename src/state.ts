import type { ImageLayer, MultiscaleImageLayer, ZarrPixelSource } from '@hms-dbmi/viv';
import type { Matrix4 } from 'math.gl';
import type { PrimitiveAtom } from 'jotai';
import { atom } from 'jotai';
import { atomFamily, splitAtom, waitForAll } from 'jotai/utils';
import type { ZarrArray } from 'zarr';
import type { default as GridLayer, GridLayerProps, GridLoader } from './gridLayer';
import { initLayerStateFromSource } from './io';

export const DEFAULT_VIEW_STATE = { zoom: 0, target: [0, 0, 0], default: true };

interface ViewState {
  zoom: number;
  target: number[];
  default?: boolean;
}

interface BaseConfig {
  source: string | ZarrArray['store'];
  axis_labels?: string[];
  name?: string;
  colormap?: string;
  opacity?: number;
  acquisition?: string;
  model_matrix?: string | number[];
  onClick?: (e: any) => void;
}

export interface MultichannelConfig extends BaseConfig {
  colors?: string[];
  channel_axis?: number;
  contrast_limits?: [min: number, max: number][];
  names?: string[];
  visibilities?: boolean[];
}

export interface SingleChannelConfig extends BaseConfig {
  color?: string;
  contrast_limits?: [min: number, max: number];
  visibility?: boolean;
}

export type ImageLayerConfig = MultichannelConfig | SingleChannelConfig;

export type SourceData = {
  loader: ZarrPixelSource<string[]>[];
  loaders?: GridLoader[]; // for OME plates
  rows?: number;
  columns?: number;
  acquisitions?: Ome.Acquisition[];
  acquisitionId?: number;
  name?: string;
  channel_axis: number | null;
  colors: string[];
  names: string[];
  contrast_limits: ([min: number, max: number] | undefined)[];
  visibilities: boolean[];
  defaults: {
    selection: number[];
    colormap: string;
    opacity: number;
  };
  model_matrix: Matrix4;
  axis_labels: string[];
  onClick?: (e: any) => void;
};

export type VivProps = ConstructorParameters<typeof MultiscaleImageLayer>[0];

export interface BaseLayerProps {
  id: string;
  contrastLimits: VivProps['contrastLimits'];
  colors: [r: number, g: number, b: number][];
  channelsVisible: NonNullable<VivProps['channelsVisible']>;
  opacity: NonNullable<VivProps['opacity']>;
  colormap: string; // TODO: more precise
  selections: number[][];
  modelMatrix: Matrix4;
  contrastLimitsRange: [min: number, max: number][];
  onClick?: (e: any) => void;
}

interface MultiscaleImageLayerProps extends BaseLayerProps {
  loader: ZarrPixelSource<string[]>[];
}

interface ImageLayerProps extends BaseLayerProps {
  loader: ZarrPixelSource<string[]>;
}

type LayerMap = {
  image: [typeof ImageLayer, ImageLayerProps];
  multiscale: [typeof MultiscaleImageLayer, MultiscaleImageLayerProps];
  grid: [GridLayer, { loader: ZarrPixelSource<string[]> | ZarrPixelSource<string[]>[] } & GridLayerProps];
};

export type LayerCtr<T> = new (...args: any[]) => T;
export type LayerState<T extends 'image' | 'multiscale' | 'grid' = 'image' | 'multiscale' | 'grid'> = {
  Layer: LayerCtr<LayerMap[T][0]>;
  layerProps: LayerMap[T][1];
  on: boolean;
};

type WithId<T> = T & { id: string };

export type ControllerProps<T = {}> = {
  sourceAtom: PrimitiveAtom<WithId<SourceData>>;
  layerAtom: PrimitiveAtom<WithId<LayerState>>;
} & T;

export const sourceInfoAtom = atom<WithId<SourceData>[]>([]);

export const viewStateAtom = atom<ViewState>(DEFAULT_VIEW_STATE);

export const sourceInfoAtomAtoms = splitAtom(sourceInfoAtom);

export const layerFamilyAtom = atomFamily(
  (param: WithId<SourceData>) => atom({ ...initLayerStateFromSource(param), id: param.id }),
  (a, b) => a.id === b.id
);

export const layerAtoms = atom((get) => {
  const atoms = get(sourceInfoAtomAtoms);
  if (atoms.length === 0) return [];
  const layers = atoms.map((a) => layerFamilyAtom(get(a)));
  return get(waitForAll(layers));
});
