import React from 'react';
import { Line, Column } from '@ant-design/charts';
import { Card, Typography, Empty, Flex } from 'antd';
import moment from 'moment';
import { getWeatherIconUrl } from '../utils/weatherUtils';

const { Title, Text } = Typography;

const WeatherCharts = ({ forecastData, unit }) => {
  if (!forecastData || forecastData.length === 0) {
    return <Empty description="No forecast data available" />;
  }

  const hourlyData = forecastData.list.slice(0, 8 * 2);
  const windData = [];

  const hourlyTempChartData = hourlyData.map(item => ({
    time: moment.unix(item.dt).format('HH:00'),
    temperature: item.main.temp,
  }));

  hourlyData.forEach(item => {
    const hour = moment.unix(item.dt).format('HH:00');
    windData.push({ time: hour, speed: item.wind.speed });
  });

  const dailyDataMap = {};
  forecastData.list.forEach(item => {
    const date = moment.unix(item.dt).format('YYYY-MM-DD');
    if (!dailyDataMap[date]) {
      dailyDataMap[date] = { min: item.main.temp, max: item.main.temp };
    } else {
      dailyDataMap[date].min = Math.min(dailyDataMap[date].min, item.main.temp);
      dailyDataMap[date].max = Math.max(dailyDataMap[date].max, item.main.temp);
    }
  });

  const dailyTempChartData = Object.keys(dailyDataMap).flatMap(date => [
    { date: moment(date).format('MMM D'), value: dailyDataMap[date].max, type: 'Max Temp' },
    { date: moment(date).format('MMM D'), value: dailyDataMap[date].min, type: 'Min Temp' },
  ]);

  const dailyForecastDisplay = [];
  const uniqueDates = {};
  forecastData.list.forEach(item => {
    const date = moment.unix(item.dt);
    const dayKey = date.format('YYYY-MM-DD');
    if (!uniqueDates[dayKey]) {
      uniqueDates[dayKey] = true;
      dailyForecastDisplay.push({
        date: date.format('ddd, MMM D'),
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        wind: item.wind.speed,
      });
    }
  });

  const sevenDayForecast = dailyForecastDisplay.slice(0, 7);

  const cardStyles = {
    borderRadius: 12,
    border: '1px solid #e6f4ff',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
    transition: 'all 0.3s ease',
    width: '100%'
  };

  const forecastCardStyles = {
    textAlign: 'center',
    borderRadius: 12,
    border: '1px solid #e6f4ff',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: 'fit-content'
  };

  const tempChartConfig = {
    data: hourlyTempChartData,
    xField: 'time',
    yField: 'temperature',
    smooth: true,
    color: '#1890ff',
    autoFit: true,
    height: 300,
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#1890ff',
        stroke: '#ffffff',
        lineWidth: 2,
      },
    },
    line: {
      style: {
        stroke: '#1890ff',
        lineWidth: 3,
      },
    },
    areaStyle: {
      fill: 'linear-gradient(270deg, #1890ff 0%, rgba(24, 144, 255, 0.1) 100%)',
    },
    tooltip: {
      formatter: (data) => {
        return { name: 'Temperature', value: `${Math.round(data.temperature)}°${unit === 'metric' ? 'C' : 'F'}` };
      },
    },
    interactions: [{ type: 'brush-zoom' }],
    yAxis: {
      label: {
        formatter: (v) => `${v}°${unit === 'metric' ? 'C' : 'F'}`,
        style: {
          fill: '#4a90e2',
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#e6f4ff',
            lineWidth: 1,
          },
        },
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '#4a90e2',
          fontSize: 12,
        },
        rotate: -45,
      },
    },
    responsive: true,
  };

  const dailyTempChartConfig = {
    data: dailyTempChartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    color: ['#1890ff', '#40a9ff'],
    autoFit: true,
    height: 300,
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    tooltip: {
      formatter: (data) => {
        return { name: data.type, value: `${Math.round(data.value)}°${unit === 'metric' ? 'C' : 'F'}` };
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}°${unit === 'metric' ? 'C' : 'F'}`,
        style: {
          fill: '#4a90e2',
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#e6f4ff',
            lineWidth: 1,
          },
        },
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '#4a90e2',
          fontSize: 12,
        },
        rotate: -45,
      },
    },
    responsive: true,
  };

  const windConfig = {
    data: windData,
    xField: 'time',
    yField: 'speed',
    smooth: true,
    color: '#4a90e2',
    autoFit: true,
    height: 300,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#4a90e2',
        stroke: '#ffffff',
        lineWidth: 2,
      },
    },
    line: {
      style: {
        stroke: '#4a90e2',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (data) => {
        return { name: 'Wind Speed', value: `${data.speed} ${unit === 'metric' ? 'm/s' : 'mph'}` };
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v} ${unit === 'metric' ? 'm/s' : 'mph'}`,
        style: {
          fill: '#4a90e2',
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#e6f4ff',
            lineWidth: 1,
          },
        },
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '#4a90e2',
          fontSize: 12,
        },
        rotate: -45,
      },
    },
    responsive: true,
  };

  return (
    <div style={{ width: '100%', padding: '0 8px' }}>
      <style jsx>{`
        .forecast-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        
        .chart-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        
        .forecast-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin: 0 -4px;
        }
        
        .forecast-card {
          flex: 1 1 140px;
          max-width: 160px;
          min-width: 120px;
          margin: 4px;
        }
        
        .chart-container {
          width: 100%;
          overflow-x: auto;
          margin: 0 -8px;
          padding: 0 8px;
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          align-items: start;
        }
        
        @media (max-width: 1024px) {
          .forecast-card {
            flex: 1 1 calc(25% - 16px);
            max-width: none;
            min-width: 110px;
          }
          
          .stats-container {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 10px;
          }
        }
        
        @media (max-width: 768px) {
          .forecast-card {
            flex: 1 1 calc(33.333% - 16px);
            min-width: 100px;
            max-width: 140px;
          }
          
          .chart-container {
            margin: 0 -12px;
            padding: 0 12px;
          }
          
          .stats-container {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 8px;
          }
        }
        
        @media (max-width: 480px) {
          .forecast-card {
            flex: 1 1 calc(50% - 12px);
            min-width: 90px;
            max-width: none;
          }
          
          .chart-container {
            margin: 0 -16px;
            padding: 0 16px;
          }
          
          .stats-container {
            grid-template-columns: 1fr;
            gap: 6px;
          }
        }
        
        @media (max-width: 360px) {
          .forecast-card {
            flex: 1 1 100%;
            max-width: none;
            min-width: unset;
          }
          
          .forecast-container {
            flex-direction: column;
            align-items: center;
          }
        }
        
        @media (min-width: 1200px) {
          .forecast-card {
            flex: 0 1 160px;
          }
          
          .stats-container {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }
        }
      `}</style>

      <Flex vertical gap="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ color: '#1890ff', marginBottom: 16, textAlign: 'center' }}>
            Next 5 Days Weather Report
          </Title>
          <div className="forecast-container">
            {sevenDayForecast.map((day, index) => (
              <Card 
                key={index} 
                size="small" 
                style={forecastCardStyles}
                className="forecast-card"
                hoverable
              >
                <Text strong style={{ color: '#1890ff', display: 'block', marginBottom: 8, fontSize: '14px' }}>
                  {day.date}
                </Text>
                <img 
                  src={getWeatherIconUrl(day.icon)} 
                  alt={day.description} 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    margin: '8px 0',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }} 
                />
                <Text 
                  style={{ 
                    display: 'block', 
                    textTransform: 'capitalize',
                    color: '#4a90e2',
                    fontSize: '11px',
                    marginBottom: 4,
                    lineHeight: '1.2'
                  }}
                >
                  {day.description}
                </Text>
                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  {Math.round(day.temp)}°{unit === 'metric' ? 'C' : 'F'}
                </Text>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Title level={4} style={{ color: '#1890ff', marginTop: 32, marginBottom: 16, textAlign: 'center' }}>
            Every Hour Temperature Stats
          </Title>
          <div className="chart-container">
            <Card style={cardStyles} className="chart-card" hoverable>
              <Line {...tempChartConfig} />
            </Card>
          </div>
        </div>

        <div>
          <Title level={4} style={{ color: '#1890ff', marginBottom: 16, textAlign: 'center' }}>
            Daily Temperature Stats (Min/Max)
          </Title>
          <div className="chart-container">
            <Card style={cardStyles} className="chart-card" hoverable>
              <Column {...dailyTempChartConfig} />
            </Card>
          </div>
        </div>

        <div>
          <Title level={4} style={{ color: '#1890ff', marginBottom: 16, textAlign: 'center' }}>
            Wind Speed Trend
          </Title>
          <div className="chart-container">
            <Card style={cardStyles} className="chart-card" hoverable>
              <Line {...windConfig} />
            </Card>
          </div>
        </div>

        <div>
          <Title level={4} style={{ color: '#1890ff', marginBottom: 16, textAlign: 'center' }}>
            Detailed Stats
          </Title>
          <Card style={cardStyles} className="chart-card" hoverable>
            <div className="stats-container">
              {hourlyData.slice(0,1).map((item, index) => (
                <React.Fragment key={index}>
                  <Text style={{ color: '#4a90e2', fontSize: '14px' }}>
                    Visibility: <Text strong style={{ color: '#1890ff' }}>{item.visibility / 1000} km</Text>
                  </Text>
                  <Text style={{ color: '#4a90e2', fontSize: '14px' }}>
                    Cloudiness: <Text strong style={{ color: '#1890ff' }}>{item.clouds.all}%</Text>
                  </Text>
                  <Text style={{ color: '#4a90e2', fontSize: '14px' }}>
                    Dew Point: <Text strong style={{ color: '#1890ff' }}>{Math.round(item.main.temp - ((100 - item.main.humidity) / 5))}°{unit === 'metric' ? 'C' : 'F'}</Text>
                  </Text>
                  {item.main.grnd_level && (
                    <Text style={{ color: '#4a90e2', fontSize: '14px' }}>
                      Ground Pressure: <Text strong style={{ color: '#1890ff' }}>{item.main.grnd_level} hPa</Text>
                    </Text>
                  )}
                  {item.main.sea_level && (
                    <Text style={{ color: '#4a90e2', fontSize: '14px' }}>
                      Sea Pressure: <Text strong style={{ color: '#1890ff' }}>{item.main.sea_level} hPa</Text>
                    </Text>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </div>
      </Flex>
    </div>
  );
};

export default WeatherCharts;