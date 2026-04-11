import { createTamagui } from '@tamagui/core';
import { config as defaultConfig } from '@tamagui/config/v3';

export const tamaguiConfig = createTamagui(defaultConfig);

export type TamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
