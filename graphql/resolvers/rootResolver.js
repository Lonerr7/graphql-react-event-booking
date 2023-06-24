import { eventsResolver } from './eventsResolver.js';
import { bookingsResolver } from './bookingsResolver.js';
import { authResolver } from './authResolver.js';

export const rootResolver = {
  ...eventsResolver,
  ...bookingsResolver,
  ...authResolver,
}; // all resolver functions (they need to match our schema endpoints by name)
