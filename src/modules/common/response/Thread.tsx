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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps, useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles/createTheme';
import styled from '@mui/material/styles/styled';

import { useLocalContext } from '@graasp/apps-query-client';

import { RESPONSES_TOP_COLORS } from '@/config/constants';
import { RESPONSE_CY } from '@/config/selectors';
import type { Thread } from '@/interfaces/threads';

import Response from './Response';

const TopAnnotationTypography = styled(Typography)(() => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
}));

interface ThreadProps {
  thread: Thread;
  onSelect?: (id: string) => void;
  enableBuildAction?: boolean;
  onDelete?: (id: string) => void;
  highlight?: boolean;
}

const Thread: FC<ThreadProps> = ({
  thread,
  onSelect,
  onDelete,
  enableBuildAction = true,
  highlight = false,
}) => {
  const { t } = useTranslation('translations', { keyPrefix: 'RESPONSE_CARD' });
  const { accountId } = useLocalContext();
  const theme = useTheme();
  const { id, responses, creator } = thread;

  const isOwn = creator?.id === accountId;
  const isAiGenerated = useMemo(
    () => creator?.isArtificial || false,
    [creator?.isArtificial],
  );

  const showSelectButton = typeof onSelect !== 'undefined';
  const showDeleteButton = typeof onDelete !== 'undefined' && isOwn;
  const showActions = showDeleteButton || showSelectButton;

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
    const rLength = id.charCodeAt(0);
    const colorIndex = rLength % RESPONSES_TOP_COLORS.length;
    return {
      backgroundColor: RESPONSES_TOP_COLORS[colorIndex],
    };
  };

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
          <Stack
            direction="column"
            spacing={2}
            sx={{ width: '100%' }}
            divider={<Divider flexItem />}
          >
            {responses.map((response) => (
              <Response key={response.id} response={response} thread={thread} />
            ))}
          </Stack>
        </CardContent>
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
              <Box>
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
              </Box>
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
};

export default Thread;
