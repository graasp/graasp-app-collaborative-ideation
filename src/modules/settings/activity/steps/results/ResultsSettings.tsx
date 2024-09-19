import { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { EvaluationType } from '@/interfaces/evaluation';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface ResultsSettingsProps {
  resultsType?: EvaluationType;
  onChange: (newResultsType: EvaluationType) => void;
}

const EvaluationSettings: FC<ResultsSettingsProps> = ({
  resultsType: resultsTypeProp,
  onChange,
}) => {
  const resultsType = resultsTypeProp ?? EvaluationType.Vote;
  const { t: tEvaluationType } = useTranslation('translations', {
    keyPrefix: 'EVALUATION_TYPE',
  });

  const { t: tSettings } = useTranslation('translations', {
    keyPrefix: 'SETTINGS',
  });

  const { t } = useTranslation();

  const handleResultsTypeChange = (newResultsType: EvaluationType): void => {
    onChange(newResultsType);
  };

  return (
    <Stack direction="row" spacing={1}>
      <FormControl>
        <FormLabel>{tSettings('EVALUATION_TYPE_SELECTION.TITLE')}</FormLabel>
        <RadioGroup
          aria-labelledby="evaluation-type-radio-button"
          defaultValue={EvaluationType.Vote}
          value={resultsType}
          name="radio-buttons-group"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            handleResultsTypeChange(event.target.value as EvaluationType);
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
    </Stack>
  );
};

export default EvaluationSettings;
