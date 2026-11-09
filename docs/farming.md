# Farming in the clearing

The three beds sit southwest of the clearing's travel chest. Face a bed and select **Tend farm plot**. The first visit lets you collect a hoe, a four-charge watering can and one seed of each starter crop. These supplies are a single saved claim.

1. Hoe a bed, choose a seed suited to the current season and water the crop. Hoeing and watering each cost one energy.
2. Use **Rest until tomorrow** in the Day and season panel, or keep playing until the next day. A crop gains one day of growth for each day it was watered. Missed watering leaves its growth as it was.
3. Harvest when the plot says the crop is ready. A harvested bed stays hoed. Water blueberries again to get another harvest from the same plant.
4. Use the farm barrel southwest of the beds to refill the can. Once Tessa has opened her general store, she sells seeds and buys produce.

| Crop      | Seasons        | Watered days to first harvest | Harvest |       Regrowth | Seed price | Sale price per crop |
| --------- | -------------- | ----------------------------: | ------: | -------------: | ---------: | ------------------: |
| Turnip    | Spring, Autumn |                             2 |       1 |                |    2 coins |             4 coins |
| Carrot    | Spring, Autumn |                             3 |       2 |                |    3 coins |             3 coins |
| Blueberry | Spring, Summer |                             4 |       2 | 2 watered days |    5 coins |             2 coins |

When the calendar enters a season outside a crop's range, even a ripe crop withers. Clear it to reuse the bed. The crop set, water capacity and prices are preview values.

## Days and saves

A day spans 10 minutes of active play from 06:00 to the 02:00 cutoff. The calendar then advances to 06:00 the next morning. Choosing to rest advances the same day transition and fills energy immediately. Active play still uses the existing gradual energy recovery rules. Seasons are 28 days each. Menus, background pauses and time with the game closed leave the calendar and crops as they were.

The save records plot identity, tilled soil, crop growth, the last watering and the remaining water. The day transition applies crop growth and clears wet soil together. Planting and harvest share a checkpoint with inventory changes. If a checkpoint fails, retry from the same candidate. A full pack leaves the harvest available on the bed. A v6 backup migrates to v7 with the new beds and barrel. It keeps its date and local time where possible, clamping an old time past the new cutoff to 01:59 without growing crops.

The farm uses the owned Tiny Farm Pack crop sheet. The selected rows contain carrots, turnips and blueberries. Reading the occupied crop cells right to left gives the ripe plant, younger growth and harvested item. The atlas packs dry and wet soil, a sprout, six crop-stage cells and three harvested produce icons for the pack.
