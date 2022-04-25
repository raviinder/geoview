import L from 'leaflet';
import { PayloadBaseClass } from './payload-base-class';
import { EventStringId, EVENT_NAMES } from '../event';
import { TypeJsonObject } from '../../../core/types/cgpv-types';

// Valid events that can create MarkerDefinitionPayload
const validEvents: EventStringId[] = [EVENT_NAMES.MARKER_ICON.EVENT_MARKER_ICON_SHOW];

/* ******************************************************************************************************************************
 * Type Gard function that redefines a PayloadBaseClass as a MarkerDefinitionPayload
 * if the event attribute of the verifyIfPayload parameter is valid. The type ascention
 * applies only to the the true block of the if clause.
 *
 * @param {PayloadBaseClass} polymorphic object to test in order to determine if the type ascention is valid
 */
export const payloadIsAMarkerDefinition = (verifyIfPayload: PayloadBaseClass): verifyIfPayload is MarkerDefinitionPayload => {
  return validEvents.includes(verifyIfPayload.event);
};

/* ******************************************************************************************************************************
 * Class definition for MarkerDefinitionPayload
 */
export class MarkerDefinitionPayload extends PayloadBaseClass {
  // the marker coordinate
  latlng: L.LatLng;

  // the marker symbology
  symbology: TypeJsonObject;

  /*
   * Constructor for the class
   *
   * @param {EventStringId} the event identifier for which the payload is constructed
   * @param {string | null} the handler Name
   * @param {L.LatLng} the marker coordinate
   * @param {TypeJsonObject} the marker symbology
   *
   * @returns {MarkerDefinitionPayload} the MarkerDefinitionPayload object created
   */
  constructor(event: EventStringId, handlerName: string | null, latlng: L.LatLng, symbology: TypeJsonObject) {
    if (!validEvents.includes(event)) throw new Error(`MarkerIconPayload can't be instanciated for event of type ${event}`);
    super(event, handlerName);
    this.latlng = latlng;
    this.symbology = symbology;
  }
}

/* ******************************************************************************************************************************
 * Helper function used to instanciate a MarkerDefinitionPayload object. This function
 * avoids the "new MarkerDefinitionPayload" syntax.
 *
 * @param {EventStringId} the event identifier for which the payload is constructed
 * @param {string | null} the handler Name
 * @param {L.LatLng} the marker coordinate
 * @param {TypeJsonObject} the marker symbology
 *
 * @returns {MarkerDefinitionPayload} the MarkerDefinitionPayload object created
 */
export const markerDefinitionPayload = (
  event: EventStringId,
  handlerName: string | null,
  latlng: L.LatLng,
  symbology: TypeJsonObject
): MarkerDefinitionPayload => {
  return new MarkerDefinitionPayload(event, handlerName, latlng, symbology);
};
