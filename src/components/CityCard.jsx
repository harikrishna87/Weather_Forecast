import React from 'react';
import { Card, Typography, Space, Button, Spin, Row, Col, Flex } from 'antd';
import { CloseOutlined, StarFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite } from '../store/weatherslice';
import { formatTemperature, getWeatherIconUrl } from '../utils/weatherUtils';

const { Title, Text } = Typography;

const CityCard = ({ city, onClick }) => {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.weather.unit);
  const currentWeather = useSelector((state) => state.weather.currentWeather[city.id]?.data);
  const status = useSelector((state) => state.weather.status);

  const handleRemoveFavorite = (e) => {
    e.stopPropagation();
    dispatch(removeFavorite(city.id));
  };

  const cardStyles = {
    width: '100%',
    maxWidth: 280,
    minWidth: 250,
    margin: 16,
    borderRadius: 12,
    border: '1px solid #e6f4ff',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const calculateDewPoint = (temp, humidity) => {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  };

  return (
    <Card
      hoverable
      style={cardStyles}
      onClick={() => onClick(city)}
      bodyStyle={{ padding: 16 }}
      className="city-card"
    >

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          {city.name}
          <Text type="secondary" style={{ marginLeft: 8, fontSize: '0.8em', color: '#4a90e2' }}>
            {city.country}
          </Text>
        </Title>
        <Space>
          <Button
            type="text"
            icon={<StarFilled style={{ color: '#FFD700' }} />}
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleRemoveFavorite}
            style={{ color: '#ff4d4f' }}
            danger
          />
        </Space>
      </div>

      {status === 'loading' && !currentWeather ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin size="large" style={{ color: '#1890ff' }} />
          <br />
          <Text style={{ color: '#4a90e2', marginTop: 8 }}>Loading data...</Text>
        </div>
      ) : currentWeather ? (
        <>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <img
              src={getWeatherIconUrl(currentWeather.weather[0].icon)}
              alt={currentWeather.weather[0].description}
              style={{
                width: 80,
                height: 80
              }}
            />
            <Title level={2} style={{ margin: '8px 0 0 0', color: '#1890ff' }}>
              {formatTemperature(currentWeather.main.temp, unit)}
            </Title>
            <Text strong style={{
              textTransform: 'capitalize',
              color: '#4a90e2',
              fontSize: '14px'
            }}>
              {currentWeather.weather[0].description}
            </Text>
          </div>

          <Flex align='center' justify='space-between' style={{ marginTop: "10px", padding: "0px 20px" }}>
            <Text type="secondary" style={{ color: '#4a90e2', fontSize: '12px' }}>Humidity: {currentWeather.main.humidity}%</Text>
            <Text type="secondary" style={{ color: '#4a90e2', fontSize: '12px' }}>Wind: {currentWeather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</Text>
          </Flex>

          <Flex align='center' justify='space-between' style={{ marginTop: "5px", padding: "0px 20px" }}>
            <Text type="secondary" style={{ color: '#4a90e2', fontSize: '12px' }}>Cloudiness: {currentWeather.clouds?.all || 0}%</Text>
            <Text type="secondary" style={{ color: '#4a90e2', fontSize: '12px' }}>Dew Point: {formatTemperature(calculateDewPoint(currentWeather.main.temp, currentWeather.main.humidity), unit)}</Text>
          </Flex>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Text type="danger">Failed to load weather data.</Text>
        </div>
      )}
    </Card>
  );
};

export default CityCard;