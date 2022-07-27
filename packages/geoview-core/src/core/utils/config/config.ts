/* eslint-disable no-console */
import { TypeLocalizedLanguages, TypeMapFeaturesConfig } from '../../../geo/map/map-types';
import { ConfigValidation } from './config-validation';
import { InlineDivConfigReader } from './reader/div-config-reader';
import { JsonConfigReader } from './reader/json-config-reader';
import { URLmapConfigReader } from './reader/url-config-reader';

export const catalogUrl = 'https://maps.canada.ca/geonetwork/srv/api/v2/docs';

// ******************************************************************************************************************************
// ******************************************************************************************************************************
/** *****************************************************************************************************************************
 * Class to handle configuration validation. Will validate every item for structure and valid values. If error found, will replace by default values
 * and sent a message in the console for developers to know something went wrong
 *
 * @exports
 * @class Config
 */
// ******************************************************************************************************************************
export class Config {
  /** The element associated to the map properties configuration.. */
  private mapElement: Element;

  /** Config validation object used to validate the configuration and define default values */
  private configValidation: ConfigValidation;

  /** ***************************************************************************************************************************
   * The Config class constructor used to instanciate an object of this type.
   * @param {Element} mapElement The map element.
   */
  constructor(mapElement: Element) {
    this.mapElement = mapElement;

    // set default display language
    this.configValidation = new ConfigValidation();
  }

  /** ***************************************************************************************************************************
   * Get mapId value.
   */
  get mapId(): string {
    return this.configValidation.mapId;
  }

  /** ***************************************************************************************************************************
   * Set mapId value.
   */
  set mapId(mapId: string) {
    this.configValidation.mapId = mapId;
  }

  /** ***************************************************************************************************************************
   * Get displayLanguage value.
   */
  get displayLanguage(): TypeLocalizedLanguages {
    return this.configValidation.displayLanguage;
  }

  /** ***************************************************************************************************************************
   * Set displayLanguage value.
   */
  set displayLanguage(displayLanguage: TypeLocalizedLanguages) {
    this.configValidation.displayLanguage = displayLanguage;
  }

  /** ***************************************************************************************************************************
   * Get map properties configuration from a function call
   *
   * @param {TypeMapFeaturesConfig} mapFeaturesConfig config object passed in the function
   *
   * @returns {TypeMapFeaturesConfig} a valid map config
   */
  getMapConfigFromFunc(mapFeaturesConfig: TypeMapFeaturesConfig): TypeMapFeaturesConfig | undefined {
    // get the id from the map element
    const mapId = this.mapElement.getAttribute('id');

    // update map id if provided in map element
    if (mapId) this.mapId = mapId;

    // get the display language from the map element
    const displayLanguage = this.mapElement.getAttribute('data-lang');

    // update display language if provided in map element
    if (displayLanguage) this.displayLanguage = displayLanguage as TypeLocalizedLanguages;

    return this.configValidation.validateMapConfigAgainstSchema(mapFeaturesConfig);
  }

  /** ***************************************************************************************************************************
   * Initialize a map config from either inline div, url params, json file
   *
   * @returns {TypeMapFeaturesConfig} the initialized valid map config
   */
  async initializeMapConfig(): Promise<TypeMapFeaturesConfig | undefined> {
    // get the id from the map element
    const mapId = this.mapElement.getAttribute('id');

    // update map id if provided in map element
    if (mapId) this.mapId = mapId;

    // get the display language from the map element
    const displayLanguage = this.mapElement.getAttribute('data-lang');

    // update display language if provided in map element
    if (displayLanguage) this.displayLanguage = displayLanguage as TypeLocalizedLanguages;

    // create a new config object to store provided config by user
    let mapFeaturesConfig: TypeMapFeaturesConfig | undefined;

    // check if inline div config has been passed
    const inlineDivConfig = InlineDivConfigReader.getMapFeaturesConfig(this.mapId, this.mapElement);

    // use inline config if provided
    if (inlineDivConfig) mapFeaturesConfig = { ...inlineDivConfig };

    // check if a config file url is provided.
    const jsonFileConfig = await JsonConfigReader.getMapFeaturesConfig(this.mapId, this.mapElement);

    if (jsonFileConfig) mapFeaturesConfig = { ...jsonFileConfig };

    // get the value that will check if any url params passed will override existing map
    const shared = this.mapElement.getAttribute('data-shared');

    // check if config params have been passed
    const urlParamsConfig = await URLmapConfigReader.getMapFeaturesConfig(this.mapId);

    // use the url params config if provided
    if (urlParamsConfig && shared === 'true') mapFeaturesConfig = { ...urlParamsConfig };

    // NOTE: URL config has precedence on JSON file config that has precedence on inline config
    return this.configValidation.validateMapConfigAgainstSchema(mapFeaturesConfig);
  }
}
