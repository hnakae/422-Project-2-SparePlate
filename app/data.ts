import type { SPData } from './types';

const now = new Date('2026-05-14T11:42:00');
const inMins = (n: number) => new Date(now.getTime() + n * 60000).toISOString();

export const SP_DATA: SPData = {
  now,
  cat: {
    bakery:   { color: 'oklch(78% 0.10 60)',  ink: 'oklch(38% 0.08 60)',  label: 'Bakery',         emoji: '🍞' },
    produce:  { color: 'oklch(78% 0.10 145)', ink: 'oklch(38% 0.08 145)', label: 'Produce',        emoji: '🥕' },
    prepared: { color: 'oklch(78% 0.10 35)',  ink: 'oklch(38% 0.08 35)',  label: 'Prepared meals', emoji: '🍝' },
    dairy:    { color: 'oklch(85% 0.06 90)',  ink: 'oklch(40% 0.06 90)',  label: 'Dairy & eggs',   emoji: '🥛' },
    pantry:   { color: 'oklch(80% 0.07 75)',  ink: 'oklch(38% 0.07 75)',  label: 'Pantry',         emoji: '🫙' },
    coffee:   { color: 'oklch(72% 0.07 50)',  ink: 'oklch(35% 0.08 50)',  label: 'Drinks',         emoji: '☕' },
  },
  businesses: [
    { id: 'b-hideaway',   name: 'Hideaway Bakery',          type: 'Bakery',       address: '3377 E Amazon Dr',   hood: 'South Eugene', verified: true,  rating: 4.8 },
    { id: 'b-glazed',     name: 'Glazed & Confused',        type: 'Bakery',       address: '1542 Willamette St', hood: 'Downtown',     verified: true,  rating: 4.7 },
    { id: 'b-marketmint', name: 'Market of Choice — 29th', type: 'Grocery',  address: '67 W 29th Ave',      hood: 'South Eugene', verified: true,  rating: 4.6 },
    { id: 'b-newday',     name: 'New Day Bakery',            type: 'Bakery+Cafe',  address: '449 Blair Blvd',     hood: 'Whiteaker',    verified: true,  rating: 4.9 },
    { id: 'b-cornucopia', name: 'Cornucopia Bar & Burger',   type: 'Restaurant',   address: '295 W 17th Ave',     hood: 'South Eugene', verified: false, rating: 4.4 },
    { id: 'b-tacovore',   name: 'Tacovore',                  type: 'Restaurant',   address: '530 Blair Blvd',     hood: 'Whiteaker',    verified: true,  rating: 4.7 },
    { id: 'b-stellaria',  name: 'Stellaria Natural Foods',   type: 'Grocery',      address: '588 E Broadway',     hood: 'Downtown',     verified: true,  rating: 4.5 },
    { id: 'b-laughingp',  name: 'Laughing Planet',           type: 'Cafe',         address: '760 Blair Blvd',     hood: 'Whiteaker',    verified: true,  rating: 4.6 },
    { id: 'b-springer',   name: 'Springer’s Coffee',    type: 'Cafe',         address: '1144 Willamette St', hood: 'Downtown',     verified: true,  rating: 4.5 },
  ],
  listings: [
    { id: 'L-204', biz: 'b-newday',     title: 'End-of-day sourdough + ciabatta',        category: 'bakery',   servings: 14, weight: '8 lb',  window: { start: inMins(45),  end: inMins(135) }, diet: ['vegan'],                notes: 'Pull from the rack at the front counter — ask for the SparePlate bag.', claims: 2, max: 6, distance: 1.4 },
    { id: 'L-203', biz: 'b-tacovore',   title: 'Prepared bowls — carnitas + veggie', category: 'prepared', servings: 18, weight: '12 lb', window: { start: inMins(15),  end: inMins(75)  }, diet: ['gluten-free'],          notes: 'Hot-to-cold within 1 hr. Refrigerate immediately.',                         claims: 5, max: 9, distance: 0.8, urgent: true },
    { id: 'L-202', biz: 'b-marketmint', title: 'Day-old produce — mixed',            category: 'produce',  servings: 30, weight: '22 lb', window: { start: inMins(0),   end: inMins(240) }, diet: ['vegan','gluten-free'],   notes: 'Loading dock at rear. Ring bell labeled “Donations”.',           claims: 1, max: 4, distance: 2.2 },
    { id: 'L-201', biz: 'b-hideaway',   title: 'Croissants + morning buns',               category: 'bakery',   servings: 22, weight: '6 lb',  window: { start: inMins(-30), end: inMins(60)  }, diet: ['vegetarian'],           notes: 'Ask for Aurora at the back kitchen.',                                      claims: 4, max: 4, distance: 3.6, full: true },
    { id: 'L-200', biz: 'b-stellaria',  title: 'Bulk grains + lentils — close to date', category: 'pantry', servings: 40, weight: '15 lb', window: { start: inMins(0),  end: inMins(360) }, diet: ['vegan','gluten-free'],   notes: 'Boxed and labeled by category.',                                           claims: 0, max: 5, distance: 1.1 },
    { id: 'L-199', biz: 'b-laughingp',  title: 'Soup of the day — chicken tortilla', category: 'prepared', servings: 12, weight: '2 gal', window: { start: inMins(60),  end: inMins(150) }, diet: [],                       notes: 'Bring your own containers (we have a few quart tubs).',                   claims: 1, max: 6, distance: 1.7 },
    { id: 'L-198', biz: 'b-glazed',     title: 'Yesterday’s donuts (sealed)',         category: 'bakery',   servings: 24, weight: '3 lb',  window: { start: inMins(30),  end: inMins(180) }, diet: ['vegetarian'],           notes: '',                                                                        claims: 0, max: 4, distance: 2.0 },
    { id: 'L-197', biz: 'b-springer',   title: 'Whole milk + oat milk cartons',            category: 'dairy',    servings: 10, weight: '4 gal', window: { start: inMins(0),   end: inMins(120) }, diet: ['vegetarian'],           notes: 'Unopened. Pickup at espresso bar.',                                        claims: 2, max: 3, distance: 1.9 },
    { id: 'L-196', biz: 'b-cornucopia', title: 'Burger buns + sweet potato fries',         category: 'prepared', servings: 16, weight: '7 lb',  window: { start: inMins(180), end: inMins(300) }, diet: ['vegetarian'],           notes: 'Will be packed for 9pm pickup.',                                           claims: 0, max: 5, distance: 2.5 },
  ],
  reservations: [
    { id: 'R-441', listing: 'L-203', who: 'You',            when: inMins(-2),  status: 'reserved',  code: '4F8K' },
    { id: 'R-438', listing: 'L-201', who: 'C. Reyes',       when: inMins(-25), status: 'picked-up' },
    { id: 'R-433', listing: 'L-201', who: 'Burrito Brigade', when: inMins(-40), status: 'picked-up' },
  ],
  myBiz: 'b-newday',
  impact: {
    meals_this_month: 412,
    lb_diverted: 184,
    co2_avoided_lb: 332,
    value_recovered: 1840,
    sparkline: [4, 7, 9, 11, 14, 12, 16, 18, 20, 17, 22, 24, 28, 32],
    streak_days: 17,
  },
  hubSeries: [
    { d: '5/01', meals: 142 }, { d: '5/02', meals: 168 }, { d: '5/03', meals: 96  },
    { d: '5/04', meals: 110 }, { d: '5/05', meals: 184 }, { d: '5/06', meals: 192 },
    { d: '5/07', meals: 220 }, { d: '5/08', meals: 245 }, { d: '5/09', meals: 178 },
    { d: '5/10', meals: 134 }, { d: '5/11', meals: 256 }, { d: '5/12', meals: 280 },
    { d: '5/13', meals: 312 }, { d: '5/14', meals: 188 },
  ],
  mapPins: [],
};

SP_DATA.mapPins = SP_DATA.listings.map((l, i) => {
  const seed = (l.id.charCodeAt(2) * 13 + i * 7) % 100;
  return {
    id: l.id,
    x: 0.15 + ((seed * 11) % 70) / 100,
    y: 0.15 + ((seed * 7 + 23) % 70) / 100,
  };
});
