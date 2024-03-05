import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';

import { ResponseAppData } from '@/config/appDataTypes';
import { EvaluationType } from '@/interfaces/evaluationType';

import Chip from '@mui/material/Chip';
import UsefulnessNoveltyRating from './evaluation/UsefulnessNoveltyRating';

const Response: FC<{
  response: ResponseAppData;
  onSelect?: (id: string) => void;
  enableBuildAction?: boolean;
  evaluationType?: EvaluationType;
  onDelete?: (id: string) => void;
  own?: boolean;
}> = ({
  response,
  onSelect,
  onDelete,
  enableBuildAction = true,
  evaluationType = EvaluationType.None,
  own = false,
}) => {
  const { t } = useTranslation('translations', { keyPrefix: 'RESPONSE_CARD' });
  const { t: generalT } = useTranslation('translations');

  const showSelectButton = typeof onSelect !== 'undefined';
  const showDeleteButton = typeof onDelete !== 'undefined';
  const showActions = showDeleteButton || showSelectButton;

  const { id, data } = response;
  const { response: responseContent, round } = data;

  const renderEvaluationComponent = (): JSX.Element => {
    if (evaluationType === EvaluationType.UsefulnessNoveltyRating) {
      return <UsefulnessNoveltyRating responseId={id} />;
    }
    return <p>Vote</p>; // TODO: implement
  };

  return (
    <Card
      variant="outlined"
      sx={{
        // maxWidth: '30%',
        minWidth: '160pt',
        // backgroundColor:
        //   noveltyRating && relevanceRating ? green[100] : 'white',
        // borderColor: noveltyRating && relevanceRating ? green[700] : 'default',
      }}
    >
      <CardContent sx={{ minHeight: '32pt' }}>
        {own && <Chip label={t('OWN')} />}
        <Typography variant="body1" sx={{ overflowWrap: 'break-word' }}>
          {responseContent}
        </Typography>
        <Typography variant="body2" sx={{ color: grey.A700 }}>
          {generalT('ROUND', { round })}
        </Typography>
      </CardContent>
      {evaluationType !== EvaluationType.None && renderEvaluationComponent()}
      {showActions && (
        <>
          <Divider />
          <CardActions>
            {showSelectButton && (
              <Button
                disabled={!enableBuildAction}
                onClick={() => {
                  if (typeof onSelect !== 'undefined') onSelect(id);
                }}
              >
                {t('BUILD_ON_THIS')}
              </Button>
            )}
            {showDeleteButton && (
              <IconButton
                sx={{ marginLeft: 'auto' }}
                onClick={() => onDelete(id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default Response;
