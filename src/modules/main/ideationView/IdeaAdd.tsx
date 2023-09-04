import { FC } from 'react';

import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';

import { Button } from '@graasp/ui';

import { Derivation, IdeaAppData } from '@/config/appDataTypes';

const buttonStyle: SxProps = {
  height: 'fit-content',
};

const IdeaAdd: FC<{
  idea: IdeaAppData;
  onDerivationChoose: (d: Derivation) => void;
}> = ({ idea, onDerivationChoose }) => (
  <>
    <Stack direction="row" spacing={4}>
      <Button sx={buttonStyle} onClick={() => onDerivationChoose('lateral')}>
        Lateral
      </Button>
      {/* <Idea idea={idea} /> */}
      <Button sx={buttonStyle} onClick={() => onDerivationChoose('variation')}>
        Variation
      </Button>
    </Stack>
    <Button sx={buttonStyle} onClick={() => onDerivationChoose('precision')}>
      Precision
    </Button>
  </>
);

export default IdeaAdd;
