import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedAppState = {
  stage: 'public' | 'onboarding' | 'app';
  name: string;
  rank: string;
  budget: string;
  shortlisted: number[];
};

const key = 'enggxr.mobile.state.v1';

export async function loadAppState(): Promise<SavedAppState | null> {
  const value = await AsyncStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as SavedAppState;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}

export async function saveAppState(value: SavedAppState) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function clearAppState() {
  await AsyncStorage.removeItem(key);
}
