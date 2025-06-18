import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loadState, saveState } from '../utils/localStorage';
import { API_KEY, BASE_WEATHER_URL, BASE_FORECAST_URL, BASE_FIND_URL, CACHE_DURATION } from '../utils/constants';

const initialState = {
  favoriteCities: [],
  unit: 'metric',
  currentWeather: {},
  forecasts: {},
  searchResultCities: [],
  status: 'idle',
  error: null,
};

// Load preloaded state with fallback
const preloadedState = (() => {
  try {
    const saved = loadState('weatherState');
    return saved ? { ...initialState, ...saved } : initialState;
  } catch (error) {
    console.warn('Failed to load weather state from localStorage:', error);
    return initialState;
  }
})();

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async (cityId, { getState, rejectWithValue }) => {
    try {
      const { weather } = getState();
      const city = weather.favoriteCities.find(c => c.id === cityId);
      
      if (!city) {
        return rejectWithValue('City not found in favorites');
      }

      // Check cache
      const cachedData = weather.currentWeather[city.id];
      if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        return { id: city.id, data: cachedData.data, fromCache: true };
      }

      const response = await axios.get(BASE_WEATHER_URL, {
        params: {
          id: city.id,
          appid: API_KEY,
          units: weather.unit,
        },
        timeout: 10000, // 10 second timeout
      });

      return { id: city.id, data: response.data, fromCache: false };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - please try again');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch weather data');
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (cityId, { getState, rejectWithValue }) => {
    try {
      const { weather } = getState();
      const city = weather.favoriteCities.find(c => c.id === cityId);
      
      if (!city) {
        return rejectWithValue('City not found in favorites');
      }

      // Check cache
      const cachedData = weather.forecasts[city.id];
      if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        return { id: city.id, data: cachedData.data, fromCache: true };
      }

      const response = await axios.get(BASE_FORECAST_URL, {
        params: {
          id: city.id,
          appid: API_KEY,
          units: weather.unit,
        },
        timeout: 10000,
      });

      return { id: city.id, data: response.data, fromCache: false };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - please try again');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch forecast data');
    }
  }
);

export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query, { getState, rejectWithValue }) => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const { weather } = getState();
      const response = await axios.get(BASE_FIND_URL, {
        params: {
          q: query.trim(),
          appid: API_KEY,
          units: weather.unit,
          type: 'like',
          sort: 'population',
          cnt: 10,
        },
        timeout: 10000,
      });

      // Handle case where API returns no results
      if (!response.data.list || response.data.list.length === 0) {
        return [];
      }

      return response.data.list.map(city => ({
        id: city.id,
        name: city.name,
        country: city.sys?.country || 'Unknown',
        lat: city.coord?.lat || 0,
        lon: city.coord?.lon || 0,
      }));
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Search timeout - please try again');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to search cities');
    }
  }
);

// Helper function to safely save state
const safeSaveState = (state) => {
  try {
    saveState('weatherState', state);
  } catch (error) {
    console.warn('Failed to save weather state to localStorage:', error);
  }
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState: preloadedState,
  reducers: {
    addFavorite: (state, action) => {
      const newCity = action.payload;
      if (!newCity || !newCity.id) {
        return; // Invalid city data
      }
      
      if (!state.favoriteCities.some(city => city.id === newCity.id)) {
        state.favoriteCities.push(newCity);
        safeSaveState(state);
      }
    },
    
    removeFavorite: (state, action) => {
      const cityId = action.payload;
      state.favoriteCities = state.favoriteCities.filter(city => city.id !== cityId);
      
      // Clean up cached data
      if (state.currentWeather[cityId]) {
        delete state.currentWeather[cityId];
      }
      if (state.forecasts[cityId]) {
        delete state.forecasts[cityId];
      }
      
      safeSaveState(state);
    },
    
    setUnit: (state, action) => {
      const newUnit = action.payload;
      if (newUnit !== 'metric' && newUnit !== 'imperial' && newUnit !== 'kelvin') {
        return; // Invalid unit
      }
      
      state.unit = newUnit;
      // Clear cached data when unit changes
      state.currentWeather = {};
      state.forecasts = {};
      safeSaveState(state);
    },
    
    clearSearchResults: (state) => {
      state.searchResultCities = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Add action to clear expired cache
    clearExpiredCache: (state) => {
      const now = Date.now();
      
      // Clear expired weather data
      Object.keys(state.currentWeather).forEach(cityId => {
        if (now - state.currentWeather[cityId].timestamp >= CACHE_DURATION) {
          delete state.currentWeather[cityId];
        }
      });
      
      // Clear expired forecast data
      Object.keys(state.forecasts).forEach(cityId => {
        if (now - state.forecasts[cityId].timestamp >= CACHE_DURATION) {
          delete state.forecasts[cityId];
        }
      });
      
      safeSaveState(state);
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Current Weather Cases
      .addCase(fetchCurrentWeather.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        
        if (!action.payload.fromCache) {
          state.currentWeather[action.payload.id] = {
            data: action.payload.data,
            timestamp: Date.now(),
          };
          safeSaveState(state);
        }
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch current weather';
      })
      
      // Forecast Cases
      .addCase(fetchForecast.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        
        if (!action.payload.fromCache) {
          state.forecasts[action.payload.id] = {
            data: action.payload.data,
            timestamp: Date.now(),
          };
          safeSaveState(state);
        }
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch forecast';
      })
      
      // Search Cities Cases
      .addCase(searchCities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.searchResultCities = action.payload;
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to search cities';
        state.searchResultCities = [];
      });
  },
});

export const { 
  addFavorite, 
  removeFavorite, 
  setUnit, 
  clearSearchResults, 
  clearError, 
  clearExpiredCache 
} = weatherSlice.actions;

export default weatherSlice.reducer;