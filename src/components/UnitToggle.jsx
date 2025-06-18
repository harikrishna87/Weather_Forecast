import React from 'react';
import { Switch, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setUnit } from '../store/weatherslice';

const { Text } = Typography;

const UnitToggle = () => {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.weather.unit);

  const handleUnitChange = (checked) => {
    const newUnit = checked ? 'imperial' : 'metric';
    dispatch(setUnit(newUnit));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Text>°C</Text>
      <Switch
        checked={unit === 'imperial'}
        onChange={handleUnitChange}
        checkedChildren="°F"
        unCheckedChildren="°C"
      />
      <Text>°F</Text>
    </div>
  );
};

export default UnitToggle;