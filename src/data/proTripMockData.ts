
import { ProTripData } from '../types/pro';
import { lakersRoadTrip } from './pro-trips/lakersRoadTrip';
import { beyonceCowboyCarterTour } from './pro-trips/beyonceCowboyCarterTour';
import { eliLillyCsuiteRetreat } from './pro-trips/eliLillyCsuiteRetreat';
import { paulGeorgeEliteAau } from './pro-trips/paulGeorgeEliteAau';
import { ohioStateNotreDame } from './pro-trips/ohioStateNotreDame';
import { uncMensLacrosse } from './pro-trips/uncMensLacrosse';
import { yCombinatorCohort } from './pro-trips/yCombinatorCohort';
import { kaiDruskiStream } from './pro-trips/kaiDruskiStream';
import { googleIO2026 } from './pro-trips/googleIO2026';
import { teslaCybertruckRoadshow } from './pro-trips/teslaCybertruckRoadshow';

export const proTripMockData: Record<string, ProTripData> = {
  'lakers-road-trip': lakersRoadTrip,
  'beyonce-cowboy-carter-tour': beyonceCowboyCarterTour,
  'eli-lilly-c-suite-retreat-2026': eliLillyCsuiteRetreat,
  'paul-george-elite-aau-nationals-2025': paulGeorgeEliteAau,
  'osu-notredame-2025': ohioStateNotreDame,
  'unc-lax-2025': uncMensLacrosse,
  'a16z-speedrun-2026': yCombinatorCohort,
  'kai-druski-jake-adin-24hr-atl': kaiDruskiStream,
  'google-io-2026': googleIO2026,
  'tesla-cybertruck-roadshow-2025': teslaCybertruckRoadshow
};
