import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITES';

describe('Favorites Store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should add and remove favorite product ids', async () => {
    // Add
    let favs = JSON.parse((await AsyncStorage.getItem(FAVORITES_KEY)) || '[]');
    expect(favs).toEqual([]);
    favs.push('1');
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    let stored = JSON.parse((await AsyncStorage.getItem(FAVORITES_KEY)) || '[]');
    expect(stored).toEqual(['1']);

    // Remove
    favs = stored.filter((id: string) => id !== '1');
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    stored = JSON.parse((await AsyncStorage.getItem(FAVORITES_KEY)) || '[]');
    expect(stored).toEqual([]);
  });
});
