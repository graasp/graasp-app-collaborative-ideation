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
import { useLocalContext } from '@graasp/apps-query-client';
import Box from '@mui/material/Box';
import UsefulnessNoveltyRating from './evaluation/UsefulnessNoveltyRating';
import DimensionsOfGlobalIssueRating from './evaluation/DimensionsOfGlobalIssueRating';
import RatingsVisualization from './visualization/RatingsVisualization';
import SFERARating from './evaluation/SFERARating';

const Response: FC<{
  response: ResponseAppData;
  onSelect?: (id: string) => void;
  enableBuildAction?: boolean;
  evaluationType?: EvaluationType;
  onDelete?: (id: string) => void;
  showRatings?: boolean;
}> = ({
  response,
  onSelect,
  onDelete,
  enableBuildAction = true,
  evaluationType = EvaluationType.None,
  showRatings = false,
}) => {
  const { t } = useTranslation('translations', { keyPrefix: 'RESPONSE_CARD' });
  const { t: generalT } = useTranslation('translations');
  const { memberId } = useLocalContext();

  const { id, data, creator } = response;
  const { response: responseContent, round } = data;

  const isOwn = creator?.id === memberId;

  const showSelectButton = typeof onSelect !== 'undefined';
  const showDeleteButton = typeof onDelete !== 'undefined' && isOwn;
  const showActions = showDeleteButton || showSelectButton;

  const renderEvaluationComponent = (): JSX.Element => {
    if (evaluationType === EvaluationType.UsefulnessNoveltyRating) {
      return <UsefulnessNoveltyRating responseId={id} />;
    }
    if (evaluationType === EvaluationType.DimensionsOfGIRating) {
      return <DimensionsOfGlobalIssueRating responseId={id} />;
    }
    if (evaluationType === EvaluationType.SFERARating) {
      return <SFERARating responseId={id} />;
    }
    return <p>Vote</p>; // TODO: implement
  };

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: '160pt',
      }}
    >
      <CardContent sx={{ minHeight: '32pt' }}>
        <Typography variant="body1" sx={{ overflowWrap: 'break-word' }}>
          {responseContent}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" sx={{ color: grey.A700 }}>
            {generalT('ROUND', { round })}
          </Typography>
          {isOwn && (
            <Chip
              sx={{ ml: '1rem' }}
              variant="outlined"
              size="small"
              color="info"
              label={t('OWN')}
            />
          )}
        </Box>
      </CardContent>
      {evaluationType !== EvaluationType.None && renderEvaluationComponent()}
      {showRatings && <RatingsVisualization response={response} />}
      {showActions && (
        <>
          <Divider />
          <CardActions
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
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
