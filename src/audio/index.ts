export enum SfxKey {
  Deposit = "deposit",
  Shake = "shake",
}

export enum AudioType {
  Wave = "wav",
  Mp3 = "mp3",
  Ogg = "ogg",
}

export type Sound = {
  pool: HTMLAudioElement[];
  index: number;
};

export type SoundConfig = {
  key: SfxKey;
  name: string;
  ext: AudioType;
  poolSize: number;
};

export const SOUNDS: SoundConfig[] = [
  {
    key: SfxKey.Deposit,
    name: "deposit",
    ext: AudioType.Mp3,
    poolSize: 1,
  },
  {
    key: SfxKey.Shake,
    name: "shake",
    ext: AudioType.Wave,
    poolSize: 3,
  },
];
