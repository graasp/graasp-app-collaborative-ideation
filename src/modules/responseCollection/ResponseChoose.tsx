import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ResponsesData } from '@/config/appDataTypes';
import Idea from '@/modules/common/response/Response';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import Loader from '../common/Loader';

interface ResponseChooseProps {
  ideas: ResponsesData;
  onChoose: (id?: string) => void;
}

const ResponseChoose: FC<ResponseChooseProps> = ({ ideas, onChoose }) => {
  const { t } = useTranslation();
  const { isLoading, invalidateAppData } = useAppDataContext();

  const handleChoose = (id?: string): void => {
    onChoose(id);
  };

  const renderPlaceHolderForNoIdeas = (): JSX.Element => {
    if (isLoading) {
      return <Loader />;
    }
    return (
      <>
        <Alert sx={{ m: 1 }} severity="info">
          {t('NO_IDEAS_TO_SHOW_TEXT')}
        </Alert>
        <Button onClick={() => invalidateAppData()}>
          {t('CHECK_FOR_NEW_IDEAS')}
        </Button>
      </>
    );
  };

  return (
    <>
      <Typography variant="body1">{t('CHOOSE_IDEA_HEADER_TEXT')}</Typography>
      <Grid container spacing={2}>
        {ideas
          ? ideas.map((idea) => (
              <Grid key={idea.id} md={4} sm={6} xs={12}>
                <Idea
                  key={idea.id}
                  response={idea}
                  responseId={idea.id}
                  onSelect={handleChoose}
                />
              </Grid>
            ))
          : renderPlaceHolderForNoIdeas()}
      </Grid>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleChoose()}
      >
        {t('PROPOSE_NEW_IDEA')}
      </Button>
    </>
  );
};

export default ResponseChoose;
