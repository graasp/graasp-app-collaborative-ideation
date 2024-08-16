import { RatingsSet } from '@/config/ratings/Ratings';
import { EvaluationParameters } from '@/interfaces/evaluation';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FC, useEffect, useState } from 'react';

interface RateSettingsProps {
  onChange: (newRateSettings: EvaluationParameters) => void;
  evaluationParameters: EvaluationParameters;
}

const RateSettings: FC<RateSettingsProps> = ({
  evaluationParameters,
  onChange,
}) => {
  const [selectedSet, setSelectedSet] = useState(0);

  useEffect(() => {
    setSelectedSet(
      RatingsSet.findIndex((s) => s.name === evaluationParameters?.ratingsName),
    );
  }, [evaluationParameters]);

  const handleChange = (event: SelectChangeEvent): void => {
    const newSetIndex = parseInt(event.target.value, 10);
    setSelectedSet(newSetIndex);
    const newSet = RatingsSet[newSetIndex];
    const newEvaluationParameters: EvaluationParameters = {
      ratingsName: newSet.name,
      ratings: newSet.set,
    };
    onChange(newEvaluationParameters);
  };

  return (
    <Select
      value={selectedSet.toString(10)}
      label="Set"
      onChange={handleChange}
    >
      {RatingsSet.map((s, index) => (
        <MenuItem value={index} key={index}>
          {s.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default RateSettings;
