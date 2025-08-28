

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';

const ProductDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const dispatch: AppDispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const { items: favorites, loading: favLoading } = useSelector((state: RootState) => state.favorites);
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);
  const isFavorite = favorites.includes(id ?? '');

  const handleToggleFavorite = () => {
    if (!id) return;
    try {
      if (isFavorite) {
        dispatch(removeFavorite(id));
      } else {
        dispatch(addFavorite(id));
      }
    } catch {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  if (loading || favLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  if (error || !product) return <View style={styles.center}><Text style={styles.error}>{error || 'Product not found'}</Text></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.desc}>{product.description}</Text>
        <TouchableOpacity
          style={[styles.favBtn, isFavorite ? styles.favActive : styles.favInactive]}
          onPress={handleToggleFavorite}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Text style={styles.favText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  favBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  favText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favActive: {
    backgroundColor: '#FF3B30',
  },
  favInactive: {
    backgroundColor: '#34C759',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default ProductDetailsScreen;
