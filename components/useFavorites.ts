import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITES_KEY';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch {
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveFavorites = useCallback(async (ids: string[]) => {
    setFavorites(ids);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  }, []);

  const addFavorite = useCallback(async (id: string) => {
    if (!favorites.includes(id)) {
      await saveFavorites([...favorites, id]);
    }
  }, [favorites, saveFavorites]);

  const removeFavorite = useCallback(async (id: string) => {
    await saveFavorites(favorites.filter(fav => fav !== id));
  }, [favorites, saveFavorites]);

  return { favorites, loading, addFavorite, removeFavorite };
}
