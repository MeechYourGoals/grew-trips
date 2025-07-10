
import { ProTripData } from '../types/pro';
import { lakersRoadTrip } from './pro-trips/lakersRoadTrip';
import { taylorSwiftErasTour } from './pro-trips/taylorSwiftErasTour';
import { eliLillyCsuiteRetreat } from './pro-trips/eliLillyCsuiteRetreat';
import { paulGeorgeEliteAau } from './pro-trips/paulGeorgeEliteAau';
import { harrisElementaryFieldTrip } from './pro-trips/harrisElementaryFieldTrip';
import { uncMensLacrosse } from './pro-trips/uncMensLacrosse';
import { yCombinatorCohort } from './pro-trips/yCombinatorCohort';
import { realHousewivesAtlShoot } from './pro-trips/realHousewivesAtlShoot';

export const proTripMockData: Record<string, ProTripData> = {
  'lakers-road-trip': lakersRoadTrip,
  'taylor-swift-eras-tour': taylorSwiftErasTour,
  'eli-lilly-c-suite-retreat-2026': eliLillyCsuiteRetreat,
  'paul-george-elite-aau-nationals-2025': paulGeorgeEliteAau,
  'harris-elementary-dc-field-trip-2025': harrisElementaryFieldTrip,
  'unc-lax-2025': uncMensLacrosse,
  'y-combinator-winter-2025-cohort': yCombinatorCohort,
  'real-housewives-atl-s9-shoot-2025': realHousewivesAtlShoot
};
