/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { asArray, asString } from 'ol/color';
import { Style, Stroke, Fill, Circle as StyleCircle, Icon as StyleIcon } from 'ol/style';
import { Options as IconOptions } from 'ol/style/Icon';
import { Options as StrokeOptions } from 'ol/style/Stroke';
import { Options as FillOptions } from 'ol/style/Fill';

import { FeatureLike } from 'ol/Feature';
import { getLocalizedValue, setAlphaColor } from '../../core/utils/utilities';
import {
  isFilledPolygonVectorConfig,
  isIconSymbolVectorConfig,
  isLineStringVectorConfig,
  isSimpleSymbolVectorConfig,
  isUniqueValueStyleConfig,
  TypeBaseStyleType,
  TypeFillStyle,
  TypePolygonVectorConfig,
  TypeIconSymbolVectorConfig,
  TypeKinfOfSymbolVectorSettings,
  TypeLineStyle,
  TypeLineStringVectorConfig,
  TypeSimpleStyleConfig,
  TypeSimpleSymbolVectorConfig,
  TypeStyleConfigKey,
  TypeStyleSettings,
  TypeSymbol,
  TypeUniqueValueStyleConfig,
  TypeUniqueValueStyleInfo,
  TypeVectorLayerEntryConfig,
  TypeVectorTileLayerEntryConfig,
} from '../map/map-schema-types';
import { defaultColor } from './geoview-renderer-types';

const lineDashSettings: Record<TypeLineStyle, number[] | undefined> = {
  dash: [16, 4],
  'dash-dot': [16, 4, 2, 4],
  'dash-dot-dot': [16, 4, 2, 4, 2, 4],
  dot: [2, 2],
  longDash: [25, 5],
  'longDash-dot': [25, 5, 2, 5],
  null: [0, 3],
  shortDash: [7, 3],
  'shortDash-dot': [7, 3, 2, 3],
  'shortDash-dot-dot': [7, 3, 2, 3, 2, 3],
  solid: undefined,
};

function styleNotImplemented(styleSettings: TypeStyleSettings, feature: FeatureLike): Style | undefined {
  // eslint-disable-next-line no-console
  console.log('Style processing function is not implemented.');
  return undefined;
}

function symbolNotImplemented(settings: TypeSimpleSymbolVectorConfig): Style | undefined {
  // eslint-disable-next-line no-console
  console.log('Style processing function is not implemented.');
  return undefined;
}

function createStrokeOptions(settings: TypeSimpleSymbolVectorConfig | TypeLineStringVectorConfig | TypePolygonVectorConfig): StrokeOptions {
  const strokeOptions: StrokeOptions = {
    color: settings.stroke?.color,
    width: settings.stroke?.width,
    lineCap: 'butt',
    lineJoin: 'bevel',
    lineDash: lineDashSettings[settings.stroke?.lineStyle !== undefined ? settings.stroke?.lineStyle : 'solid'],
  };
  return strokeOptions;
}

function processCircleSymbol(settings: TypeSimpleSymbolVectorConfig): Style | undefined {
  const fillOptions: FillOptions = { color: settings.color };
  const strokeOptions: StrokeOptions = createStrokeOptions(settings);
  const radius = settings.size !== undefined ? settings.size : 5;
  const displacement = settings.offset !== undefined ? settings.offset : [0, 0];
  const rotation = settings.rotation !== undefined ? settings.rotation : 0;
  return new Style({
    image: new StyleCircle({
      radius,
      stroke: new Stroke(strokeOptions),
      fill: new Fill(fillOptions),
      displacement,
      rotation,
    }),
  });
}

function processIconSymbol(settings: TypeIconSymbolVectorConfig): Style | undefined {
  const iconOptions: IconOptions = {};
  iconOptions.src = `data:${settings.mimeType};base64,${settings.src}`;
  if (settings.width !== undefined && settings.height !== undefined) iconOptions.size = [settings.width, settings.height];
  if (settings.offset !== undefined) iconOptions.offset = settings.offset;
  if (settings.rotation !== undefined) iconOptions.rotation = settings.rotation;
  if (settings.opacity !== undefined) iconOptions.opacity = settings.opacity;
  return new Style({
    image: new StyleIcon(iconOptions),
  });
}

const processSymbol: Record<TypeSymbol, (settings: TypeSimpleSymbolVectorConfig) => Style | undefined> = {
  circle: processCircleSymbol,
  '+': symbolNotImplemented,
  diamond: symbolNotImplemented,
  square: symbolNotImplemented,
  triangle: symbolNotImplemented,
  X: symbolNotImplemented,
};

function processSimplePoint(styleSettings: TypeStyleSettings | TypeUniqueValueStyleInfo, feature: FeatureLike): Style | undefined {
  const { settings } = styleSettings as TypeSimpleStyleConfig | TypeUniqueValueStyleInfo;
  if (isSimpleSymbolVectorConfig(settings)) {
    const { symbol } = settings;
    return processSymbol[symbol](settings);
  }
  if (isIconSymbolVectorConfig(settings)) return processIconSymbol(settings);
  return undefined;
}

function processSimpleLineString(styleSettings: TypeStyleSettings | TypeUniqueValueStyleInfo, feature: FeatureLike): Style | undefined {
  const { settings } = styleSettings as TypeSimpleStyleConfig;
  if (isLineStringVectorConfig(settings)) {
    const strokeOptions: StrokeOptions = createStrokeOptions(settings);
    return new Style({ stroke: new Stroke(strokeOptions) });
  }
  return undefined;
}

function processSolidFill(settings: TypePolygonVectorConfig): Style | undefined {
  const fillOptions: FillOptions = { color: settings.color };
  const strokeOptions: StrokeOptions = createStrokeOptions(settings);
  return new Style({
    stroke: new Stroke(strokeOptions),
    fill: new Fill(fillOptions),
  });
}

const processFillStyle: Record<TypeFillStyle, (settings: TypePolygonVectorConfig) => Style | undefined> = {
  solid: processSolidFill,
};

function processSimplePolygon(styleSettings: TypeStyleSettings | TypeUniqueValueStyleInfo, feature: FeatureLike): Style | undefined {
  const { settings } = styleSettings as TypeSimpleStyleConfig;
  if (isFilledPolygonVectorConfig(settings)) {
    const { fillStyle } = settings;
    return processFillStyle[fillStyle](settings);
  }
  return undefined;
}

function searchUniqueValueEntry(
  fields: string[],
  uniqueValueStyleInfo: TypeUniqueValueStyleInfo[],
  feature: FeatureLike
): number | undefined {
  let i = 0;
  let matchFound = false;
  for (i = 0; i < uniqueValueStyleInfo.length && !matchFound; i++) {
    matchFound = true;
    for (let j = 0; j < fields.length && matchFound; j++) {
      if (feature.get(fields[j]) !== uniqueValueStyleInfo[i].values[j]) matchFound = false;
    }
  }
  if (matchFound) return --i; // correction to the indexbecause it points to the next entry.
  return undefined;
}

function processUniqueValuePoint(styleSettings: TypeStyleSettings, feature: FeatureLike): Style | undefined {
  const { defaultSettings, fields, uniqueValueStyleInfo } = styleSettings as TypeUniqueValueStyleConfig;
  const i = searchUniqueValueEntry(fields, uniqueValueStyleInfo, feature);
  if (i !== undefined) return processSimplePoint(uniqueValueStyleInfo[i], feature);
  if (defaultSettings !== undefined) return processSimplePoint(styleSettings, feature);
  return undefined;
}

function processUniqueLineString(styleSettings: TypeStyleSettings, feature: FeatureLike): Style | undefined {
  const { defaultSettings, fields, uniqueValueStyleInfo } = styleSettings as TypeUniqueValueStyleConfig;
  const i = searchUniqueValueEntry(fields, uniqueValueStyleInfo, feature);
  if (i !== undefined) return processSimpleLineString(uniqueValueStyleInfo[i], feature);
  if (defaultSettings !== undefined) return processSimplePoint(styleSettings, feature);
  return undefined;
}

function processUniquePolygon(styleSettings: TypeStyleSettings, feature: FeatureLike): Style | undefined {
  const { defaultSettings, fields, uniqueValueStyleInfo } = styleSettings as TypeUniqueValueStyleConfig;
  const i = searchUniqueValueEntry(fields, uniqueValueStyleInfo, feature);
  if (i !== undefined) return processSimplePolygon(uniqueValueStyleInfo[i], feature);
  if (defaultSettings !== undefined) return processSimplePoint(styleSettings, feature);
  return undefined;
}

// ******************************************************************************************************************************
// ******************************************************************************************************************************
/** *****************************************************************************************************************************
 * A class to define the GeoView renderers.
 *
 * @exports
 * @class GeoviewRenderer
 */
// ******************************************************************************************************************************
export class GeoviewRenderer {
  // the id of the map
  mapId!: string;

  /** index used to select the default styles */
  defaultColorIndex: number;

  /** Table of function to process the style settings. */
  getStyle: Record<
    TypeBaseStyleType,
    Record<TypeStyleConfigKey, (styleSettings: TypeStyleSettings, feature: FeatureLike) => Style | undefined>
  > = {
    simple: {
      Point: processSimplePoint,
      LineString: processSimpleLineString,
      Polygon: processSimplePolygon,
    },
    uniqueValue: {
      Point: processUniqueValuePoint,
      LineString: processUniqueLineString,
      Polygon: processUniquePolygon,
    },
    classBreak: {
      Point: styleNotImplemented,
      LineString: styleNotImplemented,
      Polygon: styleNotImplemented,
    },
  };

  constructor(mapId: string) {
    this.mapId = mapId;
    this.defaultColorIndex = 0;
  }

  useDefaultStyle(geometryType: TypeStyleConfigKey, layerEntry: TypeVectorTileLayerEntryConfig | TypeVectorLayerEntryConfig) {
    if (layerEntry.style === undefined) layerEntry.style = {};
    const id = `${this.mapId}-${layerEntry.geoviewRootLayer?.layerId}-${layerEntry.layerId}`;
    let label = getLocalizedValue(layerEntry.layerName, this.mapId);
    label = label !== undefined ? label : id;
    if (geometryType === 'Point') {
      const settings: TypeSimpleSymbolVectorConfig = {
        type: 'simpleSymbol',
        rotation: 0,
        color: asString(setAlphaColor(asArray(defaultColor[this.defaultColorIndex]), 0.25)),
        stroke: {
          color: asString(setAlphaColor(asArray(defaultColor[this.defaultColorIndex]), 1)),
          lineStyle: 'solid',
          width: 1,
        },
        size: 5,
        symbol: 'circle',
        offset: [0, 0],
      };
      const styleSettings: TypeSimpleStyleConfig = { id, styleType: 'simple', label, settings };
      layerEntry.style[geometryType] = styleSettings;
      this.defaultColorIndex = ++this.defaultColorIndex === defaultColor.length ? this.defaultColorIndex : 0;
      return;
    }
    if (geometryType === 'LineString') {
      const settings: TypeLineStringVectorConfig = {
        type: 'lineString',
        stroke: {
          color: asString(setAlphaColor(asArray(defaultColor[this.defaultColorIndex]), 1)),
          lineStyle: 'solid',
          width: 1,
        },
      };
      const styleSettings: TypeSimpleStyleConfig = { id, styleType: 'simple', label, settings };
      layerEntry.style[geometryType] = styleSettings;
      this.defaultColorIndex = ++this.defaultColorIndex === defaultColor.length ? this.defaultColorIndex : 0;
      return;
    }
    if (geometryType === 'Polygon') {
      const settings: TypePolygonVectorConfig = {
        type: 'filledPolygon',
        color: asString(setAlphaColor(asArray(defaultColor[this.defaultColorIndex]), 0.25)),
        stroke: {
          color: asString(setAlphaColor(asArray(defaultColor[this.defaultColorIndex]), 1)),
          lineStyle: 'solid',
          width: 1,
        },
        fillStyle: 'solid',
      };
      const styleSettings: TypeSimpleStyleConfig = { id, styleType: 'simple', label, settings };
      layerEntry.style[geometryType] = styleSettings;
      this.defaultColorIndex = ++this.defaultColorIndex === defaultColor.length ? this.defaultColorIndex : 0;
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`Geometry type ${geometryType} is not supported by the GeoView viewer.`);
  }
}
