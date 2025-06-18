import React, { useState, useEffect } from 'react';
import { Input, Button, List, Typography, Space, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { searchCities, addFavorite, clearSearchResults, fetchCurrentWeather } from '../store/weatherslice';
import { debounce } from 'lodash';

const { Search } = Input;
const { Text } = Typography;

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchResultCities = useSelector((state) => state.weather.searchResultCities);
  const favoriteCities = useSelector((state) => state.weather.favoriteCities);
  const [searchText, setSearchText] = useState('');

  const debouncedSearch = debounce((value) => {
    if (value.trim()) {
      dispatch(searchCities(value));
    } else {
      dispatch(clearSearchResults());
    }
  }, 500);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleAddFavorite = (city) => {
    dispatch(addFavorite(city));
    dispatch(fetchCurrentWeather(city.id));
    setSearchText('');
    dispatch(clearSearchResults());
  };

  const isFavorited = (cityId) => favoriteCities.some(city => city.id === cityId);

  return (
    <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
      <Search
        placeholder="Search for a city..."
        enterButton="Search"
        size="large"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={handleSearch}
        style={{
          '& .ant-input': {
            backgroundColor: '#f8fafc',
            borderColor: '#3b82f6',
            color: '#1e293b'
          },
          '& .ant-input:focus': {
            borderColor: '#2563eb',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
          },
          '& .ant-btn': {
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            color: '#ffffff'
          },
          '& .ant-btn:hover': {
            backgroundColor: '#2563eb',
            borderColor: '#2563eb'
          }
        }}
      />
      {searchResultCities.length > 0 && searchText && (
        <List
          size="small"
          bordered
          dataSource={searchResultCities}
          renderItem={(city) => (
            <List.Item
              actions={[
                !isFavorited(city.id) && (
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddFavorite(city)}
                    style={{
                      color: '#3b82f6',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dbeafe';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Add
                  </Button>
                ),
              ]}
              style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <Text style={{ color: '#1e293b' }}>{city.name}, {city.country}</Text>
            </List.Item>
          )}
          style={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            backgroundColor: '#ffffff',
            top: '100%',
            marginTop: 4,
            maxHeight: 300,
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
            border: '1px solid #dbeafe',
            borderRadius: '8px'
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;