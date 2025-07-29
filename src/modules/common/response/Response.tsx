import { FC, JSX, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps, useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles/createTheme';
import styled from '@mui/material/styles/styled';

import { useLocalContext } from '@graasp/apps-query-client';

import { RESPONSES_TOP_COLORS } from '@/config/constants';
import { RESPONSE_CY } from '@/config/selectors';
import { ResponseVisibilityMode } from '@/interfaces/activity_state';
import { EvaluationType } from '@/interfaces/evaluation';
import { ResponseData, ResponseEvaluation } from '@/interfaces/response';
import { useSettings } from '@/modules/context/SettingsContext';

import ResponsePart from './ResponsePart';
import Rate from './evaluation/Rate';
import Vote from './evaluation/Vote';
import RatingsVisualization from './visualization/RatingsVisualization';
import Votes from './visualization/Votes';

const TopAnnotationTypography = styled(Typography)(() => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
}));

interface ResponseProps {
  response: ResponseData<ResponseEvaluation>;
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
  const theme = useTheme();
  const {
    id,
    response: responseContent,
    author,
    round,
    parentId,
    assistantId,
    markup,
  } = response;
  const { activity } = useSettings();

  const isMarkdown = useMemo(() => markup === 'markdown', [markup]);

  const isAiGenerated = useMemo(
    () => typeof assistantId === 'string',
    [assistantId],
  );
  const isOwn = author?.id === accountId && !isAiGenerated;

  const showSelectButton = typeof onSelect !== 'undefined';
  const showDeleteButton = typeof onDelete !== 'undefined' && isOwn;
  const showActions = showDeleteButton || showSelectButton;
  const isLive = activity.mode === ResponseVisibilityMode.Sync;

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

  const renderTopResponseAnnotation = (): JSX.Element => {
    if (isAiGenerated) {
      return (
        <TopAnnotationTypography variant="caption" color="white">
          {t('AI_GENERATED')}
        </TopAnnotationTypography>
      );
    }
    if (isOwn) {
      return (
        <TopAnnotationTypography color="GrayText" variant="caption">
          {t('OWN')}
        </TopAnnotationTypography>
      );
    }
    return <div />;
  };

  const getTopAnnotationBoxStyle = (): SxProps<Theme> => {
    if (isAiGenerated) {
      return {
        backgroundColor: theme.palette.primary.main,
      };
    }
    const rLength = responseContent.length;
    const colorIndex = rLength % RESPONSES_TOP_COLORS.length;
    return {
      backgroundColor: RESPONSES_TOP_COLORS[colorIndex],
    };
  };

  if (responseContent) {
    return (
      <Box
        minWidth="160pt"
        width="100%"
        borderRadius="4px"
        sx={{
          ...getTopAnnotationBoxStyle(),
          boxShadow: highlight
            ? '0 0 8pt 4pt hsla(47.8, 100%, 50%, 0.8)'
            : 'none',
          transition: 'box-shadow 500ms',
        }}
      >
        <Stack
          height="2em"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          {renderTopResponseAnnotation()}
        </Stack>
        <Card
          id={id}
          variant="outlined"
          sx={{
            width: '100%',
          }}
          data-cy={RESPONSE_CY}
        >
          <CardContent sx={{ minHeight: '32pt' }}>
            <ResponsePart markdown={isMarkdown}>{responseContent}</ResponsePart>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isAiGenerated
                    ? theme.palette.grey.A400
                    : theme.palette.grey.A700,
                }}
              >
                {!isLive && generalT('ROUND', { round })}
                {parentId && (
                  <>
                    {' • '}
                    <Link
                      href={`#${parentId}`}
                      onClick={() => {
                        document.getElementById(parentId)?.scrollIntoView();
                        onParentIdeaClick(parentId);
                      }}
                    >
                      {t('PARENT_IDEA')}
                    </Link>
                  </>
                )}
              </Typography>
            </Box>
          </CardContent>
          {renderEvaluationComponent()}
          {showRatings && <RatingsVisualization responseId={id} />}
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
      </Box>
    );
  }
  return null;
};

export default Response;
