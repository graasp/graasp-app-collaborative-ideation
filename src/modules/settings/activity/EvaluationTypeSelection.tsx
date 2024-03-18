import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { ActivitySetting } from '@/config/appSettingsType';
import { EvaluationType } from '@/interfaces/evaluationType';

interface EvaluationTypeSelectionProps {
  evaluationType: ActivitySetting['evaluationType'];
  onChange: (newEvaluationType: ActivitySetting['evaluationType']) => void;
}

const EvaluationTypeSelection: FC<EvaluationTypeSelectionProps> = ({
  evaluationType,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <FormControl>
      <FormLabel>{t('SETTINGS.EVALUATION_TYPE_SELECTION.TITLE')}</FormLabel>
      <RadioGroup
        aria-labelledby="evaluation-type-radio-button"
        defaultValue={EvaluationType.UsefulnessNoveltyRating}
        value={evaluationType}
        name="radio-buttons-group"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange((event.target as HTMLInputElement).value as EvaluationType);
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
          value={EvaluationType.DimensionsOfGIRating}
          control={<Radio />}
          label={t('SETTINGS.EVALUATION_TYPE_SELECTION.DIMENSIONS_OF_GI_BTN')}
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
                label={t('COMING_SOON')}
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
