import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { EvaluationType } from '@/interfaces/evaluationType';

import { useSettings } from '../context/SettingsContext';

const EvaluationTypeSelection: FC = () => {
  const { t } = useTranslation();
  const { evaluation, saveSettings } = useSettings();
  const evaluationType = useMemo(() => evaluation.type, [evaluation]);
  const setEvaluationType = (type: EvaluationType): void => {
    saveSettings('evaluation', {
      type,
    });
  };
  return (
    <FormControl>
      <FormLabel>{t('SETTINGS.EVALUATION_TYPE_SELECTION.TITLE')}</FormLabel>
      <RadioGroup
        aria-labelledby="evaluation-type-radio-button"
        defaultValue={EvaluationType.UsefulnessNoveltyRating}
        value={evaluationType}
        name="radio-buttons-group"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEvaluationType(
            (event.target as HTMLInputElement).value as EvaluationType,
          );
        }}
      >
        <FormControlLabel
          value={EvaluationType.None}
          control={<Radio />}
          label={t('SETTINGS.EVALUATION_TYPE_SELECTION.NONE_BTN')}
        />
        <FormControlLabel
          value={EvaluationType.UsefulnessNoveltyRating}
          control={<Radio />}
          label={t('SETTINGS.EVALUATION_TYPE_SELECTION.USE_NOV_RATINGS_BTN')}
        />
        <FormControlLabel
          value={EvaluationType.Vote}
          control={<Radio />}
          label={
            <>
              {t('SETTINGS.EVALUATION_TYPE_SELECTION.VOTE_BTN')}
              <Chip
                color="info"
                sx={{ m: 1 }}
                label="Coming soon!"
                variant="outlined"
              />
            </>
          }
          disabled
        />
      </RadioGroup>
    </FormControl>
  );
};

export default EvaluationTypeSelection;
