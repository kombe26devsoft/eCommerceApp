

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, ActivityIndicator, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchProducts } from '../store/productsSlice';
import type { Product } from './types';

const ProductListScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!search) setFiltered(products);
    else setFiltered(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, products]);

  const [numColumns, setNumColumns] = useState(Dimensions.get('window').width >= 768 ? 2 : 1);
  useEffect(() => {
    const handleResize = () => {
      setNumColumns(Dimensions.get('window').width >= 768 ? 2 : 1);
    };
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => {
      subscription.remove();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProducts())
      .unwrap()
      .finally(() => setRefreshing(false));
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator testID="ActivityIndicator" size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search products"
        returnKeyType="search"
      />
      {filtered.length === 0 ? (
        <View style={styles.center}><Text>No products found.</Text></View>
      ) : (
        <FlatList
          testID="FlatList"
          data={filtered}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
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
  search: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
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

export default ProductListScreen;
