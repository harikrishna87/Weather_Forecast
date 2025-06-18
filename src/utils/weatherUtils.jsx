export const getWeatherIconUrl = (iconCode) => {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const formatTemperature = (temp, unit) => {
  if (unit === 'metric') {
    return `${Math.round(temp)}°C`;
  }
  return `${Math.round(temp)}°F`;
};

export const getWindDirection = (deg) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};