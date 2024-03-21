import { RatingsAppData } from '@/config/appDataTypes';
import { SFERARating } from '@/interfaces/ratings';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import LinearIndicator from './indicators/LinearIndicator';

const RATING_SCALE = 5;

const SFERA = ({
  ratings,
}: {
  ratings: RatingsAppData<SFERARating>[];
}): JSX.Element => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RATINGS.SFERA',
  });
  //   const { t: tGeneral } = useTranslation('translations');
  const boxRef = useRef<HTMLElement>();
  const [, updateState] = useState<object>();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    forceUpdate();
  }, [boxRef, forceUpdate]);

  const reshapedData = useMemo(() => {
    const d = ratings.map(({ data }) => [
      {
        group: 'scope',
        value: data.ratings.globalLocal ?? 0,
      },
      {
        group: 'interest',
        value: data.ratings.personalGeneral ?? 0,
      },
    ]);
    return d.flat();
  }, [ratings]);
  return (
    <Container>
      <Box ref={boxRef} width="100%">
        <LinearIndicator
          data={reshapedData}
          maxValue={RATING_SCALE}
          leftLabels={[
            ['scope', t('LOCAL')],
            ['interest', t('PERSONAL')],
          ]}
          rightLabels={[
            ['scope', t('GLOBAL')],
            ['interest', t('GENERAL')],
          ]}
          width={boxRef.current?.clientWidth ?? 100}
          height={75}
        />
      </Box>
    </Container>
  );
};

export default SFERA;
