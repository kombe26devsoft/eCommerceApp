

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { Product } from './types';

const FavoritesScreen: React.FC = () => {
  const router = useRouter();
  const { items: products, loading, error } = useSelector((state: any) => state.products);
  const { items: favorites, loading: favLoading } = useSelector((state: any) => state.favorites);
  const favoriteProducts = useMemo(() => products.filter((p: Product) => favorites.includes(p.id)), [products, favorites]);
  const numColumns = Dimensions.get('window').width >= 768 ? 2 : 1;

  if (loading || favLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {favoriteProducts.length === 0 ? (
        <View style={styles.center}><Text>No favorites yet.</Text></View>
      ) : (
        <FlatList
          data={favoriteProducts}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/product-details', params: { id: item.id } })}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${item.name}`}
            >
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: 'bold',
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

export default FavoritesScreen;
