import L from 'leaflet';
import { PayloadBaseClass } from './payload-base-class';
import { EventStringId, EVENT_NAMES } from '../event';

// Valid events that can create MapPayload
const validEvents: EventStringId[] = [EVENT_NAMES.MAP.EVENT_MAP_LOADED];

/* ******************************************************************************************************************************
 * Type Gard function that redefines a PayloadBaseClass as a MapPayload
 * if the event attribute of the verifyIfPayload parameter is valid. The type ascention
 * applies only to the the true block of the if clause.
 *
 * @param {PayloadBaseClass} polymorphic object to test in order to determine if the type ascention is valid
 */
export const payloadIsAMap = (verifyIfPayload: PayloadBaseClass): verifyIfPayload is MapPayload => {
  return validEvents.includes(verifyIfPayload.event);
};

/* ******************************************************************************************************************************
 * Class definition for MapPayload
 */
export class MapPayload extends PayloadBaseClass {
  map: L.Map;

  /*
   * Constructor for the class
   *
   * @param {EventStringId} the event identifier for which the payload is constructed
   * @param {string | null} the handler Name
   * @param {L.Map} the map payload
   *
   * @returns {MapPayload} the MapPayload object created
   */
  constructor(event: EventStringId, handlerName: string | null, map: L.Map) {
    if (!validEvents.includes(event)) throw new Error(`MapPayload can't be instanciated for event of type ${event}`);
    super(event, handlerName);
    this.map = map;
  }
}

/* ******************************************************************************************************************************
 * Helper function used to instanciate a MapPayload object. This function
 * avoids the "new MapPayload" syntax.
 *
 * @param {EventStringId} the event identifier for which the payload is constructed
 * @param {string | null} the handler Name
 * @param {L.Map} the map payload
 *
 * @returns {MapPayload} the MapPayload object created
 */
export const mapPayload = (event: EventStringId, handlerName: string | null, map: L.Map): MapPayload => {
  return new MapPayload(event, handlerName, map);
};
