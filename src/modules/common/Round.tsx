import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface RoundProps {
  round: number;
}

const Round: FC<RoundProps> = ({ round }) => {
  const { t } = useTranslation('translations', { keyPrefix: 'ROUND_COMP' });

  const theme = useTheme();

  return (
    <Stack
      direction="column"
      spacing={0.5}
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.primary.main,
        p: 1,
        borderRadius: 1,
        mr: 2,
      }}
    >
      <Typography sx={{ color: 'white' }} variant="caption">
        {t('ROUND')}
      </Typography>
      <Typography sx={{ color: 'white' }} variant="body1">
        {round}
      </Typography>
    </Stack>
  );
};

export default Round;
