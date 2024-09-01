import { useEffect, useState } from "react";
import { SfxKey, Sound, SoundConfig, SOUNDS } from "../audio";

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

let soundManager: SoundManager | null = null;

export const useSound = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!soundManager) {
      soundManager = new SoundManager(SOUNDS);
      setIsReady(true);
    }
  }, []);

  return {
    soundManager,
    isReady,
  };
};
