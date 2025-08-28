import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITES_KEY';

export interface FavoritesState {
	items: string[];
	loading: boolean;
	error: string | null;
}

const initialState: FavoritesState = {
	items: [],
	loading: false,
	error: null,
};

export const loadFavorites = createAsyncThunk('favorites/load', async () => {
	const stored = await AsyncStorage.getItem(FAVORITES_KEY);
	return stored ? JSON.parse(stored) : [];
});

const saveFavorites = async (items: string[]) => {
	await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
};

const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		addFavorite: (state, action: PayloadAction<string>) => {
			if (!state.items.includes(action.payload)) {
				state.items.push(action.payload);
				saveFavorites(state.items);
			}
		},
		removeFavorite: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(id => id !== action.payload);
			saveFavorites(state.items);
		},
	},
	extraReducers: builder => {
		builder
			.addCase(loadFavorites.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loadFavorites.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(loadFavorites.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to load favorites';
			});
	},
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
