import React, { useEffect, useState } from 'react';
import { Layout, Typography, Space, Flex, Empty, Button, Modal, Spin, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather, fetchForecast } from '../store/weatherslice';
import SearchBar from '../components/SearchBar';
import UnitToggle from '../components/UnitToggle';
import CityCard from '../components/CityCard';
import { WEATHER_REFRESH_INTERVAL } from '../utils/constants';
import WeatherCharts from '../components/WeatherCharts';
import { CloudOutlined, HeartOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const favoriteCities = useSelector((state) => state.weather.favoriteCities);
  const forecasts = useSelector((state) => state.weather.forecasts);
  const unit = useSelector((state) => state.weather.unit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    favoriteCities.forEach(city => {
      dispatch(fetchCurrentWeather(city.id));
    });
  }, [favoriteCities, dispatch, unit]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      favoriteCities.forEach(city => {
        dispatch(fetchCurrentWeather(city.id));
      });
    }, WEATHER_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [favoriteCities, dispatch, unit]);

  const handleCityCardClick = (city) => {
    setSelectedCity(city);
    dispatch(fetchForecast(city.id));
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCity(null);
  };

  const modalForecastData = selectedCity ? forecasts[selectedCity.id]?.data : null;
  const headerStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: isMobile ? '0 16px' : '0 32px',
    borderBottom: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    height: isMobile ? '60px' : '64px'
  };

  const contentStyle = {
    padding: isMobile ? '20px 16px' : '40px 32px',
    flex: 1,
    background: 'transparent'
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
    backdropFilter: 'blur(20px)',
    border: 'none',
    borderRadius: isMobile ? '16px' : '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    minHeight: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 200px)',
    padding: isMobile ? '16px' : '24px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile 
      ? '1fr' 
      : 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: isMobile ? '16px' : '24px',
    padding: isMobile ? '12px 0' : '20px 0'
  };

  const titleStyle = {
    margin: 0,
    color: "#1890ff",
    fontWeight: 700,
    fontSize: isMobile ? '18px' : '24px'
  };

  return (
    <Layout style={{ 
      minHeight: '100vh'
    }}>
      <Header style={headerStyle}>
        <Flex 
          align="center" 
          justify="space-between" 
          style={{ height: '100%' }}
        >
          <Flex align="center" gap={isMobile ? 8 : 12}>
            <CloudOutlined style={{ 
              fontSize: isMobile ? '20px' : '28px', 
              color: '#1890ff' 
            }} />
            <Title level={isMobile ? 4 : 2} style={titleStyle}>
              {isMobile ? 'Weather' : 'Weather Dashboard'}
            </Title>
          </Flex>
          <UnitToggle />
        </Flex>
      </Header>
      
      <Content style={contentStyle}>
        <Card style={cardStyle}>
          <Flex 
            align="center" 
            justify="space-between"
            style={{ 
              marginBottom: isMobile ? '20px' : '32px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: isMobile ? '12px' : '16px'
            }}
          >
            <Flex align="center" gap={8}>
              <HeartOutlined style={{ 
                fontSize: isMobile ? '18px' : '24px', 
                color: '#ff4d4f' 
              }} />
              <Title 
                level={isMobile ? 4 : 3} 
                style={{ 
                  margin: 0,
                  color: '#1890ff',
                  fontWeight: 600,
                  fontSize: isMobile ? '16px' : '20px'
                }}
              >
                My Favorite Cities
              </Title>
            </Flex>
            <div style={{ 
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : '300px'
            }}>
              <SearchBar />
            </div>
          </Flex>
          
          {favoriteCities.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: isMobile ? '300px' : '400px'
            }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{
                  height: isMobile ? 80 : 100,
                  filter: 'opacity(0.7)'
                }}
                description={
                  <div style={{ textAlign: 'center' }}>
                    <Text style={{ 
                      fontSize: isMobile ? '16px' : '18px', 
                      color: '#8c8c8c',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      No favorite cities yet
                    </Text>
                    <Text style={{ 
                      fontSize: isMobile ? '12px' : '14px', 
                      color: '#bfbfbf'
                    }}>
                      Search and add some cities above to get started!
                    </Text>
                  </div>
                }
              />
            </div>
          ) : (
            <div style={gridStyle}>
              {favoriteCities.map((city) => (
                <div 
                  key={city.id}
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                  onTouchStart={(e) => {
                    if (isMobile) {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (isMobile) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <CityCard city={city} onClick={handleCityCardClick} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </Content>

      <Modal
        title={
          <Flex align="center" gap={isMobile ? 8 : 12}>
            <CloudOutlined style={{ 
              color: '#1890ff', 
              fontSize: isMobile ? '16px' : '20px' 
            }} />
            <span style={{ 
              color: '#1890ff',
              fontSize: isMobile ? '14px' : '18px',
              fontWeight: 600,
              lineHeight: 1.4
            }}>
              {selectedCity ? 
                `${selectedCity.name}, ${selectedCity.country}${isMobile ? '' : ' - Detailed Weather'}` : 
                'Detailed Weather'
              }
            </span>
          </Flex>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={isMobile ? '95%' : '90%'}
        centered
        destroyOnClose
        styles={{
          header: {
            padding: isMobile ? '12px 16px' : '16px 24px'
          },
          body: {
            maxHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 200px)',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)',
            padding: isMobile ? '16px' : '24px'
          },
          mask: {
            backdropFilter: 'blur(4px)'
          }
        }}
        style={{
          borderRadius: isMobile ? '8px' : '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }}
      >
        {selectedCity && modalForecastData ? (
          <WeatherCharts forecastData={modalForecastData} unit={unit} />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: isMobile ? '40px 16px' : '80px 20px',
            background: 'rgba(24, 144, 255, 0.05)',
            borderRadius: isMobile ? '8px' : '12px',
            border: '2px dashed #91d5ff'
          }}>
            <Spin 
              size={isMobile ? 'default' : 'large'}
              style={{
                '& .ant-spin-dot-item': {
                  backgroundColor: '#1890ff'
                }
              }}
            />
            <Text style={{ 
              display: 'block', 
              marginTop: isMobile ? 16 : 24,
              fontSize: isMobile ? '14px' : '16px',
              color: '#1890ff',
              fontWeight: 500
            }}>
              Loading forecast data...
            </Text>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Dashboard;