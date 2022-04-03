<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
import axios from 'axios';

import L from 'leaflet';
=======
/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';

import L, { Layer } from 'leaflet';
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts

import { mapService as esriMapService, MapService } from 'esri-leaflet';

import WMSCapabilities from 'wms-capabilities';

<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
import { getXMLHttpRequest, xmlToJson } from '../../../../core/utils/utilities';

import { Cast, AbstractWebLayersClass, TypeJSONValue, TypeJSONObject, TypeLayerConfig } from '../../../../core/types/cgpv-types';

import { api } from '../../../../api/api';
=======
import { getXMLHttpRequest, xmlToJson, generateId } from '../../../core/utils/utilities';

import { Cast, TypeJSONObject, TypeJSONObjectLoop, TypeLayerConfig } from '../../../core/types/cgpv-types';

import { api } from '../../../api/api';
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts

// TODO: this needs cleaning some layer type like WMS are part of react-leaflet and can be use as a component

/**
 * a class to add wms layer
 *
 * @export
 * @class WMS
 */
export class WMS extends AbstractWebLayersClass {
  // TODO: try to avoid getCapabilities for WMS. Use Web Presence metadata return info to store, legend image link, layer name, and other needed properties.
  // ! This will maybe not happen because geoCore may not everything we need. We may have to use getCap
  // * We may have to do getCapabilites if we want to add layers not in the catalog
  // map config properties

<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
=======
  // layer id with default
  id: string;

  // layer name with default
  name = 'WMS Layer';

  // layer type
  type: string;

>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
  // layer from leaflet
  layer: L.TileLayer.WMS | null = null;

  // layer entries
  entries: string[] | undefined;

  // mapService property
  mapService: MapService;

  // private varibale holding wms capabilities
  #capabilities: TypeJSONObject = {};

  // private varibale holding wms paras
  #wmsParams?: L.WMSParams;

  /**
   * Initialize layer
   *
   * @param {TypeLayerConfig} layerConfig the layer configuration
   */
  constructor(layerConfig: TypeLayerConfig) {
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
    super('ogcWMS', 'WMS Layer', layerConfig);

=======
    this.id = layerConfig.id || generateId('');
    this.type = layerConfig.type;
    this.#capabilities = {};
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
    this.entries = layerConfig.entries?.split(',').map((item: string) => {
      return item.trim();
    });

    this.mapService = esriMapService({
      url: api.geoUtilities.getMapServerUrl(layerConfig.url, true),
    });
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts

    this.url = this.url.indexOf('?') === -1 ? `${this.url}?` : this.url;
=======
    this.url = layerConfig.url.indexOf('?') === -1 ? `${layerConfig.url}?` : layerConfig.url;
    this.layer = new Layer();
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
  }

  /**
   * Add a WMS layer to the map.
   *
   * @param {TypeLayerConfig} layer the layer configuration
   * @return {Promise<Layer | null>} layers to add to the map
   */
  add(layer: TypeLayerConfig): Promise<L.TileLayer.WMS | null> {
    // TODO: only work with a single layer value, parse the entries and create new layer for each of the entries
    // TODO: in the legend regroup these layers

    const capUrl = `${this.url}service=WMS&version=1.3.0&request=GetCapabilities&layers=${layer.entries}`;

    const data = getXMLHttpRequest(capUrl);

<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
    const geo = new Promise<L.TileLayer.WMS | null>((resolve) => {
      data.then((value) => {
=======
    const geo = new Promise<Layer | string>((resolve) => {
      data.then((value: string) => {
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
        if (value !== '{}') {
          // check if entries exist
          let isValid = true;

          // parse the xml string and convert to json
          this.#capabilities = new WMSCapabilities(value).toJSON() as TypeJSONObject;

          isValid = this.validateEntries(this.#capabilities.Capability.Layer, layer.entries as string);

<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
          const layerName = 'name' in layer ? layer.name : this.#capabilities.Service.Name;
=======
          const layerName = 'name' in layer ? layer.name : json.Service.Name;
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
          if (layerName) this.name = <string>layerName;

          if (isValid) {
            const wms = L.tileLayer.wms(layer.url, {
              layers: layer.entries,
              format: 'image/png',
              transparent: true,
              attribution: '',
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
              version: this.#capabilities.version as TypeJSONValue as string,
=======
              version: Cast<string>(json.version),
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
            });
            this.#wmsParams = wms.wmsParams;

            resolve(wms);
          } else {
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
            resolve(null);
          }
        } else {
          resolve(null);
=======
            resolve('{}');
          }
        } else {
          resolve('{}');
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
        }
      });
    });
    return geo;
  }

  /**
   * Check if the entries we try to create a layer exist in the getCapabilities layer object
   * @param {object} layer layer of capability of a WMS object
   * @param {string} entries names(comma delimited) to check
   * @returns {boolean} entry is valid
   */
  private validateEntries(layer: TypeJSONObject, entries: string): boolean {
    let isValid = true;
    // eslint-disable-next-line no-prototype-builtins

    // Added support of multiple entries
    const allNames = this.findAllByKey(layer, 'Name');
    const entryArray = entries.split(',').map((s) => s.trim());
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
    for (let i = 0; i < entryArray.length; i++) {
      isValid = isValid && allNames.includes(entryArray[i] as TypeJSONValue as TypeJSONObject);
=======
    for (let i = 0; i < entryArray.length; i += 1) {
      isValid = isValid && allNames.includes(entryArray[i]);
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
    }

    return isValid;
  }

  /**
   * Helper function. Find all values of a given key form a nested object
   * @param {object} obj a object/nested object
   * @param {string} keyToFind key to check
   * @returns {any} all values found
   */
  private findAllByKey(obj: TypeJSONObject, keyToFind: string): TypeJSONObject[] {
    const reduceFunction = (accumulator: TypeJSONObject[], [key, value]: [string, TypeJSONObject]): TypeJSONObject[] => {
      if (key === keyToFind) {
        return accumulator.concat(value);
      }
      if (typeof value === 'object') {
        return accumulator.concat(this.findAllByKey(value, keyToFind));
      }
      return accumulator;
    };

    if (obj) {
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
      return Object.entries(obj).reduce(reduceFunction, []);
=======
      return Object.entries(obj).reduce(
        // eslint-disable-next-line no-nested-ternary
        (acc, [key, v]) => (key === keyToFind ? acc.concat(v) : typeof v === 'object' ? acc.concat(this.findAllByKey(v, keyToFind)) : acc),
        []
      );
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
    }
    return [];
  }

  /**
   * Get capabilities of the current WMS service
   *
   * @returns {TypeJSONObject} WMS capabilities in json format
   */
  getCapabilities = (): TypeJSONObject => {
    return this.#capabilities;
  };

  /**
   * Get the legend image of a layer
   *
   * @param {layerName} string the name of the layer to get the legend image for
   * @returns {blob} image blob
   */
  getLegendGraphic = async (): Promise<string | ArrayBuffer | null> => {
    const readAsyncFile = (blob: Blob): Promise<string | ArrayBuffer | null> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

    const legendUrl = `${this.url}service=WMS&version=1.3.0&request=GetLegendGraphic&FORMAT=image/png&layer=${this.entries}`;
    const response = await axios.get(legendUrl, { responseType: 'blob' });
    return readAsyncFile(response.data);
  };

  /**
   * Get feature info given a latlng
   *
   * @param {L.LatLng} latlng lat/lng coordinates received on any interaction with the map
   * @param {L.Map} map the map odject
   * @param {number} featureCount the map odject
   *
   * @returns {Promise<TypeJSONObject | null>} a promise that returns the feature info in a json format
   */
  getFeatureInfo = async (latlng: L.LatLng, map: L.Map, featureCount = 10): Promise<TypeJSONObject | null> => {
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
    let infoFormat = 'text/xml';

    if (this.#capabilities.Capability.Request.GetFeatureInfo) {
      const formatArray = this.#capabilities.Capability.Request.GetFeatureInfo.Format;
      if ((formatArray as TypeJSONValue as TypeJSONValue[]).includes('application/geojson')) infoFormat = 'application/geojson';
=======
    let inforFormat = 'text/xml';

    if (this.#capabilities.Capability.Request.GetFeatureInfo) {
      const formatArray = this.#capabilities.Capability.Request.GetFeatureInfo.Format as any;
      if (formatArray.includes('application/geojson')) inforFormat = 'application/geojson';
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
    }

    const params = this.getFeatureInfoParams(latlng, map);
    params.info_format = infoFormat as TypeJSONValue as TypeJSONObject;
    params.feature_count = featureCount as TypeJSONValue as TypeJSONObject;

    const response = await axios.get<TypeJSONObject>(this.url, { params });

<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
    if (infoFormat === 'application/geojson') {
      const dataFeatures = response.data.features as TypeJSONValue as TypeJSONValue[];
      if (dataFeatures.length > 0) {
        const results: TypeJSONValue[] = [];
        dataFeatures.forEach((jsonValue) => {
          const element = jsonValue as TypeJSONObject;
=======
    if (inforFormat === 'application/geojson') {
      if (res.data.features.length > 0) {
        const results: any[] = [];
        res.data.features.forEach((element) => {
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
          results.push({
            attributes: element.properties,
            geometry: element.geometry,
            layerId: this.id,
            layerName: element.layerName,
            // displayFieldName: "OBJECTID",
            // value: element.properties.OBJECTID,
            geometryType: element.type,
          } as TypeJSONValue);
        });

        return { results } as TypeJSONValue as TypeJSONObject;
      }
      return null;
    }
    const featureInfoResponse = (xmlToJson(response.request.responseXML) as TypeJSONObject).FeatureInfoResponse;

    if (featureInfoResponse && featureInfoResponse.FIELDS) {
      const results: TypeJSONValue[] = [];
      // only one feature
      if (featureInfoResponse.FIELDS['@attributes']) {
        results.push({
          attributes: featureInfoResponse.FIELDS['@attributes'],
          geometry: null,
          layerId: this.id,
          layerName: this.name,
          // displayFieldName: "OBJECTID",
          // value: element.properties.OBJECTID,
          geometryType: null,
        } as TypeJSONValue);
      } else {
        const arrayOfFeature = featureInfoResponse.FIELDS as TypeJSONValue as TypeJSONValue[];
        arrayOfFeature.forEach((element) => {
          results.push({
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
            attributes: (element as TypeJSONObject)['@attributes'],
=======
            attributes: element['@attributes'],
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
            geometry: null,
            layerId: this.id,
            layerName: this.name,
            // displayFieldName: "OBJECTID",
            // value: element.properties.OBJECTID,
            geometryType: null,
          } as TypeJSONValue);
        });
      }
      return { results } as TypeJSONValue as TypeJSONObject;
    }
    return null;
  };

  /**
   * Get the parameters used to query feature info url from a lat lng point
   *
   * @param {LatLng} latlng a latlng point to generate the feature url from
   * @param {L.Map} map the map odject
   * @returns the map service url including the feature query
   */
  private getFeatureInfoParams(latlng: L.LatLng, map: L.Map): TypeJSONObject {
    const point = map.latLngToContainerPoint(latlng);

    const size = map.getSize();

    const { crs } = map.options;

    // these are the SouthWest and NorthEast points
    // projected from LatLng into used crs
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
    const sw = crs!.project(map.getBounds().getSouthWest());
    const ne = crs!.project(map.getBounds().getNorthEast());

    const params: TypeJSONValue = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      version: this.#wmsParams!.version!,
      layers: this.#wmsParams!.layers!,
      query_layers: this.#wmsParams!.layers,
=======
    const sw = crs.project(map.getBounds().getSouthWest());
    const ne = crs.project(map.getBounds().getNorthEast());

    const params: Record<string, unknown> = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      version: this.#wmsParams.version,
      layers: this.#wmsParams.layers,
      query_layers: this.#wmsParams.layers,
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
      height: size.y,
      width: size.x,
    };

    // Define version-related request parameters.
<<<<<<< HEAD:packages/geoview-core/src/geo/layer/web-layers/ogc/wms.ts
    const version = window.parseFloat(this.#wmsParams!.version!);
    params[version >= 1.3 ? 'crs' : 'srs'] = crs!.code!;
    params.bbox = `${sw.x},${sw.y},${ne.x},${ne.y}`;
    params.bbox = version >= 1.3 && crs!.code === 'EPSG:4326' ? `${sw.y},${sw.x},${ne.y},${ne.x}` : `${sw.x},${sw.y},${ne.x},${ne.y}`;
=======
    const version = window.parseFloat(this.#wmsParams.version);
    params[version >= 1.3 ? 'crs' : 'srs'] = crs.code;
    params.bbox = `${sw.x},${sw.y},${ne.x},${ne.y}`;
    params.bbox = version >= 1.3 && crs.code === 'EPSG:4326' ? `${sw.y},${sw.x},${ne.y},${ne.x}` : `${sw.x},${sw.y},${ne.x},${ne.y}`;
>>>>>>> 2494732ad4a7a2c68e059d9d1877b2d59d665d4d:packages/geoview-core/src/geo/layer/ogc/wms.ts
    params[version >= 1.3 ? 'i' : 'x'] = point.x;
    params[version >= 1.3 ? 'j' : 'y'] = point.y;

    return params as TypeJSONObject;
  }

  /**
   * Set Layer Opacity
   * @param {number} opacity layer opacity
   */
  setOpacity = (opacity: number) => {
    (this.layer as L.TileLayer.WMS).setOpacity(opacity);
  };

  /**
   * Get bounds through Leaflet built-in functions
   *
   * @returns {L.LatLngBounds} layer bounds
   */
  getBounds = (): L.LatLngBounds => {
    const capabilities = this.getCapabilities();
    const bbox = Cast<[number, number, number, number]>(capabilities.Capability.Layer.EX_GeographicBoundingBox);
    const [xmin, ymin, xmax, ymax] = bbox;
    return L.latLngBounds([
      [ymin, xmin],
      [ymax, xmax],
    ]);
  };
}
