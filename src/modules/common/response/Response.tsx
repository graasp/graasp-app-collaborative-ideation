import { FC, useMemo } from 'react';
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

import Chip from '@mui/material/Chip';
import { useLocalContext } from '@graasp/apps-query-client';
import Box from '@mui/material/Box';
import { RESPONSE_CY } from '@/config/selectors';
import { EvaluationType } from '@/interfaces/evaluation';
import { ResponseEvaluation } from '@/interfaces/response';
import RatingsVisualization from './visualization/RatingsVisualization';
import Vote from './evaluation/Vote';
import Rate from './evaluation/Rate';
import Votes from './visualization/Votes';

const ResponsePart: FC<{ children: string }> = ({ children }) => (
  <Typography variant="body1" sx={{ overflowWrap: 'break-word', mb: 1 }}>
    {children}
  </Typography>
);

interface ResponseProps {
  response: ResponseAppData<ResponseEvaluation>;
  onSelect?: (id: string) => void;
  enableBuildAction?: boolean;
  onDelete?: (id: string) => void;
  showRatings?: boolean;
  onParentIdeaClick?: (id: string) => void;
  highlight?: boolean;
  evaluationType?: EvaluationType;
  nbrOfVotes?: number;
}

const Response: FC<ResponseProps> = ({
  response,
  onSelect,
  onDelete,
  evaluationType,
  enableBuildAction = true,
  showRatings = false,
  onParentIdeaClick = (id: string) =>
    // eslint-disable-next-line no-console
    console.debug(`The user clicked on link to idea ${id}`),
  highlight = false,
  nbrOfVotes,
}) => {
  const { t } = useTranslation('translations', { keyPrefix: 'RESPONSE_CARD' });
  const { t: generalT } = useTranslation('translations');
  const { accountId } = useLocalContext();

  const { id, data, creator } = response;
  const { response: responseContent, round, parentId, assistantId } = data;

  const isOwn = creator?.id === accountId && typeof assistantId === 'undefined';
  const isAiGenerated = useMemo(
    () => typeof assistantId !== 'undefined',
    [assistantId],
  );

  const showSelectButton = typeof onSelect !== 'undefined';
  const showDeleteButton = typeof onDelete !== 'undefined' && isOwn;
  const showActions = showDeleteButton || showSelectButton;

  const renderEvaluationComponent = (): JSX.Element | null => {
    switch (evaluationType) {
      case EvaluationType.Vote:
        return <Vote responseId={id} />;
      case EvaluationType.Rate:
        return <Rate responseId={id} />;
      // case EvaluationType.Rank:
      //   return <Rank responseId={id} />;
      default:
        return null;
    }
  };

  return (
    <Card
      id={id}
      variant="outlined"
      sx={{
        minWidth: '160pt',
        backgroundColor: highlight ? 'hsla(0, 100%, 90%, 0.3)' : 'transparent',
        boxShadow: highlight ? '0 0 8pt 4pt hsla(0, 100%, 90%, 0.3)' : 'none',
      }}
      data-cy={RESPONSE_CY}
    >
      <CardContent sx={{ minHeight: '32pt' }}>
        {typeof responseContent === 'string' ? (
          <ResponsePart>{responseContent}</ResponsePart>
        ) : (
          responseContent?.map((r, index) => (
            <>
              {/* {index !== 0 && <br />} */}
              <ResponsePart key={index}>{r}</ResponsePart>
            </>
          ))
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" sx={{ color: grey.A700 }}>
            {generalT('ROUND', { round })}
            {parentId && (
              <>
                {' • '}
                <a
                  href={`#${parentId}`}
                  onClick={() => {
                    document.getElementById(parentId)?.scrollIntoView();
                    onParentIdeaClick(parentId);
                  }}
                >
                  {t('PARENT_IDEA')}
                </a>
              </>
            )}
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
          {isAiGenerated && (
            <Chip
              sx={{ ml: '1rem' }}
              variant="outlined"
              size="small"
              color="success"
              label={t('AI_GENERATED')}
            />
          )}
        </Box>
      </CardContent>
      {renderEvaluationComponent()}
      {showRatings && <RatingsVisualization />}
      {typeof nbrOfVotes !== 'undefined' && <Votes votes={nbrOfVotes} />}
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
