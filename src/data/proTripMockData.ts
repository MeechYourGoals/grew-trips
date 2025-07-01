
import { ProTripData } from '../types/pro';
import { lakersRoadTrip } from './pro-trips/lakersRoadTrip';
import { taylorSwiftErasTour } from './pro-trips/taylorSwiftErasTour';
import { eliLillyCsuiteRetreat } from './pro-trips/eliLillyCsuiteRetreat';
import { scarletKnightsVolleyball } from './pro-trips/scarletKnightsVolleyball';
import { harrisElementaryFieldTrip } from './pro-trips/harrisElementaryFieldTrip';
import { indianaUniversityDebate } from './pro-trips/indianaUniversityDebate';
import { yCombinatorCohort } from './pro-trips/yCombinatorCohort';
import { realHousewivesAtlShoot } from './pro-trips/realHousewivesAtlShoot';

export const proTripMockData: Record<string, ProTripData> = {
  'lakers-road-trip': lakersRoadTrip,
  'taylor-swift-eras-tour': taylorSwiftErasTour,
  'eli-lilly-c-suite-retreat-2026': eliLillyCsuiteRetreat,
  'scarlet-knights-aau-volleyball-2025': scarletKnightsVolleyball,
  'harris-elementary-dc-field-trip-2025': harrisElementaryFieldTrip,
  'indiana-university-debate-championships-2025': indianaUniversityDebate,
  'y-combinator-winter-2025-cohort': yCombinatorCohort,
  'real-housewives-atl-s9-shoot-2025': realHousewivesAtlShoot
};
