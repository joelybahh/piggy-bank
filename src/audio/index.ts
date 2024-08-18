export enum SfxKey {
  Deposit = "deposit",
  Shake = "shake",
}

export enum AudioType {
  Wave = "wav",
  Mp3 = "mp3",
  Ogg = "ogg",
}

type Sound = {
  pool: HTMLAudioElement[];
  index: number;
};

type SoundConfig = {
  key: SfxKey;
  name: string;
  ext: AudioType;
  poolSize: number;
};

const SOUNDS: SoundConfig[] = [
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

class SoundManager {
  private sounds: Record<SfxKey, Sound>;

  constructor(soundsConfig: SoundConfig[]) {
    this.sounds = {} as Record<SfxKey, Sound>;
    soundsConfig.forEach((config) => this.loadSound(config));
  }

  loadSound({ ext, key, name, poolSize }: SoundConfig): void {
    this.sounds[key] = {
      pool: Array(poolSize)
        .fill(null)
        .map(() => new Audio(`/audio/${name}.${ext}`)),
      index: 0,
    };
  }

  play(key: SfxKey): boolean {
    const sound = this.sounds[key];

    if (!sound) {
      console.warn(`Sound ${key} not loaded`);
      return false;
    }

    const audio = sound.pool[sound.index];

    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.error(`Error playing sound ${key}:`, error);
    });

    sound.index = (sound.index + 1) % sound.pool.length;
    return true;
  }

  stopAll(key: SfxKey): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.pool.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }

  isLoaded(key: SfxKey): boolean {
    return key in this.sounds;
  }
}

export const soundManager = new SoundManager(SOUNDS);
