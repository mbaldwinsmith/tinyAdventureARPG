import { createStore } from 'zustand/vanilla';
import { INITIAL_SNAPSHOT } from '../bridge/game-bridge';
import type { GameSnapshot } from '../bridge/game-bridge';

export const createUiStore = () =>
  createStore<{ snapshot: GameSnapshot }>(() => ({ snapshot: INITIAL_SNAPSHOT }));
