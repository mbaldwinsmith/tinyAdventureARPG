import seedrandom from 'seedrandom';
import { z } from 'zod';

export const RANDOM_STREAMS = ['terrain', 'loot', 'encounters', 'death'] as const;
export type RandomStream = (typeof RANDOM_STREAMS)[number];
const byte = z.number().int().min(0).max(255);
const arc4StateSchema = z
  .strictObject({ i: byte, j: byte, S: z.array(byte).length(256) })
  .refine((v) => new Set(v.S).size === 256, 'Invalid PRNG permutation');
export const randomStateSchema = z.strictObject({
  algorithm: z.literal('seedrandom-arc4-v1'),
  streams: z.strictObject({
    terrain: arc4StateSchema,
    loot: arc4StateSchema,
    encounters: arc4StateSchema,
    death: arc4StateSchema,
  }),
});
export type RandomState = z.infer<typeof randomStateSchema>;
export class RandomStreams {
  private streams: Record<RandomStream, seedrandom.StatefulPRNG<seedrandom.State.Arc4>>;
  constructor(seed: string, saved?: RandomState) {
    if (!seed || seed.length > 128) throw new Error('Seed must have 1–128 characters');
    const state = saved ? randomStateSchema.parse(saved) : undefined;
    const stream = (name: RandomStream) =>
      seedrandom(JSON.stringify([seed, name, 1]) + '\0', { state: state?.streams[name] ?? true });
    this.streams = {
      terrain: stream('terrain'),
      loot: stream('loot'),
      encounters: stream('encounters'),
      death: stream('death'),
    };
  }
  next(stream: RandomStream): number {
    return this.streams[stream]();
  }
  integer(stream: RandomStream, maximumExclusive: number): number {
    if (
      !Number.isSafeInteger(maximumExclusive) ||
      maximumExclusive < 1 ||
      maximumExclusive > 0x100000000
    )
      throw new Error('Invalid random integer bound');
    return Math.floor(this.next(stream) * maximumExclusive);
  }
  snapshot(): RandomState {
    return {
      algorithm: 'seedrandom-arc4-v1',
      streams: {
        terrain: this.streams.terrain.state(),
        loot: this.streams.loot.state(),
        encounters: this.streams.encounters.state(),
        death: this.streams.death.state(),
      },
    };
  }
}
