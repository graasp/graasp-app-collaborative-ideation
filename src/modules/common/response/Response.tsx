import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';

import { ResponseData } from '@/config/appDataTypes';

const Response: FC<{
  responseId: string;
  response: ResponseData;
  onSelect?: (id: string) => void;
  enableBuildAction?: boolean;
}> = ({ responseId, response, onSelect, enableBuildAction = true }) => {
  const { t } = useTranslation();

  const showSelectButton = typeof onSelect !== 'undefined';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderEvaluationComponent = (): JSX.Element => {
    throw new Error('Not implemented');
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: '30%',
        minWidth: '160pt',
        // backgroundColor:
        //   noveltyRating && relevanceRating ? green[100] : 'white',
        // borderColor: noveltyRating && relevanceRating ? green[700] : 'default',
      }}
    >
      <CardContent sx={{ minHeight: '32pt' }}>
        <Typography variant="body1">{response.response}</Typography>
        <Typography variant="body2" sx={{ color: grey.A700 }}>
          {t('ROUND', { round: response.round })}
        </Typography>
      </CardContent>
      {showSelectButton && (
        <>
          <Divider />
          <CardActions>
            <Button
              disabled={!enableBuildAction}
              onClick={() => {
                if (typeof onSelect !== 'undefined') onSelect(responseId);
              }}
            >
              {t('BUILD_ON_THIS_IDEA')}
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default Response;
