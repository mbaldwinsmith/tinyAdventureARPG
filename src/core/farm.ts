import type { FarmCommand } from './farm-model';
import {
  cropIdSchema,
  CROPS,
  FARM_BARREL,
  FARM_PLOTS,
  FARM_REGION,
  WATER_CAPACITY,
} from '../content/farm';
import type { ContentRegistry } from '../content/schemas';
import type { EntityId, ItemId } from './ids';
import { allocatedId, toolIdSchema } from './ids';
import { receiveItem } from './inventory';
import { itemInstanceSchema } from './model';
import type { SaveState } from './model';
import { calendarView } from './time';

const FARM_TOOLS = ['tool:hoe', 'tool:watering-can'].map((id) => toolIdSchema.parse(id));
const findPlot = (state: SaveState, target: EntityId) =>
  state.domains.farm.plots.find((plot) => plot.id === target && plot.regionId === FARM_REGION);

export function farmDayChanged(state: SaveState) {
  const { season } = calendarView(state.calendar, state.timeRules);
  for (const plot of state.domains.farm.plots) {
    const planted = plot.crop;
    if (planted && !planted.withered) {
      const crop = CROPS[planted.id];
      if (!crop.seasons.includes(season)) planted.withered = true;
      else if (plot.wateredDay === state.calendar.day - 1 && planted.growth < crop.days)
        planted.growth++;
    }
    plot.wateredDay = null;
  }
}

export function farmView(state: SaveState, target: EntityId | null) {
  const { season, day } = calendarView(state.calendar, state.timeRules);
  const plots = FARM_PLOTS.map(({ id }) => {
    const plot = findPlot(state, id);
    const crop = plot?.crop;
    const definition = crop && CROPS[crop.id];
    return {
      id,
      prepared: !!plot?.prepared,
      wet: plot?.wateredDay === day,
      crop:
        crop && definition
          ? {
              id: crop.id,
              name: definition.name,
              growth: crop.growth,
              days: definition.days,
              withered: crop.withered,
              ready: !crop.withered && crop.growth >= definition.days,
            }
          : null,
    };
  });
  return {
    plots,
    transaction: state.nextTransaction,
    started: state.domains.farm.suppliesClaimed,
    water: state.domains.farm.water,
    capacity: WATER_CAPACITY,
    target:
      target === FARM_BARREL.id
        ? ('barrel' as const)
        : (plots.find((plot) => plot.id === target) ?? null),
    seeds:
      target && target !== FARM_BARREL.id
        ? cropIdSchema.options.map((id) => {
            const crop = CROPS[id];
            return {
              id,
              name: crop.name,
              available: crop.seasons.includes(season),
              seasons: crop.seasons.join(' and '),
              count: state.player.carried.items.reduce(
                (count, item) => count + (item.templateId === crop.seed ? item.quantity : 0),
                0,
              ),
            };
          })
        : [],
  };
}

function grant(state: SaveState, content: ContentRegistry, templateId: ItemId, quantity: number) {
  if (!Number.isSafeInteger(state.world.nextId + 1))
    throw new Error('Item identity limit reached.');
  state.player.carried = receiveItem(
    state.player.carried,
    itemInstanceSchema.parse({
      id: allocatedId(state.world.id, state.world.nextId++, 'item-instance'),
      templateId,
      quantity,
      enchantments: [],
    }),
    content,
  );
}

/** Applies one action to a detached save candidate. */
export function applyFarmCommand(state: SaveState, content: ContentRegistry, command: FarmCommand) {
  const farm = state.domains.farm;
  const plot = findPlot(state, command.target);
  const { day, season } = calendarView(state.calendar, state.timeRules);
  if (command.type === 'farm.tend' && command.action === 'supplies') {
    if (!FARM_PLOTS.some((entry) => entry.id === command.target) || farm.suppliesClaimed)
      throw new Error('The starter supplies have already been collected.');
    for (const crop of Object.values(CROPS)) grant(state, content, crop.seed, 1);
    for (const tool of FARM_TOOLS)
      if (!state.player.permanent.tools.includes(tool)) state.player.permanent.tools.push(tool);
    farm.suppliesClaimed = true;
    farm.water = WATER_CAPACITY;
    return 'Collected a hoe, a full watering can and three seeds.';
  }
  if (!farm.suppliesClaimed) throw new Error('Collect the starter supplies at a farm plot first.');
  if (command.type === 'farm.tend' && command.action === 'refill') {
    if (command.target !== FARM_BARREL.id || farm.water === WATER_CAPACITY)
      throw new Error('The watering can is already full or the barrel is out of reach.');
    farm.water = WATER_CAPACITY;
    return 'Filled the watering can.';
  }
  if (!FARM_PLOTS.some((entry) => entry.id === command.target))
    throw new Error('Choose a farm plot.');
  const energy = state.player.actor.resources.energy;
  if (command.type === 'farm.tend' && command.action === 'hoe') {
    if (plot?.prepared) throw new Error('This plot is already hoed.');
    if (energy.current < 1) throw new Error('You need one energy to hoe the soil.');
    energy.current--;
    if (plot) plot.prepared = true;
    else
      farm.plots.push({
        id: command.target,
        regionId: FARM_REGION,
        prepared: true,
        wateredDay: null,
        crop: null,
      });
    return 'Hoed the soil.';
  }
  if (!plot?.prepared) throw new Error('Hoe the soil first.');
  if (command.type === 'farm.plant') {
    const crop = CROPS[command.crop];
    if (plot.crop) throw new Error('This plot already has a crop.');
    if (!crop.seasons.includes(season))
      throw new Error(`Plant ${crop.name} in ${crop.seasons.join(' or ')}.`);
    const seed = state.player.carried.items.find((item) => item.templateId === crop.seed);
    if (!seed) throw new Error('There are no matching seeds in your pack.');
    seed.quantity--;
    state.player.carried.items = state.player.carried.items.filter((item) => item.quantity > 0);
    plot.crop = { id: command.crop, growth: 0, withered: false };
    return `Planted ${crop.name.toLowerCase()}.`;
  }
  const planted = plot.crop;
  if (command.action === 'clear') {
    if (!planted?.withered) throw new Error('Only a withered crop can be cleared.');
    plot.crop = null;
    return 'Cleared the withered crop.';
  }
  if (!planted || planted.withered) throw new Error('Plant a seasonal crop first.');
  const crop = CROPS[planted.id];
  if (command.action === 'water') {
    if (planted.growth >= crop.days) throw new Error('Harvest the ripe crop first.');
    if (plot.wateredDay === day) throw new Error('This plot is already watered today.');
    if (farm.water === 0) throw new Error('Refill the watering can at the farm barrel.');
    if (energy.current < 1) throw new Error('You need one energy to water the crop.');
    energy.current--;
    farm.water--;
    plot.wateredDay = day;
    return 'Watered the crop for today.';
  }
  if (command.action !== 'harvest' || planted.growth < crop.days)
    throw new Error('The crop is still growing.');
  grant(state, content, crop.produce, crop.yield);
  if (crop.regrow) planted.growth = crop.days - crop.regrow;
  else plot.crop = null;
  return `Harvested ${crop.yield} × ${crop.name}.`;
}
