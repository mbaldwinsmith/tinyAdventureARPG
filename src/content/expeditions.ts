import type { Biome } from '../core/generation-model';
export const EXPEDITIONS: readonly {
  id: string;
  name: string;
  biome: Biome;
  links: readonly string[];
}[] = [
  {
    id: 'region:forest',
    name: 'Whispering forest',
    biome: 'forest',
    links: ['region:clearing', 'region:desert', 'region:winter', 'region:coast', 'region:crypt'],
  },
  { id: 'region:desert', name: 'Amber dunes', biome: 'desert', links: ['region:forest'] },
  { id: 'region:winter', name: 'Winter hollows', biome: 'winter', links: ['region:forest'] },
  { id: 'region:coast', name: 'Tidewood coast', biome: 'coast', links: ['region:forest'] },
  { id: 'region:crypt', name: 'The anchored crypt', biome: 'crypt', links: ['region:forest'] },
];
