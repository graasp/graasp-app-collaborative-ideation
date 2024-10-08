import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { DEFAULT_EVALUATION_TYPE } from '@/config/constants';
import { EvaluationParameters, EvaluationType } from '@/interfaces/evaluation';

import RateSettings from './RateSettings';

interface EvaluationSettingsProps {
  evaluationType?: EvaluationType;
  evaluationParameters?: EvaluationParameters;
  onChange: (
    newEvaluationType: EvaluationType,
    newEvaluationParameters: EvaluationParameters,
  ) => void;
}

const EvaluationSettings: FC<EvaluationSettingsProps> = ({
  evaluationType: evaluationTypeProp,
  evaluationParameters: evaluationParametersProp,
  onChange,
}) => {
  const evaluationType = evaluationTypeProp ?? EvaluationType.Vote;
  const evaluationParameters = evaluationParametersProp ?? {};
  const { t: tEvaluationType } = useTranslation('translations', {
    keyPrefix: 'EVALUATION_TYPE',
  });

  const { t: tSettings } = useTranslation('translations', {
    keyPrefix: 'SETTINGS',
  });

  const { t } = useTranslation();

  const { maxNumberOfVotes } = evaluationParameters;

  const [maxNumberOfVotesStr, setMaxNumberOfVotesStr] = useState<string>('0');
  useEffect(() => {
    if (maxNumberOfVotes) {
      setMaxNumberOfVotesStr(maxNumberOfVotes.toString(10));
    }
  }, [maxNumberOfVotes]);

  const [maxNumberOfVotesError, setMaxNumberOfVotesError] = useState(false);

  const handleEvaluationTypeChange = (
    newEvaluationType: EvaluationType,
  ): void => {
    onChange(newEvaluationType, evaluationParameters);
  };

  const handleMaxNumberOfVotesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const val = event.target.value;
    setMaxNumberOfVotesStr(val);
    const newMaxNumberOfVotes = parseInt(val, 10);
    if (Number.isNaN(newMaxNumberOfVotes)) {
      setMaxNumberOfVotesError(true);
    } else {
      setMaxNumberOfVotesError(false);
      onChange(evaluationType, { maxNumberOfVotes: newMaxNumberOfVotes });
    }
  };

  const handleRateSettingsChange = (
    rateSettings: EvaluationParameters,
  ): void => {
    onChange(evaluationType, rateSettings);
  };

  const renderEvaluationParametersControls = (
    eT: EvaluationType,
  ): JSX.Element | null => {
    switch (eT) {
      case EvaluationType.Vote:
        return (
          <Box>
            <TextField
              value={maxNumberOfVotesStr}
              onChange={handleMaxNumberOfVotesChange}
              error={maxNumberOfVotesError}
            />
          </Box>
        );
      case EvaluationType.Rate:
        return (
          <Box>
            <RateSettings
              evaluationParameters={evaluationParameters}
              onChange={handleRateSettingsChange}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <FormControl>
        <FormLabel>{tSettings('EVALUATION_TYPE_SELECTION.TITLE')}</FormLabel>
        <RadioGroup
          aria-labelledby="evaluation-type-radio-button"
          defaultValue={DEFAULT_EVALUATION_TYPE}
          value={evaluationType}
          name="radio-buttons-group"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            handleEvaluationTypeChange(event.target.value as EvaluationType);
          }}
        >
          <FormControlLabel
            value={EvaluationType.Rate}
            control={<Radio />}
            label={tEvaluationType('RATE')}
          />
          <FormControlLabel
            value={EvaluationType.Rank}
            control={<Radio />}
            disabled
            label={
              <>
                {tEvaluationType('RANK')}
                <Chip
                  color="info"
                  sx={{ m: 1 }}
                  label={t('COMING_SOON')}
                  variant="outlined"
                />
              </>
            }
          />
          <FormControlLabel
            value={EvaluationType.Vote}
            control={<Radio />}
            label={tEvaluationType('VOTE')}
          />
        </RadioGroup>
      </FormControl>
      {renderEvaluationParametersControls(evaluationType)}
    </Stack>
  );
};

export default EvaluationSettings;
