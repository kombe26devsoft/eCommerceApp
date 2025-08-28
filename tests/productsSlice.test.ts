import reducer, { fetchProducts } from '../app/store/productsSlice';
import { Product } from '../app/screens/types';
import { AnyAction } from '@reduxjs/toolkit';

describe('productsSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle fetchProducts.pending', () => {
    const action = { type: fetchProducts.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchProducts.fulfilled', () => {
    const products: Product[] = [
      { id: '1', name: 'A', price: 1, image: '', description: 'desc1' },
      { id: '2', name: 'B', price: 2, image: '', description: 'desc2' },
    ];
    const action = { type: fetchProducts.fulfilled.type, payload: products };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.items).toEqual(products);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchProducts.rejected', () => {
    const action = { type: fetchProducts.rejected.type, payload: 'error' };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.error).toBe('error');
    expect(state.loading).toBe(false);
  });

  describe('fetchProducts thunk', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('dispatches fulfilled on success', async () => {
      const products: Product[] = [
        { id: '1', name: 'A', price: 1, image: '', description: 'desc1' },
      ];
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => products,
      });
      const thunk = fetchProducts();
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await thunk(dispatch, getState, undefined);
      expect(result.type).toBe(fetchProducts.fulfilled.type);
      expect(result.payload).toEqual(products);
    });

    it('dispatches rejected on fetch error', async () => {
      (fetch as jest.Mock).mockResolvedValue({ ok: false });
      const thunk = fetchProducts();
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await thunk(dispatch, getState, undefined);
      expect(result.type).toBe(fetchProducts.rejected.type);
      expect(result.payload).toBe('Failed to fetch products');
    });

    it('dispatches rejected on network error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      const thunk = fetchProducts();
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await thunk(dispatch, getState, undefined);
      expect(result.type).toBe(fetchProducts.rejected.type);
      expect(result.payload).toBe('Network error');
    });
  });
});
